import { Handlers, PageProps } from "$fresh/server.ts";
import { Card } from "../../components/Card.tsx";
import Sidebar from "../../islands/Sidebar.tsx";

interface Project { id: string; name: string; status: string; }

export const handler: Handlers<{ projects: Project[] }> = {
  async GET(_, ctx) {
    const res = await fetch("http://localhost:8000/api/projects");
    const projects: Project[] = await res.json();
    return ctx.render({ projects });
  },
};

export default function ProjectsList({ data }: PageProps<{ projects: Project[] }>) {
  return (
    <div class="flex h-screen font-sans bg-gray-100">
      <Sidebar />
      <main class="flex-1 p-8 overflow-auto bg-gray-100">
        <div>
          <h1 class="text-2xl font-bold mb-4">Projects</h1>
          <div class="grid grid-cols-3 gap-4">
            {data.projects.map((p) => (
              <Card key={p.id} title={p.name} status={p.status} href={`/projects/${p.id}`} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
