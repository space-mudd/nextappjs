import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body safely
    const body = await req.json();
    const { userId, requestedCredit } = body;

    // Basic validation
    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId" },
        { status: 400 }
      );
    }

    // Update user credit in Prisma
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        credit: {
          increment: requestedCredit && Number(requestedCredit) > 0 ? Number(requestedCredit) : 1,
        },
      },
      select: { credit: true },
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Credit added successfully",
        newCreditTotal: user.credit,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error in /api/addCredit:", error);

    // Handle Prisma errors explicitly (optional)
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message || error },
      { status: 500 }
    );
  }
}
