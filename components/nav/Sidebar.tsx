"use client";

import { createNewBoard, getBoards } from "@/lib/actions/actions";
import { useAppContext } from "@/lib/context/AppContext";
import { BoardType } from "@/lib/types/types";
import { useEffect } from "react";

export default function Sidebar() {
  const { boards, setBoards, setCurrentBoard } = useAppContext();

  useEffect(() => {
    getBoards().then((data) => setBoards(Array.isArray(data) ? data : [data]))
  }, [setBoards])

  const handleNewBoard = async () => {
    const newBoard = await createNewBoard(
      `New Board ${(boards?.length ?? 0) + 1}`,
    );
    setBoards([...(boards ?? []), newBoard]);
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-charade-800 border-r-2 border-r-charade-700">
      <div className="sidebar-header flex text-center p-4">
        <h1 className="font-bold text-caribbean-green-300 text-3xl">KanBan</h1>
      </div>
      <div className="sidebar-content flex flex-col justify-center p-4 gap-4">
        <p className="text-charade-400">All Boards</p>
        <div className="sidebar-content-boards flex flex-col gap-4">
          {boards &&
            boards.map((b: BoardType, i: number) => {
              return (
                <div key={i} className="sidebar-content-board item">
                  <button className="flex flex-row items-center gap-2 text-charade-300 cursor-pointer hover:text-charade-200 transition 150 ease-in-out text-lg" onClick={() => setCurrentBoard(b)}>
                    <i className="fa-regular fa-note-sticky" />
                    <h1>{b.name}</h1>
                  </button>
                </div>
              );
            })}
        </div>
        <div className="sidebar-content-new-board">
          <button className="flex flex-row items-center gap-2 text-caribbean-green-300 cursor-pointer hover:text-caribbean-green-200 transition 150 ease-in-out text-lg" onClick={() => handleNewBoard()}>
            <i className="fa-regular fa-note-sticky" />
            <h1>+ New Board</h1>
          </button>
        </div>
      </div>
    </div>
  );
}
