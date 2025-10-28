import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.userId;

  try {
    // Check if user exists and if credit is already set
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { credit: true },
    });

    if (!existingUser) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    if (existingUser.credit !== 0) {
      return new Response(
        JSON.stringify({ message: "Credit already exists" }),
        { status: 409 }
      );
    }

    // Update credit to 1 if it was 0
    const user = await prisma.user.update({
      where: { id: userId },
      data: { credit: 1 },
      select: { credit: true },
    });

    return new Response(
      JSON.stringify({
        message: "Credit initialized",
        credits: user.credit,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Prisma error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
