import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Kanban from "../../islands/Kanban.tsx";
import Sidebar from "../../islands/Sidebar.tsx";

interface Task { id: string; title: string; status: string; }

export const handler: Handlers<{ tasks: Task[] }> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const res = new Response(JSON.stringify([
      { id: "1", title: "Task 1", status: "todo" },
      { id: "2", title: "Task 2", status: "inprogress" },
      { id: "3", title: "Task 3", status: "done" },
      { id: "4", title: "Task 4", status: "blocked" },
      { id: "5", title: "Task 5", status: "todo" },
      { id: "6", title: "Task 6", status: "inprogress" },
      { id: "7", title: "Task 7", status: "done" },
      { id: "8", title: "Task 8", status: "blocked" },
    ]));
    const tasks: Task[] = await res.json();
    return ctx.render({ tasks });
  },
};

export default function ProjectDetail({ data, params }: PageProps<{ tasks: Task[] }>) {
  return (
    <>
      <Head>
        <title>Orkestria - Proyecto #{params.id}</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />

        <main class="w-3/4 p-4">
          <h1 class="text-2xl font-bold mb-4">Kanban Board</h1>
          <Kanban tasks={data.tasks} />
        </main>
      </div>
    </>
  );
}
