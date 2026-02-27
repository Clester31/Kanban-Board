"use client";

import { useAppContext } from "@/lib/context/AppContext";
import { ColumnType } from "@/lib/types/types";
import BoardColumn from "./BoardColumn";
import {
  createNewColumn,
  getAllTasks,
  getColumns,
} from "@/lib/actions/actions";
import { selectRandomTagColor } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function FullBoard() {
  const { columns, currentBoard, setColumns, setPopup, closePopup, setTasks } =
    useAppContext();

  useEffect(() => {
    if (currentBoard?.id) {
      getColumns(currentBoard.id).then((data) =>
        setColumns(Array.isArray(data) ? data : [data]),
      );
    }
  }, [currentBoard?.id, setColumns]);

  useEffect(() => {
    const loadTasks = async () => {
      if(currentBoard) {
        const tasksMap = await getAllTasks(currentBoard.id);
        console.log(tasksMap)
        setTasks(tasksMap);
      }
    };
    loadTasks();
  }, [setTasks, currentBoard]);

  if (!currentBoard) return <div>Loading...</div>;

  const handleNewColumn = async (name: string) => {
    const newColumn = await createNewColumn(
      name,
      selectRandomTagColor(),
      currentBoard.id,
    );
    setColumns([...(columns ?? []), newColumn]);
  };

  return (
    <div className="board-main overflow-x-auto">
      <div className="board-cols flex flex-row gap-4">
        {columns &&
          columns.map((c: ColumnType, i: number) => {
            return (
              <div key={i} className="flex flex-row gap-4">
                <BoardColumn column={c} />
              </div>
            );
          })}
        <div>
          <div className="column-header h-14"></div>
          <div
            className="new-column bg-charade-800 border-2 border-charade-800 w-96 h-[calc(100vh-12rem)] rounded p-2 flex justify-center items-center hover:bg-charade-700 transition 150 ease-in-out cursor-pointer"
            onClick={() =>
              setPopup(
                <NewColumnPopup
                  onSubmit={handleNewColumn}
                  onClose={closePopup}
                />,
              )
            }
          >
            <h1 className="text-2xl text-charade-300">+ New Column</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewColumnPopup({
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
        placeholder="Enter Column Name"
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
          disabled={!name.trim() || loading}
          className="bg-charade-600 px-2 py-1 rounded w-16 h-8 hover:bg-charade-700 transition 100 ease-in-out cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
