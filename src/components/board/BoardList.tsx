import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBoardStore } from "../../store/boardStore";
import { getBoards, deleteBoard } from "../../services/boardApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface Board {
  id: string;
  name: string;
  description: string;
}

interface BoardListProps {
  reload: boolean;
}

export function BoardList({ reload }: BoardListProps) {
  const { boards, setBoards } = useBoardStore();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Cargar boards
  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data = await getBoards();
      setBoards(data);
    } catch (err) {
      console.error("Error cargando boards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [reload]);

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedBoard) return;
    try {
      await deleteBoard(selectedBoard.id);
      toast.success(`Board "${selectedBoard.name}" eliminado`);
      setOpenDialog(false);
      fetchBoards();
    } catch (err) {
      console.error("Error eliminando board:", err);
      toast.error("No se pudo eliminar el board");
    }
  };

  if (loading) return <p>Cargando boards...</p>;
  if (boards.length === 0)
    return <p className="text-gray-600">No tienes boards aún.</p>;

  return (
    <>
      <div className="h-100 space-y-3">
        {boards.map((board) => (
          <Card key={board.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{board.name}</p>
                <p className="text-sm text-gray-500">{board.description}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/board/${board.id}`}>
                  <Button variant="outline">Abrir</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    setSelectedBoard(board);
                    setOpenDialog(true);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔹 Dialog de confirmación fuera del map */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar board?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará el board{" "}
              <span className="font-semibold">{selectedBoard?.name}</span> y todas
              sus tareas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

