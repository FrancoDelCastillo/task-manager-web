import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import { Link } from "react-router-dom";

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
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/dashboard", { replace: true });
      }
      setCheckingSession(false);
    });
  }, [navigate]);


  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoadingLogin(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Verifica tu correo y contraseña. Si ya tienes cuenta, asegúrate de haber confirmado tu email.");
        return;
      }

      const token = data.session?.access_token;
      if (token) {
        localStorage.setItem("token", token);
        alert("Login exitoso ✅");
        navigate("/dashboard");
      }
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Error inesperado");
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
          <CardTitle className="text-2xl font-bold" >Task Manager</CardTitle>
          <CardDescription>
            Ingresa tu email para acceder a tu cuenta
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link to="/sign-up">
                Crear cuenta
              </Link>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
              </div>

              {error && <p className="text-red-500 text-sm">{error }</p>}

              <Button type="submit" className="w-full" disabled={loadingLogin}>
                {loadingLogin ? "Cargando..." : "Iniciar sesión"}
              </Button>

              <Button variant="outline" className="w-full">
                Iniciar sesión con Google
              </Button>
        
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}