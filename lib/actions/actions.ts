// boards

import { BoardType } from "../types/types";

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
