import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
};

interface UserStore {
  id: string;
  email: string | null;
  profile: UserProfile | null;
  boardRole: "admin" | "member" | "viewer" | null;

  setUser: (
    id: string,
    email: string | null,
    profile: UserProfile | null,
    boardRole: "admin" | "member" | "viewer" | null
  ) => void;
  setBoardRole: (role: "admin" | "member" | "viewer") => void;
  clear: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      id: '',
      email: null,
      profile: null,
      boardRole: null,

      setUser: (id, email, profile, boardRole) =>
        set({ id, email, profile, boardRole }),

      setBoardRole: (boardRole) => set({ boardRole }),
      clear: () => set({ id: '', email: null, profile: null, boardRole: null }),
    }),
    { name: "user-storage" }
  )
);
