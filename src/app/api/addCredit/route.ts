import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // Ensures Prisma works on Vercel’s Node runtime
export const dynamic = "force-dynamic"; // Avoids static build issues

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, requestedCredit } = body;

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        credit: {
          increment: requestedCredit ? requestedCredit : 1,
        },
      },
      select: { credit: true },
    });

    return NextResponse.json(
      {
        message: "Credit added successfully",
        newCreditTotal: user.credit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
