// routes/index.tsx
import { PageProps } from "$fresh/server.ts";
import Sidebar from "../islands/Sidebar.tsx";

export default function Home(_props: PageProps) {
  return (
    <div class="flex h-screen font-sans bg-gray-100">
      <Sidebar />
      <main class="flex-1 flex flex-col items-center justify-center text-center p-8 ">
        <h1 class="text-5xl font-extrabold text-navy mb-6">¡Bienvenido a Orkestria!</h1>
        <p class="text-lg text-navy max-w-2xl mb-10">
          Orkestria es tu plataforma integral para gestionar proyectos, tareas y recursos de manera eficiente. 
          Simplifica tu flujo de trabajo y colabora con tu equipo en un entorno moderno y atractivo.
        </p>
        <div class="w-full max-w-lg">
          <svg
            class="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"
              style={{ fill: "#d1d9e6", opacity: 0.8 }}
            />
          </svg>
        </div>
        <footer class="absolute bottom-4 text-sm text-navy">
          Orkestria Company
        </footer>
      </main>
    </div>
  );
}
