import { supabase } from "@/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

export async function updateProfile(
  profileId: string,
  firstName: string,
  lastName: string,
  avatarUrl: string
) {

  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("No se pudo obtener la sesión");
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_URL}/profiles/${profileId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      avatar_url: avatarUrl,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

export async function getProfile(profileId: string) {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw new Error("No se pudo obtener la sesión");
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("Usuario no autenticado");

    const response = await fetch(`${API_URL}/profiles/${profileId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    });
  
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  
    let resJson = await response.json() 
    console.log("response: ",resJson)
    return resJson;
  }