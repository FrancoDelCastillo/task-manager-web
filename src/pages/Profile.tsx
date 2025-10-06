import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useUserStore } from "@/store/userStore";

import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { uploadAvatar } from "../services/uploadApi";
import { getProfile, updateProfile } from "../services/profileApi";

export default function ProfilePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // 🔹 Global user data (desde Zustand)
  const userId = useUserStore((state) => state.id);
  const userProfile = useUserStore((state) => state.profile);
  const setUser = useUserStore((state) => state.setUser);

  // 🔹 Local form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // ======================================================
  // Cargar perfil (desde Supabase y guardar en el store)
  // ======================================================
  const loadProfile = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) return;

      const data = await getProfile(user.id);
      if (!data) return;

      // Guardar en el store global
      setUser(
        user.id,
        user.email ?? null,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          avatar_url: data.avatar_url,
          created_at: data.created_at,
          updated_at: data.updated_at,
        },
        data.role
      );

      setLoading(false);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setLoading(false);
    }
  };

  // ======================================================
  // Guardar cambios (updateProfile + reload)
  // ======================================================
  const handleSave = async () => {
    try {
      let currentAvatarUrl = userProfile?.avatar_url ?? "";

      if (avatarFile) {
        currentAvatarUrl = await uploadAvatar(userId, avatarFile);
      }

      await updateProfile(userId, firstName, lastName, currentAvatarUrl);
      await loadProfile();
      setOpenDialog(false);

      toast.success("Perfil actualizado 🎉", {
        description: "Tus cambios se han guardado correctamente.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar perfil ❌", {
        description: "Inténtalo nuevamente.",
      });
    }
  };

  // ======================================================
  // Efectos
  // ======================================================
  useEffect(() => {
    loadProfile();
  }, [id]);

  useEffect(() => {
    if (id && userId) {
      setIsOwner(id === userId);
    } else if (userProfile) {
      setIsOwner(true); // cuando es tu propio perfil
    }
  }, [id, userId, userProfile]);

  // ======================================================
  // Render
  // ======================================================
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        extraActions={
          <Button variant="link" asChild>
            <Link to="/dashboard">Volver al Dashboard</Link>
          </Button>
        }
      />

      {loading ? (
        <p className="text-center mt-10">Cargando...</p>
      ) : (
        <Card className="mx-auto p-14 mt-4">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Avatar className="w-40 h-40">
              <AvatarImage
                src={`${userProfile?.avatar_url ?? ""}?u=${new Date(
                  userProfile?.updated_at ?? ""
                ).getTime()}`}
              />
              <AvatarFallback>
                {userProfile?.first_name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-xl font-semibold">
              {userProfile?.first_name} {userProfile?.last_name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Miembro desde:{" "}
              {userProfile?.created_at
                ? new Date(userProfile.created_at).toLocaleDateString("es-PE")
                : "—"}
            </p>

            {/* 🔹 Dialog de edición */}
            {isOwner && (
              <Dialog
                open={openDialog}
                onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (open && userProfile) {
                    setFirstName(userProfile.first_name ?? "");
                    setLastName(userProfile.last_name ?? "");
                    setAvatarFile(null);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="default" className="mt-4">
                    Editar perfil
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar perfil</DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-4 mt-4">
                    <div>
                      <Label htmlFor="first_name">Nombre</Label>
                      <Input
                        id="first_name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="last_name">Apellido</Label>
                      <Input
                        id="last_name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="avatar">Avatar</Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setAvatarFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>

                    <Button onClick={handleSave}>Guardar cambios</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
