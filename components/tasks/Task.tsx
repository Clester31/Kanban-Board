"use client";

import { subTaskType, TaskType } from "@/lib/types/types";
import { useEffect, useState } from "react";
import Subtask from "./Subtask";
import { createNewSubtask, getSubtasks } from "@/lib/actions/actions";
import { useAppContext } from "@/lib/context/AppContext";

export default function Task({ task }: { task: TaskType }) {
  const [viewSubtasks, setViewSubtasks] = useState<boolean>(true);
  const [subtasks, setSubtasks] = useState<subTaskType[] | null>([]);
  const { setPopup, closePopup } = useAppContext();

  const handleNewSubtask = async (name: string) => {
    const newSubtask = await createNewSubtask(name, task.id);
    setSubtasks((prev) => [...(prev || []), newSubtask]);
  };

  const handleSubtaskToggle = (subtaskId: string, completed: boolean) => {
    setSubtasks((prev) =>
      prev?.map((st) =>
        st.id === subtaskId ? { ...st, completed } : st
      ) || null
    );
  };

  useEffect(() => {
    if (task.id) {
      getSubtasks(task.id).then((data) => {
        setSubtasks(Array.isArray(data) ? data : [data]);
      });
    }
  }, [task.id]);

  const completedSubtasks = subtasks?.filter((st) => st.completed).length ?? 0;

  return (
    <div
      className={`task bg-charade-800 w-full p-4 flex flex-col rounded gap-2 ${completedSubtasks === subtasks?.length && subtasks?.length > 0 && `border border-caribbean-green-500`} ${subtasks?.length === 0 && `border border-amber-500`}`}
    >
      <div className="task-info flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <h1 className="text-xl font-semibold">{task.title}</h1>
          <button onClick={() => setViewSubtasks(!viewSubtasks)}>
            <i className={`fa-solid fa-caret-down text-xl hover:text-charade-400 transition 150 ease-in-out cursor-pointer ${viewSubtasks && 'text-charade-400'}`} />
          </button>
        </div>
        <p className="text-charade-300">
          {completedSubtasks} of {subtasks?.length} subtasks completed
        </p>
      </div>
      {viewSubtasks && (
        <div className="task-subtasks px-2 flex flex-col gap-2">
          {subtasks &&
            subtasks.map((st: subTaskType) => {
              return (
                <Subtask 
                  key={st.id} 
                  subtask={st} 
                  onToggle={handleSubtaskToggle}
                />
              );
            })}
          <button
            className="bg-charade-700 px-4 py-1 rounded-xl w-full hover:bg-charade-600 transition 150 ease-in-out cursor-pointer"
            onClick={() =>
              setPopup(
                <NewSubtaskPopup
                  onSubmit={handleNewSubtask}
                  onClose={closePopup}
                />,
              )
            }
          >
            + New Subtask
          </button>
        </div>
      )}
    </div>
  );
}

function NewSubtaskPopup({
  onSubmit,
  onClose,
}: {
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onSubmit(name.trim());
    setLoading(false);
    onClose();
  };

  return (
    <div className="flex flex-row space-x-8 items-center">
      <input
        autoFocus
        type="text"
        placeholder="Enter Subtask Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="px-4 py-2 bg-charade-700 rounded"
      />
      <div className="flex flex-row space-x-2">
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || loading}
          className="bg-caribbean-green-600 px-2 py-1 rounded w-16 h-8 hover:bg-caribbean-green-700 transition 100 ease-in-out cursor-pointer"
        >
          Create
        </button>
        <button
          onClick={onClose}
          disabled={loading}
          className="bg-charade-600 px-2 py-1 rounded w-16 h-8 hover:bg-charade-700 transition 100 ease-in-out cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}