import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description?: string;
  };
  onClick: () => void;
  onEdit: () => void;
  onDelete: (boardId: string, taskId: string) => Promise<void>;
};

export function TaskCard({ task, onClick, onEdit, onDelete }: TaskCardProps) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const boardId = useBoardStore((state) => state.currentBoardId);
  const currentUserRole = useUserStore((state) => state.boardRole);

  const handleDelete = async () => {
    if (!boardId) return;
    await onDelete(boardId, task.id);
    setOpenConfirmDialog(false);
  };

  return (
    <>
      {/* Card principal */}
      <Card className="mb-3 cursor-pointer" onClick={onClick}>
        <CardContent className="p-3 flex justify-between items-center">
          <div>
            <p className="font-medium">{task.title}</p>
            {task.description && (
              <p className="text-sm text-gray-500 truncate w-40">
                {task.description}
              </p>
            )}
          </div>

          <div>
          {/* Botón editar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>

          {/* Botón eliminar visible solo si es admin */}
          {currentUserRole === "admin" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                setOpenConfirmDialog(true);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmación */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar tarea?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará la tarea{" "}
              <span className="font-semibold">{task.title}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
