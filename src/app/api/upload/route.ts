// app/api/upload/route.ts
export const maxDuration = 60;
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/options/authOptions";
import { randomUUID } from 'crypto';

// URL'deki tırnak işaretlerini ve noktalı virgülü temizle
const cleanUrl = (url: string) => {
  return url.replace(/['"]/g, '').split(';')[0];
};

// Sunucu tarafı Supabase client (Service Role Key ile)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const MAX_FILE_SIZE_MB = 100; // Maksimum 100MB dosya boyutu
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = [ // İzin verilen dosya türleri
  'image/jpeg',
  'image/png',
  'image/jpg',
  'video/mp4',
  'video/quicktime', // .mov
  'audio/mpeg', // .mp3
  'audio/wav',
  'audio/x-wav',
  // İhtiyaca göre ekleyin
];

export async function POST(request: NextRequest) {
  try {
    // 1. Kullanıcı oturumunu al (next-auth ile)
    const session = await getServerSession(authOptions);

    // Oturum yoksa veya kullanıcı bilgisi eksikse yetkilendirme hatası
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const userId = session.user.id; // Güvenli kullanıcı ID'si

    // 2. Dosyayı FormData'dan al
    const formData = await request.formData();
    const file = formData.get('file') as File | null; // Client'tan 'file' key'i ile gönderilmeli
    const category = (formData.get('category') as string) || 'general'; // Kategori bilgisi, yoksa 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // 3. Sunucu Tarafı Doğrulamalar
    // Dosya Boyutu Kontrolü
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.` }, { status: 413 }); // 413 Payload Too Large
    }

    // Dosya Tipi (MIME Type) Kontrolü
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
       return NextResponse.json({ error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` }, { status: 415 }); // 415 Unsupported Media Type
    }

    // 4. Benzersiz ve Güvenli Dosya Adı Oluşturma
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    // Dosyaları kullanıcı bazlı ve kategori bazlı klasörlerde saklamak
    const uniqueFileName = `${userId}/${category}/${randomUUID()}.${fileExtension}`;
    const bucketName = 'zap'; // Bucket adınız (v2sadtalker ile aynı)

    // 5. Dosyayı Supabase Storage'a Yükle (Service Role ile)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(uniqueFileName, file, {
        // cacheControl: '3600', // İsteğe bağlı cache ayarı
        upsert: false, // Aynı isimde dosya varsa hata ver (daha güvenli)
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      // Daha detaylı hata yönetimi eklenebilir (örn: bucket yoksa, izin hatası vs.)
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    // 6. Yüklenen dosyanın Public URL'ini al
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(uploadData.path); // uploadData.path kullanılıyor

    if (!publicUrlData?.publicUrl) {
      // Bu pek olası değil ama kontrol etmekte fayda var
      console.error('Failed to get public URL after upload for path:', uploadData.path);
      throw new Error('Failed to get public URL after successful upload.');
    }

    // 7. Başarılı yanıtı (Public URL ile) Client'a gönder
    console.log(`File uploaded successfully for user ${userId}: ${publicUrlData.publicUrl}`);
    return NextResponse.json({ publicUrl: publicUrlData.publicUrl });

  } catch (error: any) {
    console.error('API Error uploading file:', error);
    // Oturum hatasını tekrar kontrol et (gerçi yukarıda yakalanıyor)
    if (error.message === 'Authentication required.') {
       return NextResponse.json({ error: error.message }, { status: 401 });
    }
    // Genel sunucu hatası
    return NextResponse.json({ error: 'File upload failed due to a server error.', details: error.message }, { status: 500 });
  }
}
