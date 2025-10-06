import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Props = {
  initialTask?: { title: string; description?: string };
  onSubmit: (values: { title: string; description: string }) => void | Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TaskFormDialog = ({
  initialTask,
  onSubmit,
  open,
  onOpenChange,
}: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(initialTask?.title ?? "");
    setDescription(initialTask?.description ?? "");
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description });
    onOpenChange(false); // cerrar al guardar
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialTask ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
          <DialogDescription>
            {initialTask
              ? "Modifica los campos de la tarea y guarda los cambios."
              : "Completa los campos para crear una nueva tarea."}
          </DialogDescription>
        </DialogHeader>

        {/* 👇 Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-3">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              {initialTask ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
