import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import type { Schedule } from "../../components/types.ts";
import { NewScheduleModal } from "../../islands/Buttons/NewScheduleModal.tsx";
import { EditItemModal } from "../../islands/Buttons/EditItemModal.tsx";
import { DeleteButton } from "../../islands/Buttons/DeleteButton.tsx";

interface SchedulesData {
  schedules: Schedule[];
  error?: string;
}

export const handler: Handlers<SchedulesData> = {
  async GET(req, ctx) {
    try {
      const response = await fetch("http://localhost:8080/api/employee-schedules");

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const schedules = await response.json();
      return ctx.render({
        schedules,
        error: undefined,
      });
    } catch (error) {
      console.error("Error loading schedules:", error);
      return ctx.render({
        schedules: [],
        error: "No se pudieron cargar los horarios.",
      });
    }
  },
};

export default function Schedules({ data }: PageProps<SchedulesData>) {
  const { schedules, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Horarios</title>
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          {/* Encabezado con título y botones */}
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-navy">Horarios de Empleados</h1>
            <div class="flex space-x-2">
              <NewScheduleModal onSuccess={() => window.location.reload()} />
            </div>
          </div>

          {error && (
            <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            {schedules.length === 0 ? (
              <div class="text-center text-gray-500 py-8">
                No hay horarios disponibles.
              </div>
            ) : (
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-300">
                    <th class="py-3 px-4 text-left">Usuario</th>
                    <th class="py-3 px-4 text-left">Título</th>
                    <th class="py-3 px-4 text-left">Inicio</th>
                    <th class="py-3 px-4 text-left">Fin</th>
                    <th class="py-3 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} class="border-b border-gray-200">
                      <td class="py-3 px-4">{schedule.username}</td>
                      <td class="py-3 px-4">{schedule.title}</td>
                      <td class="py-3 px-4">
                        {new Date(schedule.startDateTime).toLocaleString()}
                      </td>
                      <td class="py-3 px-4">
                        {new Date(schedule.endDateTime).toLocaleString()}
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex space-x-2">
                          <EditItemModal
                            resource="employee-schedules"
                            item={schedule}
                            fields={["username", "title", "startDateTime", "endDateTime"]}
                            onSuccess={() => window.location.reload()}
                          />
                          <DeleteButton
                            resource="employee-schedules"
                            id={String(schedule.id)}
                            onSuccess={() => window.location.reload()}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
