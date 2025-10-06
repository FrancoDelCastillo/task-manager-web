import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { useBoardStore } from "@/store/boardStore";

import Header from "@/components/header";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";

import BoardMembersDialog from "@/components/board/BoardMembersDialog";

import type { TaskItem } from "@/services/taskApi";
import { getUserRoleInBoard } from "@/services/boardMembersApi";

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskApi";

import { TaskCard } from "@/components/task/TaskCard";
import { TaskFormDialog } from "@/components/task/TaskFormDialog";
import { TaskDialog } from "@/components/task/TaskDialog";
import { useUserStore } from "@/store/userStore";

const columns: { [key: string]: string } = {
  todo: "Por hacer",
  in_progress: "En progreso",
  done: "Completado",
};

export default function BoardPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { getBoardById } = useBoardStore();
  const board = id ? getBoardById(id) : null;

  if (!board) return <p>No se encontró el board</p>;

  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const setCurrentBoardId = useBoardStore((state) => state.setCurrentBoardId);
  const setBoardRole = useUserStore((state) => state.setBoardRole);

  useEffect(() => {
    const fetchRole = async () => {

      try {
        const role = await getUserRoleInBoard(id);
        console.log("currentUserRole: ",role);
        setBoardRole(role);
      } catch (err) {
        console.error("Error al obtener role del usuario:", err);
      }
    };

    fetchRole();
  }, [id, setBoardRole]);

  useEffect(() => {
    setCurrentBoardId(id ?? null);
    return () => setCurrentBoardId(null);
  }, [id, setCurrentBoardId]);

  // --- Drag and drop ---
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId
          ? { ...task, status: destination.droppableId as TaskItem["status"] }
          : task
      )
    );
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks(id!);
        console.log("tasks data: ", data)
        setTasks(data);
      } catch (err) {
        console.error("Error cargando tasks:", err);
      }
    };

    getTasks();
  }, [id]);

  // añadir task
  const handleAddTask = async (values: {
    title: string;
    description: string;
  }) => {
    try {
      const newTask = await createTask(id!, {
        title: values.title,
        description: values.description,
      });
      console.log("new task: ", newTask);
      setTasks((prev) => [...prev, newTask]);
      setOpenAddDialog(false);
    } catch (err) {
      console.error("Error creando tarea:", err);
    }
  };

  // actualizar task
  const handleUpdateTask = async (values: {
    title: string;
    description: string;
  }) => {
    if (!editingTask || !id) return;
    try {
      const updated = await updateTask(id, editingTask.id, values);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTask(null);
    } catch (err) {
      console.error("Error actualizando tarea:", err);
    }
  };

  // borrar task
  const handleDeleteTask = async (boardId: string, taskId: string) => {
    try {
      await deleteTask(boardId, taskId );
      // Filtramos el task eliminado en el estado local
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Error eliminando task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        extraActions={
          <Button variant="link">
            <Link to={`/dashboard`}>Volver al Dashboard</Link>
          </Button>
        }
      />

      <main className="flex-1 p-6">
        {/* Board data */}
        <header className="flex items-center justify-between mb-6 px-2">
          <div>
            <h2 className="text-2xl font-bold">{board.name}</h2>
            <p className="text-sm text-gray-500">{board.description}</p>
            <p className="text-xs text-gray-400">
              Creado el{" "}
              {new Date(board.created_at).toLocaleDateString("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Botón miembros */}
            <BoardMembersDialog />

            {/* Botón añadir tarea */}
            <Button onClick={() => setOpenAddDialog(true)}>Añadir tarea</Button>
          </div>
        </header>

        {/* Kanban drag and drop */}
        <div className="flex gap-4 p-6 items-stretch">
          <DragDropContext onDragEnd={handleDragEnd}>
            {Object.entries(columns).map(([status, title]) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 flex flex-col bg-gray-50 rounded-lg p-3 shadow-sm"
                  >
                    <h2 className="font-bold text-lg mb-3">{title}</h2>
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable
                          draggableId={task.id}
                          index={index}
                          key={task.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3 cursor-grab"
                            >
                              <TaskCard
                                task={task}
                                onClick={() => setSelectedTask(task)}
                                onEdit={() => setEditingTask(task)}
                                onDelete={handleDeleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>

        <TaskFormDialog
          open={openAddDialog}
          onOpenChange={setOpenAddDialog}
          onSubmit={handleAddTask}
        />

        <TaskFormDialog
          open={!!editingTask}
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
          initialTask={editingTask || undefined}
          onSubmit={handleUpdateTask}
        />

        <TaskDialog
          task={selectedTask || undefined}
          open={!!selectedTask}
          onOpenChange={(open) => {
            if (!open) setSelectedTask(null);
          }}
        />
      </main>
    </div>
  );
}
