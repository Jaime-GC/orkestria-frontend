import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import axios from "axios";
import Sidebar from "../../islands/Sidebar.tsx";
import type { Reservation } from "../../components/types.ts";

interface ReservationsData {
  reservations: Reservation[];
  error?: string;
}

export const handler: Handlers<ReservationsData> = {
  async GET(_, ctx) {
    try {
      // Primero obtenemos todos los recursos
      const itemsResponse = await axios.get<any[]>("http://localhost:8080/api/resource-items");
      const resourceItems = itemsResponse.data;
      
      // Luego obtenemos las reservas para cada recurso
      const reservationsPromises = resourceItems.map(item => 
        axios.get<Reservation[]>(`http://localhost:8080/api/resource-items/${item.id}/reservations`)
          .then(response => response.data)
      );
      
      const allReservationsArrays = await Promise.all(reservationsPromises);
      // Aplanar el array de arrays
      const reservations = allReservationsArrays.flat();
      
      return ctx.render({ reservations });
    } catch (error) {
      console.error("Error loading reservations:", error);
      return ctx.render({
        reservations: [],
        error: "No se pudieron cargar las reservas.",
      });
    }
  },
};

export default function ReservationsPage({ data }: PageProps<ReservationsData>) {
  const { reservations, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Reservas</title>
      </Head>
      <div class="flex h-screen bg-gray-100 font-sans">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <h1 class="text-2xl font-bold text-navy mb-6">Reservas de Recursos</h1>
          
          {error && (
            <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}

          {/* Lista de reservas */}
          {reservations.length === 0 && !error ? (
            <div class="text-center text-gray-500 p-6">
              No hay reservas disponibles.
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservations.map(reservation => (
                <div key={reservation.id} class="bg-white rounded-xl p-6 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]">
                  <h3 class="text-lg font-bold mb-2">
                    {reservation.resourceItem?.name || "Recurso desconocido"}
                  </h3>
                  <div class="text-sm text-gray-600">
                    <p>Reservado por: {reservation.reservedBy}</p>
                    <p>Inicio: {new Date(reservation.startDateTime).toLocaleString()}</p>
                    <p>Fin: {new Date(reservation.endDateTime).toLocaleString()}</p>
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
