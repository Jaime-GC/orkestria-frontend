import { Handlers, PageProps } from "$fresh/server.ts";
import Kanban from "../../islands/Kanban.tsx";

interface Task { id: string; title: string; status: string; }

export const handler: Handlers<{ tasks: Task[] }> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const res = await fetch(`http://localhost:8000/api/projects/${id}/tasks`);
    const tasks: Task[] = await res.json();
    return ctx.render({ tasks });
  },
};

export default function ProjectDetail({ data }: PageProps<{ tasks: Task[] }>) {
  return (
      <div>
        <h1 class="text-2xl font-bold mb-4">Kanban Board</h1>
        <Kanban tasks={data.tasks} />
      </div>
  );
}
