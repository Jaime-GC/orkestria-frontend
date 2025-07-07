import { h } from "preact";
import { useState } from "preact/hooks";
import type { Task } from "../components/types.ts";
import { EditItemModal } from "./Buttons/EditItemModal.tsx";
import { DeleteButton } from "./Buttons/DeleteButton.tsx";

export default function Kanban({ tasks, project }: { tasks: Task[], project: { id: number } }) {
  // Fix status type
  const [cols, setCols] = useState<Record<string, Task>>({
    "To Do": tasks.filter(t => t.status === "TODO"),
    "In Progress": tasks.filter(t => t.status === "DOING"),
    "Blocked": tasks.filter(t => t.status === "BLOCKED"),
    "Done": tasks.filter(t => t.status === "DONE"),
  });

  function onDragStart(e: DragEvent, task: Task, from: string) {
    e.dataTransfer?.setData("task", JSON.stringify({ task, from }));
  }

  // Now receives the complete task object
  async function updateTaskStatus(task: Task, newStatus: string) {
    try {
      const payload = { ...task, status: newStatus };
      console.log("Sending complete payload:", payload);

      const response = await fetch(
        `http://localhost:8080/api/projects/${project.id}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const text = await response.text();
      console.log("Backend response:", response.status, text);
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
      if (to === "To Do") newStatus = "TODO";
      else if (to === "In Progress") newStatus = "DOING";
      else if (to === "Blocked") newStatus = "BLOCKED";
      else if (to === "Done") newStatus = "DONE";
      
      setCols(prev => {
        const src = [...prev[from]].filter((t: Task) => t.id !== task.id);
        const dst = [...prev[to], { ...task, status: newStatus }];
        return { ...prev, [from]: src, [to]: dst };
      });
      
      // pass `task` instead of just id
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
                class="bg-gray-100 rounded-xl p-2 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]
                       transition-all hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]
                       cursor-move"
              >
                <div>{item.title}</div>
                <div class="flex justify-end space-x-2 mt-2">
                  <EditItemModal
                    resource={`projects/${project.id}/tasks`}
                    item={item}
                    fields={["title"]}
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
