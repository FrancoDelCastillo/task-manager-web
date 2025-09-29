import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Dashboard(): React.JSX.Element {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string| null>(null)

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error.message);
          return;
        }
        
        setUserEmail(data.user?.email ?? null);

        if(data.user){
          setUserId(data.user.id)
        }
        
      } catch (err) {
        console.error("Unexpected error getting user:", err);
      }
    };
    
    getUser();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error.message);
        return;
      }
      
      // Clear any stored tokens
      localStorage.removeItem("token");
      
      // Redirect to login page
      window.location.href = "/login";
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-4">
          {userEmail && <span className="text-sm text-gray-600">{userEmail}</span>}

          <Button 
            variant="link" 
          >
            <Link to={`/profile/${userId}`}>
            Ver mi perfil
            </Link>
          </Button>

          <Button 
            variant="destructive" 
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tus Boards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Aquí verás los tableros que has creado.</p>
            <Button 
              variant="outline" 
              className="mt-4 w-full"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                // TODO: Implement board creation logic
                console.log("Create new board clicked");
              }}
            >
              Crear nuevo Board
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Resumen de tus tareas y progreso.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Opciones de usuario y preferencias.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
