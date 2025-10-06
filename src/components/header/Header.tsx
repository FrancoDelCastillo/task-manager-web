import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface HeaderProps {
  extraActions?: React.ReactNode; // para añadir botones extra en BoardPage
}

export function Header({ extraActions }: HeaderProps) {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error al obtener usuario:", error.message);
        return;
      }
      setUserEmail(data.user?.email ?? null);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Task Manager</h1>

      <div className="flex items-center gap-4">
        {userEmail && <span className="text-sm px-4 text-gray-600">{userEmail}</span>}

        {/* Extra buttons */}
        {extraActions}

        <Button
          variant="destructive"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}