import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { boardId } = await params;

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    // Verify the board exists and belongs to the user
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        userId: user.id,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get all columns for this board, ordered by position
    const columns = await prisma.column.findMany({
      where: {
        boardId: boardId,
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        _count: {
          select: { tasks: true }, // Include task count per column
        },
      },
    });

    return NextResponse.json(columns, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch columns" },
      { status: 500 }
    );
  }
}