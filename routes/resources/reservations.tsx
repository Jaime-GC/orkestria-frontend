import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import type { Reservation } from "../../components/types.ts";

interface ReservationsData {
  reservations: Reservation[];
  error?: string;
}

export const handler: Handlers<ReservationsData> = {
  async GET(_, ctx) {
    try {
      const response = await fetch("http://localhost:8080/api/reservations");
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return ctx.render({ reservations: data });
    } catch (error) {
      console.error("Error loading reservations:", error);
      return ctx.render({
        reservations: [],
        error: "No se pudieron cargar las reservas.",
      });
    }
  },
};

export default function Reservations({ data }: PageProps<ReservationsData>) {
  const { reservations, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Reservas</title>
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <h1 class="text-2xl font-bold text-navy mb-6">Reservas</h1>
          
          {error && <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}
          
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            {reservations.length === 0 ? (
              <div class="text-center text-gray-500 py-8">
                No hay reservas disponibles.
              </div>
            ) : (
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-300">
                    <th class="py-3 px-4 text-left">Recurso</th>
                    <th class="py-3 px-4 text-left">Inicio</th>
                    <th class="py-3 px-4 text-left">Fin</th>
                    <th class="py-3 px-4 text-left">Reservado por</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} class="border-b border-gray-200">
                      <td class="py-3 px-4">{reservation.resourceGroup.name}</td>
                      <td class="py-3 px-4">{new Date(reservation.startDateTime).toLocaleString()}</td>
                      <td class="py-3 px-4">{new Date(reservation.endDateTime).toLocaleString()}</td>
                      <td class="py-3 px-4">{reservation.reservedBy}</td>
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
