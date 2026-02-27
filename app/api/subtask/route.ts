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
    const { subtaskName, taskId } = body;

    if (!subtaskName || !taskId) {
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

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const maxPosition = await prisma.subtask.findFirst({
      where: { taskId: taskId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newSubtask = await prisma.subtask.create({
      data: {
        title: subtaskName,
        completed: false,
        position: (maxPosition?.position ?? -1) + 1,
        taskId: taskId,
      },
    });

    return NextResponse.json(newSubtask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}