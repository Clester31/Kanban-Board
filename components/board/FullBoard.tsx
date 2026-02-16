"use client";

import { useAppContext } from "@/lib/context/AppContext";
import { ColumnType } from "@/lib/types/types";
import BoardColumn from "./BoardColumn";
import { createNewColumn, getColumns } from "@/lib/actions/actions";
import { selectRandomTagColor } from "@/lib/utils";
import { useEffect } from "react";

export default function FullBoard() {
  const { columns, currentBoard, setColumns, tasks, setTasks } =
    useAppContext();

  useEffect(() => {
    if (currentBoard?.id) {
      getColumns(currentBoard.id).then((data) =>
        setColumns(Array.isArray(data) ? data : [data]),
      );
    }
  }, [currentBoard?.id, setColumns]);

  if (!currentBoard) return <div>Loading...</div>;

  const handleNewColumn = async () => {
    const newColumn = await createNewColumn(
      `New Column ${(columns?.length ?? 0) + 1}`,
      selectRandomTagColor(),
      currentBoard.id,
    );
    setColumns([...(columns ?? []), newColumn]);
  };

  return (
    <div className="board-main">
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
          <div className="column-header h-12"></div>
          <div
            className="new-column bg-charade-800 border-2 border-charade-700 w-96 h-[calc(100vh-12rem)] rounded-xl p-2 flex justify-center items-center hover:bg-charade-700 transition 150 ease-in-out cursor-pointer"
            onClick={() => handleNewColumn()}
          >
            <h1 className="text-2xl text-charade-300">+ New Column</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
