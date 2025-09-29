import { supabase } from "@/supabaseClient";

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const filePath = `${userId}/avatar/avatar.png`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(`Error al subir avatar: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return data.publicUrl;
}