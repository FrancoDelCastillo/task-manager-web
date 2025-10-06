import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useUserStore } from "@/store/userStore";
import { getProfile } from "@/services/profileApi";

interface AuthError {
  message: string;
}

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [checkingSession, setCheckingSession] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const user = data.session.user;

        // ⚡ Traer perfil desde tu API
        const rawProfile = await getProfile(user.id);

        console.info("Profile obtenido (sesión previa):", rawProfile);

        // Guardar en el store
        useUserStore.getState().setUser(
          user.id,
          user.email ?? null,
          {
            first_name: rawProfile.first_name,
            last_name: rawProfile.last_name,
            avatar_url: rawProfile.avatar_url,
            created_at: rawProfile.created_at,
            updated_at: rawProfile.updated_at,
          },
          rawProfile.role
        );

        navigate("/dashboard", { replace: true });
      }
      setCheckingSession(false);
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingLogin(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(
          "Verifica tu correo y contraseña. Si ya tienes cuenta, asegúrate de haber confirmado tu email."
        );
        toast.error("Error al iniciar sesión ❌");
        return;
      }

      const session = data.session;
      if (session) {
        const user = session.user;

        // ⚡ Traer perfil desde tu API
        const rawProfile = await getProfile(user.id);

        // Guardar en el store
        useUserStore.getState().setUser(
          user.id,
          user.email ?? null,
          {
            first_name: rawProfile.first_name,
            last_name: rawProfile.last_name,
            avatar_url: rawProfile.avatar_url,
            created_at: rawProfile.created_at,
            updated_at: rawProfile.updated_at,
          },
          rawProfile.role ?? "member" // ⚡ asigna role, default "member"
        );

        // Guardar token opcionalmente
        localStorage.setItem("token", session.access_token);

        toast.success("Bienvenido 👋", {
          description: "Has iniciado sesión correctamente.",
        });

        navigate("/dashboard");
      }
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Error inesperado");
      toast.error("Error inesperado ❌", {
        description: authError.message || "Inténtalo nuevamente.",
      });
    } finally {
      setLoadingLogin(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Task Manager</CardTitle>
          <CardDescription>
            Ingresa tu email para acceder a tu cuenta
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link to="/sign-up">Crear cuenta</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  required
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={loadingLogin}>
                {loadingLogin ? "Cargando..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
