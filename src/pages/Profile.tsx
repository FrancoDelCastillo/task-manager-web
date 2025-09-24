import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignUpError {
  message: string;
}

export default function Profile(): React.JSX.Element {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoadingRegister(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:5173/dashboard",
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      }

      const user = data.user;

      const {error: profileError} = await supabase.from("profiles").update({
        id: user?.id,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarImage
      })

      if(profileError){
        setError(profileError.message)
        setLoadingRegister(false)
        return
      }

      setLoadingRegister(false)
      alert("Registro exitoso ✅, revisa el correo de confirmación");

    } catch (err) {
      const signUpError = err as SignUpError;
      setError(signUpError.message || "Error inesperado");
    } finally {
      setLoadingRegister(false);
    }




  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Mi perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                type="text"
                placeholder=""
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFirstName(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                type="text"
                placeholder=""
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarImage">Foto de perfil</Label>
              <Input
                id="avatarImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setAvatarImage(file);
                }}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loadingRegister}
              >
                {loadingRegister ? "Actualizando..." : "Editar perfil"}
              </Button>
          </form>

              <Button variant="outline" className="w-full mt-4">
                <Link to="/dashboard">Volver</Link>
              </Button>
        </CardContent>
      </Card>
    </div>
  );
}