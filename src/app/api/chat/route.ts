export async function POST() {
  const output =
    "https://storage.googleapis.com/childrenstory-bucket/SKULL.mp4";
  return new Response(output);
}
