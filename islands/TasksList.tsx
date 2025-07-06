import { useState, useEffect } from "preact/hooks";
import { Task } from "../components/types.ts";
import { EditItemModal } from "./Buttons/EditItemModal.tsx";
import { DeleteButton } from "./Buttons/DeleteButton.tsx";
import { API } from "../lib/api.ts";

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
        ? `${API}/api/projects/${projectId}/tasks` 
        : `${API}/api/tasks`;
      
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
        fields={["title", "description", "status", "priority", "type", "userId"]} 
        onSuccess={fetchTasks}
      />
    );
  };

  const handleDeleteTask = (taskId: string | number) => {
    // Always use direct task endpoint regardless of project association
    return (
      <DeleteButton 
        resource="tasks" 
        id={taskId.toString()} 
        onSuccess={fetchTasks}
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
            class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-4 transition-all hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-navy mb-2">{task.title}</h3>
                {task.description && (
                  <p class="text-gray-600 mb-3">{task.description}</p>
                )}
                
                {/* Mostrar usuario asignado */}
                <div class="mb-3">
                  <span class="text-sm font-medium text-gray-700">Asignado a: </span>
                  <span class={`text-sm px-2 py-1 rounded-md ${
                    task.assignedUser || task.user ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {task.assignedUser?.username || task.user?.username || 'Sin asignar'}
                  </span>
                </div>
                
                <div class="flex flex-wrap gap-2">
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === "TODO" ? "bg-blue-200 text-blue-800" :
                    task.status === "DOING" ? "bg-yellow-200 text-yellow-800" :
                    task.status === "BLOCKED" ? "bg-red-200 text-red-800" :
                    task.status === "DONE" ? "bg-green-200 text-green-800" :
                    "bg-gray-200 text-gray-800"
                  }`}>
                    {task.status === "TODO" ? "Por hacer" :
                     task.status === "DOING" ? "En progreso" :
                     task.status === "BLOCKED" ? "Bloqueado" :
                     task.status === "DONE" ? "Completado" :
                     "Sin estado"}
                  </span>
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === "HIGH" ? "bg-red-500 text-white" :
                    task.priority === "MEDIUM" ? "bg-yellow-400 text-black" :
                    "bg-green-500 text-white"
                  }`}>
                    {task.priority === "HIGH" ? "Alta" :
                     task.priority === "MEDIUM" ? "Media" : "Baja"}
                  </span>
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.type === "URGENT" ? "bg-red-200 text-red-800" :
                    task.type === "RECURRING" ? "bg-blue-200 text-blue-800" :
                    "bg-gray-200 text-gray-800"
                  }`}>
                    {task.type === "URGENT" ? "Urgente" :
                     task.type === "RECURRING" ? "Recurrente" : "Otro"}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                {handleEditTask(task)}
                {handleDeleteTask(task.id)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
