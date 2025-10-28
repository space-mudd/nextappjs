import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const userId = body.userId;
  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credit: true },
    });

    console.log(user?.credit);
    if (user) {
      return new Response(JSON.stringify({ credit: user.credit }));
    } else {
      return new Response("User not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user credit:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
