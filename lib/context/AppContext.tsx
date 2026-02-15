"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { BoardType } from "../types/types";

export interface ContextType {
  boards: BoardType[] | null;
  setBoards: (boards: BoardType[] | null) => void;
  currentBoard: BoardType | null;
  setCurrentBoard: (currentBoard: BoardType | null) => void;
}

const AppContext = createContext<ContextType | undefined>(undefined);

export interface ContextProps {
  children: ReactNode;
}

export const ContextProvider = ({ children }: ContextProps) => {
  const [boards, setBoards] = useState<BoardType[] | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardType | null>(null);

  const contextValue: ContextType = {
    boards,
    setBoards,
    currentBoard,
    setCurrentBoard,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useContext must be used within a provider");
  }
  return context;
};
