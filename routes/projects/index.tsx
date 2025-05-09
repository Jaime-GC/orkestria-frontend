import { Handlers, PageProps } from "$fresh/server.ts";
import { Card } from "../../components/Card.tsx";
import Sidebar from "../../islands/Sidebar.tsx";
import { Head } from "$fresh/runtime.ts";

interface Project { id: string; name: string; status: string; }

export const handler: Handlers<{ projects: Project[] }> = {
  async GET(_, ctx) {
    // Simulación de datos de proyectos
    const projects: Project[] = [
      { id: "1", name: "Project Alpha", status: "In Progress" },
      { id: "2", name: "Project Beta", status: "Done" },
      { id: "3", name: "Project Gamma", status: "Not Started" },
    ];
    return ctx.render({ projects });
  },
};

export default function ProjectsList({ data }: PageProps<{ projects: Project[] }>) {
  const { projects } = data;

  if (!projects || projects.length === 0) {
    return (
      <>
        <Head>
            <title>Orkestria - Proyectos - No se encontraron proyectos</title>
          <meta name="description" content="No projects found in Orkestria." />
        </Head>
        <div class="flex h-screen font-sans bg-gray-100">
          <Sidebar />
          <main class="flex-1 p-8 flex items-center justify-center">
            <h1 class="text-2xl font-bold text-gray-500">No projects found</h1>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Orkestria - Proyectos</title>
        <meta name="description" content="Browse the list of projects in Orkestria." />
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <div>
            <h1 class="text-2xl font-bold mb-4">Projects</h1>
            <div class="grid grid-cols-3 gap-4">
              {projects.map((p) => (
                <Card
                  key={p.id}
                  class="
                  bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] transition-all hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] hover:bg-gray-200"
                >
                  <a href={`/projects/${p.id}`} class="block p-4">
                    <h2 class="text-lg font-semibold text-navy">{p.name}</h2>
                    <p class="text-sm text-gray-500">{p.status}</p>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
