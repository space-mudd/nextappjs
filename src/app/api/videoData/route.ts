import { NextResponse } from "next/server";

export async function POST() {
  try {
    const museAiUrl = "https://muse.ai/collections/WQdRkN7/mrss";
    const response = await fetch(museAiUrl);
    const data = await response.text();

    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error("Muse.ai fetch error:", error);
    return NextResponse.json({ error: "Error fetching from Muse.ai" });
  }
}
