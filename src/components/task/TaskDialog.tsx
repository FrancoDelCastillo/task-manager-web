import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TaskItem } from "@/services/taskApi";
import { getProfile } from "@/services/profileApi";

export type TaskDialogProps = {
  task?: TaskItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

export const TaskDialog = ({ task, open, onOpenChange }: TaskDialogProps) => {
  const [creator, setCreator] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!task?.created_by) return;

      try {
        const profile = await getProfile(task.created_by);
        console.log("get profile:", profile)
        setCreator(profile);
      } catch (err) {
        console.error("Error obteniendo perfil:", err);
        setCreator(null);
      }
    };

    fetchCreator();
  }, [task?.created_by]);

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">{task?.title}</DialogTitle>
            <DialogDescription>
              Detalles de la tarea seleccionada:
            </DialogDescription>
          </DialogHeader>
          {task?.description && (
            <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
              {task.description}
            </div>
          )}
          <div className="space-y-1">
            {task?.created_at && (
              <p className="text-xs text-gray-400">
                Fecha de creación:{" "}
                <span className="font-bold">
                  {new Date(task.created_at).toLocaleString()}
                </span>
              </p>
            )}

            {creator ? (
              <p className="text-xs text-gray-400">
                Creado por:{" "}
                <span className="font-bold">
                  {creator.first_name} {creator.last_name} ({creator.email})
                </span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic text-muted-foreground">
                Cargando información del creador...
              </p>
            )}

            {task?.updated_at && (
              <p className="text-xs text-gray-400">
                Actualizado: {new Date(task.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
