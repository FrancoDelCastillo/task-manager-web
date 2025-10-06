import { supabase } from "@/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

export type BoardMember = {
  id: string;
  role: "admin" | "member" | "viewer";
  board_id: string;
  profile: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url?: string | null; // opcional si quieres mostrar el avatar
  };
};

export async function getBoardMembers(boardId: string): Promise<BoardMember[]> {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("No se pudo obtener la sesión");

  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_URL}/boards/${boardId}/members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const members: BoardMember[] = await response.json();

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return members;
}

export const getUserRoleInBoard = async (boardId: string) => {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("No se pudo obtener la sesión");

  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_URL}/boards/${boardId}/members/role`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const role = await response.json();

  console.log("getUserRoleInBoard: ", role)

  return role;
};
