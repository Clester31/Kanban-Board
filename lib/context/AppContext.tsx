"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { BoardType, ColumnType, TaskType } from "../types/types";

export interface ContextType {
  // boards
  boards: BoardType[] | null;
  setBoards: (boards: BoardType[] | null) => void;
  currentBoard: BoardType | null;
  setCurrentBoard: (currentBoard: BoardType | null) => void;
  // columns
  columns: ColumnType[] | null;
  setColumns: (columns: ColumnType[] | null) => void;
  // tasks
  tasks: Map<string, TaskType[]> | null;
  setTasks: (tasks: Map<string, TaskType[]> | null) => void;
}

const AppContext = createContext<ContextType | undefined>(undefined);

export interface ContextProps {
  children: ReactNode;
}

export const ContextProvider = ({ children }: ContextProps) => {
  // boards
  const [boards, setBoards] = useState<BoardType[] | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardType | null>(null);
  // columns
  const [columns, setColumns] = useState<ColumnType[] | null>(null);
  // tasks
  const [tasks, setTasks] = useState<Map<string, TaskType[]> | null>(null);

  const contextValue: ContextType = {
    boards,
    setBoards,
    currentBoard,
    setCurrentBoard,
    columns, 
    setColumns,
    tasks,
    setTasks
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
