// boards

import { BoardType, ColumnType, subTaskType, TaskType } from "../types/types";

export async function createNewBoard(name: string) {
  const response = await fetch("/api/board", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      boardName: name,
      boardDesc: "description",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add board");
  }

  const data = await response.json();
  return data as BoardType;
}

export async function getBoards() {
  const response = await fetch("/api/board", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch board");
  }

  const data = await response.json();
  return data as BoardType;
}

// columns

export async function createNewColumn(
  name: string,
  color: string,
  boardId: string,
) {
  console.log(name, color, boardId);
  const response = await fetch("/api/column", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      columnName: name,
      columnColor: color,
      boardId: boardId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add column");
  }

  const data = await response.json();
  return data as ColumnType;
}

export async function getColumns(boardId: string) {
  const response = await fetch(`/api/board/${boardId}/column`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch columns");
  }

  const data = await response.json();
  return data as ColumnType;
}

export async function updateColumnInfo(
  columnId: string,
  infoType: string,
  value: string,
) {
  const response = await fetch(`/api/column/${columnId}`, {
    method: "PATCH",
    body: JSON.stringify({
      infoType: infoType,
      value: value,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch columns");
  }

  const data = await response.json();
  return data as ColumnType;
}

// tasks

export async function createNewTask(name: string, columnId: string) {
  const response = await fetch("/api/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskName: name,
      columnId: columnId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const data = await response.json();
  return data as TaskType;
}

export async function getAllTasks(boardId: string) {
  const response = await fetch(`/api/board/${boardId}/task`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data = await response.json();
  return new Map<string, TaskType[]>(Object.entries(data));
}

// subtasks

export async function createNewSubtask(name: string, taskId: string) {
  const response = await fetch("/api/subtask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subtaskName: name,
      taskId: taskId,
    }),
  });

  const data = await response.json();
  return data as subTaskType;
}

export async function getSubtasks(taskId: string) {
  const response = await fetch(`/api/task/${taskId}/subtask`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data = await response.json();
  return data as subTaskType[];
}

export async function updateSubtaskCompletion(
  subtaskId: string,
  completed: boolean,
) {
  console.group(subtaskId, completed);
  const response = await fetch(`api/subtask/${subtaskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: completed,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update subtask");
  }

  const data = await response.json();
  return data as subTaskType;
}
