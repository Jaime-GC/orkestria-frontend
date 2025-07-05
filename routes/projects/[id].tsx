import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Kanban from "../../islands/Kanban.tsx";
import Sidebar from "../../islands/Sidebar.tsx";
import { NewTaskModal } from "../../islands/Buttons/NewTaskModal.tsx";
import type { Project, Task } from "../../components/types.ts";
import { API } from "../../lib/api.ts";

interface ProjectDetailData {
  project: Project;
  tasks: Task[];
  error?: string;
}

export const handler: Handlers<ProjectDetailData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        fetch(`${API}/api/projects/${id}`),
        fetch(`${API}/api/projects/${id}/tasks`)
      ]);
      
      if (!projectResponse.ok || !tasksResponse.ok) {
        throw new Error(`Error en la petición: ${!projectResponse.ok ? projectResponse.status : tasksResponse.status}`);
      }
      
      const project = await projectResponse.json();
      const tasks = await tasksResponse.json();
      
      return ctx.render({ 
        project, 
        tasks 
      });
    } catch (error) {
      console.error(`Error loading project ${id}:`, error);
      return ctx.render({ 
        project: { id, name: "Error", description: "No se pudo cargar el proyecto" }, 
        tasks: [], 
        error: "No se pudo cargar el proyecto y sus tareas"
      });
    }
  },
};

export default function ProjectDetail({ data }: PageProps<ProjectDetailData>) {
  const { project, tasks, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Proyecto: {project.name}</title>
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        
        <main class="flex-1 p-8 overflow-auto">
          {error ? (
            <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          ) : (
            <>
              <div class="mb-8">
                <h1 class="text-2xl font-bold text-navy">{project.name}</h1>
                {project.description && (
                  <p class="mt-2 text-gray-600">{project.description}</p>
                )}
              </div>
              
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-navy">Tareas</h2>
                <NewTaskModal projectId={project.id} onSuccess={() => window.location.reload()} />
              </div>
              
              {tasks.length > 0 ? (
                <Kanban tasks={tasks} project={project} />
              ) : (
                <div class="bg-gray-100 rounded-xl p-6 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] text-center">
                  <p class="text-gray-500">No hay tareas para este proyecto</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
