import Sidebar from "../islands/Sidebar.tsx";

export default function Notifications() {
  return (
    <div class="flex h-screen font-sans bg-gray-100">
      <Sidebar />
      <main class="flex-1 p-8 overflow-auto">
        <h1 class="text-2xl font-bold">Notificaciones</h1>
      </main>
    </div>
  );
}
