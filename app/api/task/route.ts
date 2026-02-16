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
    const { taskName, columnId } = body;

    if (!taskName || !columnId) {
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

    const column = await prisma.column.findFirst({
      where: {
        id: columnId,
      },
    });

    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    const maxPosition = await prisma.task.findFirst({
      where: { columnId: columnId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newTask = await prisma.task.create({
      data: {
        title: taskName,
        completed: false,
        position: (maxPosition?.position ?? -1) + 1,
        columnId: columnId,
      },
      include: {
        subtasks: true,
        tags: true,
      }
    });

    return NextResponse.json(newTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
