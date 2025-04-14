import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const memes = await prisma.memes.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(memes);
  } catch (error) {
    console.error("Error fetching memes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
