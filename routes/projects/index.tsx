import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import ProjectsList from "../../islands/ProjectsList.tsx";
import { NewProjectModal } from "../../islands/Buttons/NewProjectModal.tsx";

export default function ProjectsPage(_props: PageProps) {
  return (
    <>
      <Head>
        <title>Orkestria - Proyectos</title>
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-navy">Proyectos</h1>
            <NewProjectModal onSuccess={() => window.location.reload()} />
          </div>
          <ProjectsList />
        </main>
      </div>
    </>
  );
}
