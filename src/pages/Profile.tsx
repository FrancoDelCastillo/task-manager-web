import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
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
import { Link } from "react-router-dom";

import { uploadAvatar } from "../services/uploadApi";
import { getProfile, updateProfile } from "../services/profileApi";

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [openDialog, setOpenDialog] = useState(false);

  const handleSave = async () => {
    try {
      let avatarUrl = profile.avatar_url;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(profile.id, avatarFile);
      }

      await updateProfile(profile.id, firstName, lastName, avatarUrl);
      alert("Perfil actualizado correctamente ✅");
    } catch (err) {
      alert("Error al actualizar perfil ❌");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
    
        const data = await getProfile(user.id);

        if (data) {
          setProfile(data);
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setAvatarFile(data.avatar_url || "");
        }

        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!profile)
    return <p className="text-center mt-10">Perfil no encontrado</p>;

  const isOwner = profile.id === userId;

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <Avatar className="w-40 h-40">
            <AvatarImage
              src={`${profile.avatar_url}?u=${new Date(
                profile.updated_at
              ).getTime()}`}
            />
            <AvatarFallback>
              {profile.first_name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-xl font-semibold">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Miembro desde:{" "}
            {new Date(profile.created_at).toLocaleDateString("es-PE")}
          </p>

          {isOwner && (
            <Dialog
              open={openDialog}
              onOpenChange={(open) => {
                setOpenDialog(open);
                if (open && profile) {
                  setFirstName(profile.first_name || "");
                  setLastName(profile.last_name || "");
                  setAvatarFile(profile.avatar_url || null);
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
          <Button variant="link" className="mt-4">
            <Link to="/dashboard">Volver</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
