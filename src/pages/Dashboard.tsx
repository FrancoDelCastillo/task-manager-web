import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

import Header from "../components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CreateBoardDialog } from "../components/board/CreateBoardDialog";
import { BoardList } from "../components/board/BoardList";

export default function Dashboard(): React.JSX.Element {
  const [userId, setUserId] = useState<string | null>(null);
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user:", error.message);
          return;
        }

        if (data.user) {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error("Unexpected error getting user:", err);
      }
    };

    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header
        extraActions={
          <Button variant="link">
            <Link to={`/profile/${userId}`}>Ver mi perfil</Link>
          </Button>
        }
      />

      {/* Main Content */}
      <main className="flex-1 p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex-1 col-span-1 flex-col p-6">
          <CardHeader>
            <CardTitle>Tus Boards</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600">
              Aquí verás los tableros que has creado.
            </p>
            <CreateBoardDialog onBoardCreated={() => setReload(!reload)} />
          </CardContent>

          <CardContent className="flex-1 overflow-y-auto">
            <BoardList reload={reload} />
          </CardContent>
        </Card>

        <Card className="flex-1 col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Resumen de tus tareas y progreso.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
