"use client";

import { updateSubtaskCompletion } from "@/lib/actions/actions";
import { subTaskType } from "@/lib/types/types";
import { useState } from "react";

export default function Subtask({
  subtask,
  onToggle,
}: {
  subtask: subTaskType;
  onToggle: (subtaskId: string, completed: boolean) => void;
}) {
  const [complete, setComplete] = useState<boolean>(subtask.completed);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleCompletion = async () => {
    const newStatus = !complete;

    // Optimistic update
    setComplete(newStatus);
    onToggle(subtask.id, newStatus);

    setIsUpdating(true);
    try {
      await updateSubtaskCompletion(subtask.id, newStatus);
    } catch (error) {
      // Revert on error
      setComplete(!newStatus);
      onToggle(subtask.id, !newStatus);
      console.error("Failed to update subtask:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <h1
        className={`text-lg transition ${complete ? "text-charade-400 line-through" : "text-charade-300"} w-5/6`}
      >
        {subtask.title}
      </h1>
      <button
        className={`border-2 border-charade-500 w-8 h-8 rounded cursor-pointer hover:border-charade-400 transition 150 ease-in-out ${isUpdating ? "opacity-50" : ""}`}
        onClick={handleCompletion}
        disabled={isUpdating}
      >
        {complete && <i className="fa-solid fa-check" />}
      </button>
    </div>
  );
}
