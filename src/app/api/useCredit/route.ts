import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.userId;

  const currentCredits = await getCurrentCredits(userId);
  if (currentCredits <= 0) {
    return new Response(
      JSON.stringify({
        message: "Insufficient credits",
      }),
      { status: 403 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        credit: {
          decrement: 1,
        },
      },
      select: { credit: true },
    });

    return new Response(
      JSON.stringify({
        message: "Credit used successfully",
        newCreditTotal: user.credit,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

async function getCurrentCredits(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credit: true },
    });
    return user?.credit || 0;
  } catch (error) {
    console.error("Error retrieving credits:", error);
    return 0;
  }
}
