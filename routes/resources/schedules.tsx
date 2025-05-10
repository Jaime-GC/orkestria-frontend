import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import axios from "axios";
import Sidebar from "../../islands/Sidebar.tsx";
import type { Schedule } from "../../components/types.ts";

interface SchedulesData {
  schedules: Schedule[];
  error?: string;
}

export const handler: Handlers<SchedulesData> = {
  async GET(_, ctx) {
    try {
      const response = await axios.get<Schedule[]>(
        "http://localhost:8080/api/employee-schedules"
      );
      return ctx.render({ schedules: response.data });
    } catch (error) {
      console.error("Error loading schedules:", error);
      return ctx.render({
        schedules: [],
        error: "No se pudieron cargar los horarios.",
      });
    }
  },
};

export default function SchedulesPage({ data }: PageProps<SchedulesData>) {
  const { schedules, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Horarios</title>
      </Head>
      <div class="flex h-screen bg-gray-100 font-sans">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <h1 class="text-2xl font-bold text-navy mb-6">
            Horarios de Empleados
          </h1>

          {error && (
            <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Lista de horarios */}
          {schedules.length === 0 && !error ? (
            <div class="text-center text-gray-500 p-6">
              No hay horarios disponibles.
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  class="bg-white rounded-xl p-6 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]"
                >
                  <h3 class="text-lg font-bold mb-2">{schedule.username}</h3>
                  <div class="text-sm text-gray-600">
                    <p>
                      Inicio:{" "}
                      {new Date(schedule.startDateTime).toLocaleString()}
                    </p>
                    <p>
                      Fin: {new Date(schedule.endDateTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
