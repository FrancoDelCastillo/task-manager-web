import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

// TypeScript interfaces for better type safety
interface AuthError {
  message: string;
}

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoadingLogin(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
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

  const handleRegister = async (): Promise<void> => {
    setLoadingRegister(true);
    setError("");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:5173/dashboard",
        },
      });

      if (error) {
        setError(error.message);
      } else {
        alert("Registro exitoso ✅, revisa tu correo 📩");
      }
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Error inesperado");
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Task Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}


            <Button variant="secondary" type="submit" className="w-full" disabled={loadingLogin}>
              {loadingLogin ? "Cargando..." : "Iniciar sesión"}
            </Button>
          </form>

          <Button
            className="w-full mt-4"
            onClick={handleRegister}
            disabled={loadingRegister}
          >
            {loadingRegister ? "Cargando..." : "Crear cuenta"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}