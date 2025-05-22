import { Head } from "$fresh/runtime.ts";
import Sidebar from "../islands/Sidebar.tsx";
import NotificationsClient from "../islands/Notifications/NotificationsClient.tsx"; // nueva isla

export default function Notifications() {
  return (
    <>
      <Head>
        <title>Orkestria - Notificaciones</title>
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          {/* Encabezado */}
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-navy">Notificaciones</h1>
          </div>
          <NotificationsClient /> {/* isla con lógica de notificaciones */}
        </main>
      </div>
    </>
  );
}
