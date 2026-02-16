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
    const { columnName, columnColor, boardId } = body;

    if (!columnName || !columnColor || !boardId) {
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

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        userId: user.id,
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const maxPosition = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newColumn = await prisma.column.create({
      data: {
        name: columnName,
        color: columnColor,
        position: (maxPosition?.position ?? -1) + 1,
        boardId: boardId,
      },
    });

    return NextResponse.json(newColumn, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create column" },
      { status: 500 },
    );
  }
}

