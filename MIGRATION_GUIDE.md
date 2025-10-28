# AWS to Supabase Migration Guide

## 🎯 Migration Özeti

Bu proje AWS DynamoDB ve S3'ten Supabase PostgreSQL ve Supabase Storage'a migrate edilmiştir.

**Migration Tarihi:** 2025-10-11

---

## 📊 Değişiklikler

### 1. Database Migration (AWS DynamoDB → Supabase PostgreSQL + Prisma)

#### Önceki Yapı:
- **Database:** AWS DynamoDB
- **Table:** `spacecraft`
- **Key Schema:** `pk: USER#{userId}`, `sk: USER#{userId}`
- **Client:** AWS SDK (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`)

#### Yeni Yapı:
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma
- **Schema:** `prisma/schema.prisma`
- **Models:** User, Account, Session, VerificationToken, Image

#### Schema:
```prisma
model User {
  id             String    @id @default(cuid())
  name           String?
  email          String?   @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  credit         Int       @default(1)  // Default: 1 kredi
  accounts       Account[]
  sessions       Session[]
}
```

---

### 2. Authentication (NextAuth)

#### Değişiklikler:
- **Eski Adapter:** `DynamoDBAdapter` → **Yeni Adapter:** `PrismaAdapter`
- **Dosya:** `src/app/options/authOptions.tsx`

#### Kod Değişikliği:
```typescript
// ÖNCE:
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
const adapter = DynamoDBAdapter(client);

// SONRA:
import { PrismaAdapter } from "@next-auth/prisma-adapter";
const adapter = PrismaAdapter(prisma);
```

---

### 3. API Routes Migration

Tüm DynamoDB API'leri Prisma'ya çevrildi:

#### 3.1. `/api/getCredit`
**Önce:**
```typescript
const command = new GetCommand({
  TableName: "spacecraft",
  Key: { pk: `USER#${userId}`, sk: `USER#${userId}` },
});
const result = await ddbDocClient.send(command);
```

**Sonra:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { credit: true },
});
```

#### 3.2. `/api/addCredit`
**Önce:**
```typescript
const command = new UpdateCommand({
  TableName: "spacecraft",
  UpdateExpression: "ADD credit :inc",
  ExpressionAttributeValues: { ":inc": requestedCredit },
});
```

**Sonra:**
```typescript
const user = await prisma.user.update({
  where: { id: userId },
  data: { credit: { increment: requestedCredit } },
});
```

#### 3.3. `/api/useCredit`
**Önce:**
```typescript
UpdateExpression: "ADD credit :dec",
ExpressionAttributeValues: { ":dec": -1 },
```

**Sonra:**
```typescript
data: { credit: { decrement: 1 } },
```

#### 3.4. `/api/createCredit`
**Önce:** DynamoDB conditional expressions
**Sonra:** Prisma `findUnique` + `update`

---

### 4. Storage (Supabase Storage)

#### Yeni API:
- **Endpoint:** `/api/upload`
- **Bucket:** `zap` (v2sadtalker ile aynı bucket)
- **File Structure:** `{userId}/{category}/{uuid}.{extension}`

#### Özellikler:
- ✅ Authentication (NextAuth session kontrolü)
- ✅ File size validation (Max 100MB)
- ✅ MIME type validation (image, video, audio)
- ✅ Secure file naming (UUID)
- ✅ Public URL return

#### Kullanım:
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('category', 'videos'); // veya 'images', 'audios'

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { publicUrl } = await response.json();
```

---

### 5. Dependencies Değişiklikleri

#### Kaldırılan Paketler:
```json
{
  "@auth/dynamodb-adapter": "^1.6.0",
  "@aws-sdk/client-dynamodb": "^3.554.0",
  "@aws-sdk/lib-dynamodb": "^3.554.0",
  "@aws-sdk/types": "^3.201.0",
  "@aws-sdk/util-dynamodb": "^3.554.0",
  "@next-auth/dynamodb-adapter": "^3.0.2",
  "aws-sdk": "^2.1599.0",
  "aws-sdk-client-mock": "^0.6.2"
}
```

#### Eklenen Paketler:
```json
{
  "@prisma/client": "^5.22.0",
  "@next-auth/prisma-adapter": "^1.0.7",
  "@supabase/supabase-js": "^2.47.10",
  "prisma": "^5.22.0" (devDependencies)
}
```

---

### 6. Environment Variables

#### Kaldırılan:
```env
AUTH_DYNAMODB_ID=...
AUTH_DYNAMODB_SECRET=...
AUTH_DYNAMODB_REGION=...
```

#### Eklenen:
```env
# Supabase
SUPABASE_URL="https://ltxmikbwjonihojdhfpo.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://ltxmikbwjonihojdhfpo.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_ANON_KEY="..."

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.yxvbdmcmvqeztbcjycbf:...@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:...@db.yxvbdmcmvqeztbcjycbf.supabase.co:5432/postgres"
```

---

### 7. Yeni Utility Files

#### `src/lib/prisma.ts`
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

#### `src/lib/supabase.ts`
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🚀 Deployment Adımları

### 1. Database Setup
```bash
# Prisma client generate
npm run prisma:generate

# Database sync (ilk deployment)
npx prisma db push

# Veya migration oluştur
npm run prisma:migrate
```

### 2. Environment Variables
`.env` dosyasını production ortamına kopyalayın ve Supabase credentials'ları güncelleyin.

### 3. Supabase Storage Bucket Setup
1. Supabase Dashboard → Storage
2. `zap` bucket'ı oluşturun (eğer yoksa)
3. Bucket'ı **Public** yapın
4. Policies:
   - INSERT: Authenticated users
   - SELECT: Public (for public URLs)
   - UPDATE: Authenticated users (kendi dosyaları)
   - DELETE: Authenticated users (kendi dosyaları)

### 4. Build & Deploy
```bash
npm run build
npm start
```

---

## 🔧 Prisma Commands

```bash
# Prisma Client generate
npm run prisma:generate

# Database schema push (development)
npx prisma db push

# Create migration
npm run prisma:migrate

# Prisma Studio (database GUI)
npm run prisma:studio
```

---

## 📝 API Endpoints

### Credit Management
- `POST /api/getCredit` - Kullanıcının kredisini getir
- `POST /api/addCredit` - Kullanıcıya kredi ekle
- `POST /api/useCredit` - Kullanıcının kredisini kullan (1 azalt)
- `POST /api/createCredit` - Yeni kullanıcı için kredi initialize et

### File Upload
- `POST /api/upload` - Dosya yükle (image, video, audio)
  - FormData: `file`, `category`
  - Returns: `{ publicUrl: string }`

---

## ⚠️ Breaking Changes

### 1. User Credit Default Value
- **Önce:** DynamoDB'de manuel initialization gerekiyordu
- **Sonra:** Prisma schema'da `credit Int @default(1)` ile otomatik

### 2. API Response Format
API responses değişmedi, sadece backend implementation değişti.

### 3. File Structure
Supabase Storage kullanıldığı için dosya yolları:
- **Format:** `{userId}/{category}/{uuid}.{extension}`
- **Bucket:** `zap`

---

## 🔄 Data Migration (Eğer eski veriler varsa)

Eğer AWS DynamoDB'de mevcut kullanıcı verileri varsa:

1. DynamoDB'den export:
```bash
aws dynamodb scan --table-name spacecraft --output json > users.json
```

2. Supabase'e import script'i yazın veya manuel olarak migrate edin.

---

## 🎉 Avantajlar

### Supabase + Prisma ile:
1. **Type Safety:** Prisma ile tam TypeScript desteği
2. **Developer Experience:** Prisma Studio ile database yönetimi
3. **Cost:** DynamoDB'den daha uygun fiyatlandırma
4. **Unified Stack:** Database + Storage + Auth tek platformda
5. **Real-time:** Supabase real-time subscriptions (opsiyonel)
6. **SQL:** Tanıdık SQL syntax ve ilişkisel veritabanı
7. **Same Infrastructure:** v2sadtalker ile aynı database ve storage

---

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Prisma logs: `console.log()` ile debug
2. Supabase Dashboard: Database ve Storage loglarını kontrol edin
3. NextAuth debug mode: `.env` → `NEXTAUTH_DEBUG=true`

---

**Migration Completed Successfully! 🎊**
