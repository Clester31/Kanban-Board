"use client";

import { createNewTask, updateColumnInfo } from "@/lib/actions/actions";
import { useAppContext } from "@/lib/context/AppContext";
import { ColumnType, TaskType } from "@/lib/types/types";
import Task from "../tasks/Task";
import { useState } from "react";
import { tagColors } from "@/lib/utils";

export default function BoardColumn({ column }: { column: ColumnType }) {
  const { tasks, setTasks, setPopup, closePopup } = useAppContext();

  const [color, setColor] = useState<string | undefined>(column.color)
  const [name, setName] = useState<string | undefined>(column.name)

  const handleNewTask = async (name: string) => {
    const newTask = await createNewTask(name, column.id);
    const updatedTasks = new Map(tasks ?? new Map());
    const columnTasks = updatedTasks.get(column.id) || [];
    updatedTasks.set(column.id, [...columnTasks, newTask]);
    setTasks(updatedTasks);
  };

  const handleChangeColor = async (color: string) => {
    const updatedColumn = await updateColumnInfo(column.id, "color", color);
    setColor(updatedColumn.color);
  };

  const handleNameChange = async (name: string) => {
    const updatedColumn = await updateColumnInfo(column.id, "name", name);
    setName(updatedColumn.name)
  }

  const columnTasks = tasks?.get(column.id) || [];

  return (
    <div>
      <div className="column-header h-12 flex flex-row gap-2 items-center">
        <div
          className="w-5 h-5 rounded-full hover:border hover:border-charade-200 transition-colors 150 ease-in-out cursor-pointer"
          style={{ background: color }}
          onClick={() =>
            setPopup(
              <ChangeColorPopup
                onSubmit={handleChangeColor}
                onClose={closePopup}
              />,
            )
          }
        />
        <h1 className="text-xl hover:text-charade-300 transition 100 ease-in-out cursor-pointer" onClick={() => setPopup(
          <ChangeNamePopup 
            onSubmit={handleNameChange}
            onClose={closePopup}
          />
        )}>{name}</h1>
      </div>
      <div className="column w-96 h-[calc(100vh-12rem)] rounded-xl flex flex-col">
        <div className="column-content flex flex-col py-2 gap-4">
          {columnTasks &&
            columnTasks.map((t: TaskType, i: number) => {
              return <Task task={t} key={i} />;
            })}
          <button
            className="bg-charade-800 w-full p-4 rounded hover:bg-charade-700 transition 150 ease-in-out cursor-pointer"
            onClick={() =>
              setPopup(
                <NewTaskPopup onSubmit={handleNewTask} onClose={closePopup} />,
              )
            }
          >
            <h1 className="text-lg">+ New Task</h1>
          </button>
        </div>
      </div>
    </div>
  );
}

function NewTaskPopup({
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
        placeholder="Enter Task Name"
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
          onClick={handleSubmit}
          disabled={!name.trim() || loading}
          className="bg-charade-600 px-2 py-1 rounded w-16 h-8 hover:bg-charade-700 transition 100 ease-in-out cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ChangeColorPopup({
  onSubmit,
  onClose,
}: {
  onSubmit: (color: string) => Promise<void>;
  onClose: () => void;
}) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!selectedColor.trim()) return;
    setLoading(true)
    await onSubmit(selectedColor)
    setLoading(false);
    onClose();
  }

  return (
    <div className="justify-center px-4 py-2 bg-charade-800 w-full flex flex-col gap-8">
      <div className="grid grid-cols-5 gap-8">
        {tagColors.map((color: string, i: number) => {
          return (
            <div
              key={i}
              className={`w-8 h-8 rounded-full border-2 transition 150 ease-in-out cursor-pointer ${
                selectedColor === color
                  ? "border-white"
                  : "border-transparent hover:border-charade-50"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          );
        })}
      </div>
      <div className="flex flex-row space-x-2 items-center w-full justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedColor.trim() || loading}
          className="bg-caribbean-green-600 px-2 py-1 rounded w-16 h-8 hover:bg-caribbean-green-700 transition 100 ease-in-out cursor-pointer"
        >
          Update
        </button>
        <button
          onClick={onClose}
          disabled={!selectedColor.trim() || loading}
          className="bg-charade-600 px-2 py-1 rounded w-16 h-8 hover:bg-charade-700 transition 100 ease-in-out cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ChangeNamePopup({
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
        placeholder="New Column Name"
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
          Update
        </button>
        <button
          onClick={onClose}
          disabled={!name.trim() || loading}
          className="bg-charade-600 px-2 py-1 rounded w-16 h-8 hover:bg-charade-700 transition 100 ease-in-out cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}