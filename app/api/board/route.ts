import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { boardName, boardDesc } = body;

    if (!boardName || !boardDesc) {
      return NextResponse.json(
        { error: "Incorrect body: missing fields" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const newBoard = await prisma.board.create({
      data: {
        name: boardName,
        description: boardDesc,
        isPinned: false,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userBoards = await prisma.board.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(userBoards, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch boards" },
      { status: 500 },
    );
  }
}
