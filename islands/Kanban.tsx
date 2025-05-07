import { h } from "preact";
import { useState } from "preact/hooks";

interface Task { id: string; title: string; status: string; }

export default function Kanban({ tasks }: { tasks: Task[] }) {
  const [cols, setCols] = useState<Record<string, Task[]>>({
    "To Do": tasks.filter(t => t.status === "todo"),
    "In Progress": tasks.filter(t => t.status === "inprogress"),
    "Done": tasks.filter(t => t.status === "done"),
  });

  function onDragStart(e: DragEvent, task: Task, from: string) {
    e.dataTransfer?.setData("task", JSON.stringify({ task, from }));
  }

  function onDrop(e: DragEvent, to: string) {
    e.preventDefault();
    const data = e.dataTransfer?.getData("task");
    if (data) {
      const { task, from } = JSON.parse(data);
      if (from === to) return;
      setCols(prev => {
        const src = [...prev[from]].filter((t: Task) => t.id !== task.id);
        const dst = [...prev[to], { ...task, status: to.toLowerCase().replace(" ", "") }];
        return { ...prev, [from]: src, [to]: dst };
      });
    }
  }

  return (
    <div class="flex space-x-4">
      {Object.entries(cols).map(([col, items]) => (
        <div
          key={col}
          class="flex-1 bg-gray-100 rounded-xl p-4 shadow-inner"
          onDragOver={e => e.preventDefault()}
          onDrop={e => onDrop(e, col)}
        >
          <h3 class="font-semibold mb-2">{col}</h3>
          <div class="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={e => onDragStart(e, item, col)}
                class="bg-white rounded p-2 shadow cursor-move"
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
