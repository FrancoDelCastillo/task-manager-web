import { supabase } from "@/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

export async function createBoard(
  name: string,
  description: string
) {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("No se pudo obtener la sesión");
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_URL}/boards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

export async function deleteBoard(
  boardId: string
) {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("No se pudo obtener la sesión");
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return true;
}

export async function getBoards() {
    const { data, error } = await supabase.auth.getSession();
  
    if (error) throw new Error("No se pudo obtener la sesión");
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("Usuario no autenticado");
  
    const response = await fetch(`${API_URL}/boards`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  
    return await response.json();
  }