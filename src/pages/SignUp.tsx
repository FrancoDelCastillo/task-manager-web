import { useState } from "react";
import { supabase } from "../supabaseClient";

import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SignUpError {
  message: string;
}

export default function SignUp(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoadingRegister(true);
    setError("");

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:5173/dashboard",
        },
      });

      if (signUpError) {
        console.error("Error al registrar:", signUpError);
        setError("Hubo un problema al registrar el usuario");
        return;
      }
      setSuccess(true);
      
    } catch (err) {
      const signUpError = err as SignUpError;
      console.error("Error inesperado: ", signUpError);
      setError(signUpError.message || "Error inesperado");
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4">
      {success && (
        <div className="absolute mt-4">
          <Alert>
            <CheckCircle2Icon fill="green" color="white" />
            <AlertTitle>Satisfactorio!</AlertTitle>
            <AlertDescription>
              Si este correo está registrado, recibirás un email de
              confirmación.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Crea tu cuenta en Task Manager
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
                  disabled={success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  disabled={success}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={success}
              >
                {loadingRegister ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <Button variant="outline" className="w-full mt-4">
              <Link to="/login">Regresar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}