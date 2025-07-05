import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Task } from "../../components/types.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import TasksList from "../../islands/TasksList.tsx";
import { NewTaskModal } from "../../islands/Buttons/NewTaskModal.tsx";
import { API } from "../../lib/api.ts";

interface TasksPageData {
  tasks: Task[];
  error?: string;
}

export const handler: Handlers<TasksPageData> = {
  async GET(_, ctx) {
    try {
      const response = await fetch(`${API}/api/tasks`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const tasks = await response.json();
      return ctx.render({ tasks });
    } catch (error) {
      console.error("Error loading tasks:", error);
      return ctx.render({
        tasks: [],
        error: "No se pudieron cargar las tareas. Por favor, intente nuevamente.",
      });
    }
  },
};

export default function TasksPage({ data }: PageProps<TasksPageData>) {
  const { tasks, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Tareas</title>
      </Head>
      <div class="flex h-screen bg-gray-100 font-sans">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-navy">Tareas</h1>
            <div>
              <NewTaskModal onSuccess={() => window.location.reload()} />
            </div>
          </div>

          {error && (
            <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}

          <TasksList initialTasks={tasks} />
        </main>
      </div>
    </>
  );
}
