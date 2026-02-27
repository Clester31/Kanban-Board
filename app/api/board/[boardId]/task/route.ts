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

    const tasks = await prisma.task.findMany({
      where: {
        column: {
          boardId: boardId,
        },
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        subtasks: {
          orderBy: {
            position: 'asc',
          },
        },
        tags: true,
      },
    });

    const tasksByColumn: Record<string, typeof tasks> = {};
    
    tasks.forEach(task => {
      if (!tasksByColumn[task.columnId]) {
        tasksByColumn[task.columnId] = [];
      }
      tasksByColumn[task.columnId].push(task);
    });

    return NextResponse.json(tasksByColumn, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}