import { useState, useEffect } from "preact/hooks";
import { Task } from "../components/types.ts";
import { EditItemModal } from "./Buttons/EditItemModal.tsx";
import { DeleteButton } from "./Buttons/DeleteButton.tsx";

interface TasksListProps {
  initialTasks?: Task[];
  projectId?: number;
}

export default function TasksList({ initialTasks = [], projectId }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(initialTasks.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTasks.length === 0) {
      fetchTasks();
    }
  }, [initialTasks]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const url = projectId 
        ? `http://localhost:8080/api/projects/${projectId}/tasks` 
        : `http://localhost:8080/api/tasks`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("No se pudieron cargar las tareas. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  const handleEditTask = (task: Task) => {
    // Always use direct task endpoint regardless of project association
    return (
      <EditItemModal 
        resource="tasks" 
        item={task} 
        fields={["title", "description", "status", "priority", "type"]} 
        onSuccess={fetchTasks}
      />
    );
  };

  const handleDeleteTask = (taskId: number) => {
    // Always use direct task endpoint regardless of project association
    return (
      <DeleteButton 
        resource="tasks" 
        id={taskId} 
        onSuccess={fetchTasks}
        confirmText="¿Estás seguro de que deseas eliminar esta tarea?"
      />
    );
  };

  if (loading) return <div class="text-center py-8">Cargando tareas...</div>;
  if (error) return <div class="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>;

  return (
    <div class="space-y-4">
      {tasks.length === 0 ? (
        <div class="text-center text-gray-500 py-8">
          No hay tareas disponibles.
        </div>
      ) : (
        tasks.map(task => (
          <div 
            key={task.id} 
            class="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >
            <div>
              <h3 class="text-lg font-semibold">{task.title}</h3>
              <p class="text-gray-600">{task.description}</p>
              <span class={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                task.status === "TODO" ? "bg-blue-100 text-blue-800" :
                task.status === "DOING" ? "bg-yellow-100 text-yellow-800" :
                task.status === "BLOCKED" ? "bg-red-100 text-red-800" :
                task.status === "DONE" ? "bg-green-100 text-green-800" :
                ""
              }`}>
                {task.status === "TODO" ? "Por hacer" :
                 task.status === "DOING" ? "En progreso" :
                 task.status === "BLOCKED" ? "Bloqueado" :
                 task.status === "DONE" ? "Completado" :
                 ""}
              </span>
            </div>
            <div class="flex space-x-2">
              {handleEditTask(task)}
              {handleDeleteTask(task.id)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
