import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { Params } from "next/dist/server/request/params";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: any) {
  try {
    const id = parseInt(context.params.id as string);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const meme = await prisma.memes.findUnique({ where: { id } });
    if (!meme)
      return NextResponse.json({ error: "Meme not found" }, { status: 404 });

    return NextResponse.json(meme);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: any) {
  try {
    const id = parseInt(context.params.id as string);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const data = await req.json();
    const updated = await prisma.memes.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image,
        likesCount: data.likesCount,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
