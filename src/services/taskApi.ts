import { supabase } from "@/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

export type TaskItem = {
    id: string;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "done";
    board_id: string;
    created_by: string;
    created_at: string;
    updated_at?: string;
};


// Obtener tasks de un board
export const fetchTasks = async (boardId: string): Promise<TaskItem[]> => {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw new Error("No se pudo obtener la sesión");
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("Usuario no autenticado");

    const res = await fetch(`${API_URL}/boards/${boardId}/tasks`, {
        credentials: "include",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) throw new Error("Error al obtener tareas");
    return res.json();
};

// Crear nueva task
export const createTask = async (
    boardId: string,
    payload: { title: string; description?: string; }
): Promise<TaskItem> => {

    const { data, error } = await supabase.auth.getSession();

    if (error) throw new Error("No se pudo obtener la sesión");
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("Usuario no autenticado");

    const res = await fetch(`${API_URL}/boards/${boardId}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    console.log("task creada!")
    
    if (!res.ok) throw new Error("Error al crear tarea");
    return res.json();
};

// Actualizar task
export const updateTask = async (
    boardId: string,
    taskId: string,
    payload: { title: string; description?: string }
): Promise<TaskItem> => {

    const { data, error } = await supabase.auth.getSession();

    if (error) throw new Error("No se pudo obtener la sesión");
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("Usuario no autenticado");

    const res = await fetch(`${API_URL}/boards/${boardId}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al actualizar tarea");
    return res.json();
};

// Eliminar task
export const deleteTask = async (boardId: string, taskId: string): Promise<void> => {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw new Error("No se pudo obtener la sesión");
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("Usuario no autenticado");

    const res = await fetch(`${API_URL}/boards/${boardId}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });
    if (!res.ok) throw new Error("Error al eliminar tarea");
};