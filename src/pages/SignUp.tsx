import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

import { useNavigate, Link } from "react-router-dom";

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
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
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
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/welcome`,
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

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

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
                  disabled={success}
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
                  disabled={success}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full mt-4" disabled={success}>
                {loadingRegister ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="flex mt-4 items-center justify-center text-sm">
              <span>¿Ya eres usuario?</span>
              <Button variant="link" className="px-2">
                <Link to="/login">Inicia sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
