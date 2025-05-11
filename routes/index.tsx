// routes/index.tsx
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Sidebar from "../islands/Sidebar.tsx";


export default function Home(_props: PageProps) {
  return (
    <>
      <Head>
        <title>Orkestria - Dashboard</title>
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        <main class="flex-1 flex flex-col items-center justify-center text-center p-8 ">
          <img src="/favicon.ico" alt="Orkestria Logo" class="w-64 h-64 mb-8 anima" />
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
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#6a11cb", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#2575fc", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path
                d="M0,50 C150,150 350,0 500,100 L500,00 L0,0 Z"
                style={{ fill: "url(#gradient)", opacity: 0.9 }}
              />
              </svg>
          </div>
          <footer class="absolute bottom-4 text-sm text-navy">
            Orkestria Company&reg;
          </footer>
        </main>
      </div>
    </>
  );
}
