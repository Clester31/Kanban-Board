"use client";

import { createNewTask } from "@/lib/actions/actions";
import { useAppContext } from "@/lib/context/AppContext";
import { ColumnType, TaskType } from "@/lib/types/types";
import Task from "../tasks/Task";

export default function BoardColumn({ column }: { column: ColumnType }) {
  const { tasks, setTasks } = useAppContext();

  const handleNewTask = async () => {
    const newTask = await createNewTask(
      `New Task ${(tasks?.get(column.id)?.length ?? 0) + 1}`,
      column.id,
    );
    const updatedTasks = new Map(tasks ?? new Map());
    const columnTasks = updatedTasks.get(column.id) || [];
    updatedTasks.set(column.id, [...columnTasks, newTask]);
    setTasks(updatedTasks);
  };

  const columnTasks = tasks?.get(column.id) || [];

  return (
    <div>
      <div className="column-header h-12 flex flex-row gap-2 items-center">
        <div
          className="w-5 h-5 rounded-full hover:border hover:border-charade-200 transition-colors 150 ease-in-out cursor-pointer"
          style={{ background: column.color }}
        />
        <h1 className="text-xl">{column.name}</h1>
        <i className="fa-solid fa-pencil text-sm hover:text-caribbean-green-300 transition 150 ease-in-out cursor-pointer"></i>
      </div>
      <div className="column bg-charade-800 border-2 border-charade-700 w-96 h-[calc(100vh-12rem)] rounded-xl p-2 flex flex-col text-center">
        <div className="column-content p-2">
          {columnTasks &&
            columnTasks.map((t: TaskType, i: number) => {
              return (
                <Task task={t} key={i} />
              )
            })}
          <button className="bg-charade-700 w-full p-4 rounded-lg border-2 border-charade-600 hover:bg-charade-600 transition 150 ease-in-out cursor-pointer">
            <h1 className="text-lg" onClick={() => handleNewTask()}>+ New Task</h1>
          </button>
        </div>
      </div>
    </div>
  );
}
