// src/store/boardStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Board = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

interface BoardStore {
  boards: Board[];
  currentBoardId: string | null;              
  setBoards: (boards: Board[]) => void;
  setCurrentBoardId: (id: string | null) => void; 
  getBoardById: (id: string) => Board | undefined;
  currentUserRole?: "admin" | "member";
  // setCurrentUserRole?: (role: "admin" | "member") => void;
}

export const useBoardStore = create(
  persist<BoardStore>(
    (set, get) => ({
      boards: [],
      currentBoardId: null,
      setBoards: (boards) => set({ boards }),
      setCurrentBoardId: (id) => set({ currentBoardId: id }),
      getBoardById: (id) => get().boards.find((b) => b.id === id),
    }),
    { name: "boards-storage" }
  )
);
