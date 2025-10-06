import { useState } from "react";
import { createBoard } from "../../services/boardApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

interface CreateBoardDialogProps {
  onBoardCreated?: () => void;
}

export function CreateBoardDialog({ onBoardCreated }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createBoard(name, description);
      setOpen(false);
      setName("");
      setDescription("");

      toast.success("Board creado 🎉", {
        description: "Tu nuevo board se ha creado satisfactoriamente.",
      });

      if (onBoardCreated) {
        onBoardCreated();
      }
      
    } catch (err) {
      console.error("Error creando board:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full">
          Crear nuevo Board
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Board</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Board</Label>
            <Input
              id="name"
              maxLength={60} 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              maxLength={150}            
              rows={3}   
              className="max-h-32 resize-none"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}