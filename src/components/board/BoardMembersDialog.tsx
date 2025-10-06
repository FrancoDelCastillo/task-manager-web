import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { getBoardMembers } from "@/services/boardMembersApi";

export type BoardMember = {
  id: string;
  role: "admin" | "member" | "viewer";
  board_id: string;
  profile: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
};

export default function BoardMembersDialog() {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(false);

  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const boardId = useBoardStore((s) => s.currentBoardId);

  const currentUserRole = useUserStore((s) => s.boardRole);

  useEffect(() => {
    if (!open || !boardId) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getBoardMembers(boardId);
        console.log("BoardMembersDialog Component fetch: ", data);
        setMembers(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, boardId]);

  useEffect(() => {
    if (!open || !boardId) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getBoardMembers(boardId);
        console.log("BoardMembersDialog Component fetch: ", data);
        setMembers(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, boardId]);

  return (
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Miembros</Button>
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Miembros del board</DialogTitle>
    </DialogHeader>

    {loading ? (
      <p className="text-sm text-muted-foreground">Cargando...</p>
    ) : (
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.id} className="flex border-b pb-2">
            <div className="flex items-center justify-between w-full">
              <div>
                <p>{m.profile.email}</p>
                <p className="text-xs text-muted-foreground">
                  {m.profile.first_name ?? ""} {m.profile.last_name ?? ""}
                </p>
              </div>
              <Badge
                variant={m.role === "admin" ? "default" : "secondary"}
              >
                {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
              </Badge>
            </div>
            {currentUserRole === "admin" && m.role === "member" && (
              <Button variant="destructive" size="sm">
                Eliminar
              </Button>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aún no hay miembros.
          </p>
        )}
      </div>
    )}

    {/* Botón añadir miembro dentro del dialog principal */}
    {currentUserRole === "admin" && (
      <Dialog open={openAddMemberDialog} onOpenChange={setOpenAddMemberDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-3">
            Añadir miembro
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir miembro</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Email del nuevo miembro</Label>
            <Input
             type="email" 
             required            
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button>Añadir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
  </DialogContent>
</Dialog>
  );
}
