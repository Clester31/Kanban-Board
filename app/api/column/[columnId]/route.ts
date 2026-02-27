import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { columnId: string } },
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { infoType, value } = body;
    const { columnId } = await params;

    if (!infoType || !value) {
      return NextResponse.json(
        { error: "Missing infoType or value" },
        { status: 400 },
      );
    }

    if (infoType !== "name" && infoType !== "color") {
      return NextResponse.json(
        { error: "infoType must be 'name' or 'color'" },
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
      include: {
        board: true,
      },
    });

    if (!column) {
      return NextResponse.json(
        { error: "Column not found" },
        { status: 404 },
      );
    }

    if (column.board.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this column" },
        { status: 403 },
      );
    }

    const updateData: { name?: string; color?: string } = {};
    
    if (infoType === "name") {
      updateData.name = value;
    } else if (infoType === "color") {
      updateData.color = value;
    }

    const updatedColumn = await prisma.column.update({
      where: {
        id: columnId,
      },
      data: updateData,
    });

    return NextResponse.json(updatedColumn, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update column" },
      { status: 500 },
    );
  }
}