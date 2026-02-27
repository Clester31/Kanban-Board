"use client";

import { createNewBoard, getBoards } from "@/lib/actions/actions";
import { useAppContext } from "@/lib/context/AppContext";
import { BoardType } from "@/lib/types/types";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { boards, setBoards, setCurrentBoard, currentBoard, setPopup, closePopup } = useAppContext();

  useEffect(() => {
    getBoards().then((data) => setBoards(Array.isArray(data) ? data : [data]));
  }, [setBoards]);

  const handleNewBoard = async (name: string) => {
    const newBoard = await createNewBoard(name);
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
                  <button
                    className="flex flex-row items-center gap-2 text-charade-300 cursor-pointer hover:text-charade-200 transition 150 ease-in-out text-lg"
                    onClick={() => setCurrentBoard(b)}
                  >
                    {currentBoard?.id === b.id && (
                      <i className="fa-solid fa-chevron-right"></i>
                    )}
                    <i className="fa-regular fa-note-sticky" />
                    <h1>{b.name}</h1>
                  </button>
                </div>
              );
            })}
        </div>
        <div className="sidebar-content-new-board">
          <button
            className="flex flex-row items-center gap-2 text-caribbean-green-300 cursor-pointer hover:text-caribbean-green-200 transition 150 ease-in-out text-lg"
            onClick={() => setPopup(
              <NewBoardPopup onSubmit={handleNewBoard} onClose={closePopup} />
            )}
          >
            <i className="fa-regular fa-note-sticky" />
            <h1>+ New Board</h1>
          </button>
        </div>
      </div>
    </div>
  );
}

function NewBoardPopup({
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
        placeholder="Enter Board Name"
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
