import { h } from "preact";
import { useState } from "preact/hooks";
import type { Task } from "../components/types.ts";
import { EditItemModal } from "./Buttons/EditItemModal.tsx";
import { DeleteButton } from "./Buttons/DeleteButton.tsx";
import { API } from "../lib/api.ts";

export default function Kanban({ tasks, project }: { tasks: Task[], project: { id: number } }) {
  // Corregir tipo de estado
  const [cols, setCols] = useState<Record<string, Task[]>>({
    "Por hacer": tasks.filter(t => t.status === "TODO"),
    "En progreso": tasks.filter(t => t.status === "DOING"),
    "Bloqueadas": tasks.filter(t => t.status === "BLOCKED"),
    "Hechas": tasks.filter(t => t.status === "DONE"),
  });

  function onDragStart(e: DragEvent, task: Task, from: string) {
    e.dataTransfer?.setData("task", JSON.stringify({ task, from }));
  }

  // Ahora recibe el objeto task completo
  async function updateTaskStatus(task: Task, newStatus: string) {
    try {
      const payload = { ...task, status: newStatus };
      console.log("Enviando payload completo:", payload);

      const response = await fetch(
        `${API}/api/projects/${project.id}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const text = await response.text();
      console.log("Respuesta del backend:", response.status, text);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${text}`);
      }
      return true;
    } catch (err) {
      console.error("Error updating task status:", err);
      return false;
    }
  }

  function onDrop(e: DragEvent, to: string) {
    e.preventDefault();
    const data = e.dataTransfer?.getData("task");
    if (data) {
      const { task, from } = JSON.parse(data);
      if (from === to) return;
      
      let newStatus: "TODO" | "DOING" | "BLOCKED" | "DONE" = "TODO";
      if (to === "Por hacer") newStatus = "TODO";
      else if (to === "En progreso") newStatus = "DOING";
      else if (to === "Bloqueadas") newStatus = "BLOCKED";
      else if (to === "Hechas") newStatus = "DONE";
      
      setCols(prev => {
        const src = [...prev[from]].filter((t: Task) => t.id !== task.id);
        const dst = [...prev[to], { ...task, status: newStatus }];
        return { ...prev, [from]: src, [to]: dst };
      });
      
      // pasar `task` en vez de solo id
      updateTaskStatus(task, newStatus).then(success => {
        if (!success) {
          setCols(prev => {
            const dst = [...prev[to]].filter((t: Task) => t.id !== task.id);
            const src = [...prev[from], task];
            return { ...prev, [from]: src, [to]: dst };
          });
          alert("No se pudo actualizar la tarea. Cambio revertido.");
        }
      });
    }
  }

  return (
    <div class="flex space-x-4">
      {Object.entries(cols).map(([col, items]) => (
        <div
          key={col}
          class="flex-1 border-2 border-navy rounded-xl p-4"
          onDragOver={e => e.preventDefault()}
          onDrop={e => onDrop(e, col)}
        >
          <h3 class="font-semibold mb-2 text-navy">{col}</h3>
          <div class="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={e => onDragStart(e, item, col)}
                class="bg-gray-100 rounded-xl p-3 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]
                       transition-all hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]
                       cursor-move"
              >
                <div class="font-medium text-navy mb-2">{item.title}</div>
                {item.description && (
                  <div class="text-sm text-gray-600 mb-2">{item.description}</div>
                )}
                <div class="flex justify-between items-center mb-2">
                  <div class="flex space-x-2">
                    <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === "HIGH" ? "bg-red-500 text-white" :
                      item.priority === "MEDIUM" ? "bg-yellow-400 text-black" :
                      "bg-green-500 text-white"
                    }`}>
                      {item.priority === "HIGH" ? "Alta" :
                       item.priority === "MEDIUM" ? "Media" : "Baja"}
                    </span>
                    <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === "URGENT" ? "bg-red-200 text-red-800" :
                      item.type === "RECURRING" ? "bg-blue-200 text-blue-800" :
                      "bg-gray-200 text-gray-800"
                    }`}>
                      {item.type === "URGENT" ? "Urgente" :
                       item.type === "RECURRING" ? "Recurrente" : "Otro"}
                    </span>
                  </div>
                </div>
                <div class="flex justify-end space-x-2">
                  <EditItemModal
                    resource={`projects/${project.id}/tasks`}
                    item={item}
                    fields={["title", "description", "status", "priority", "type"]}
                    onSuccess={() => window.location.reload()}
                  />
                  <DeleteButton
                    resource={`projects/${project.id}/tasks`}
                    id={item.id}
                    onSuccess={() => window.location.reload()}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
