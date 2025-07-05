import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import {EditItemModal} from "../../islands/Buttons/EditItemModal.tsx";
import {DeleteButton} from "../../islands/Buttons/DeleteButton.tsx";
import { NewReservationModal } from "../../islands/Buttons/NewReservationModal.tsx";
import Sidebar from "../../islands/Sidebar.tsx";
import useNotificationScheduler from "../../hooks/useNotificationScheduler.ts";
import NotificationToggle from "../../islands/Notifications/NotificationToggle.tsx";
import { API } from "../../lib/api.ts";

// Define interface for the data structure
interface Reservation {
  id: number;
  title: string;
  resourceGroup: {
    id: number;
    name: string;
    parent: string | null;
    isReservable: boolean;
  };
  startDateTime: string;
  endDateTime: string;
  reservedBy: string;
}

interface ReservationsData {
  reservations: Reservation[];
  error?: string;
}

export const handler: Handlers<ReservationsData> = {
  async GET(_, ctx) {
    try {
      const response = await fetch(`${API}/api/reservations`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const reservations = await response.json();
      return ctx.render({ reservations });
    } catch (error) {
      console.error("Error loading reservations:", error);
      return ctx.render({
        reservations: [],
        error: "No se pudieron cargar las reservas. Por favor, intente nuevamente."
      });
    }
  }
};

export default function Reservations({ data }: PageProps<ReservationsData>) {
  useNotificationScheduler();
  const { reservations, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Reservas</title>
      </Head>
      <div class="flex h-screen bg-gray-100 font-sans">
        <Sidebar />
        <main class="flex-1 p-8 flex flex-col overflow-hidden">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold text-navy">Reservas</h1>
            <NewReservationModal onSuccess={() => window.location.reload()} />
          </div>

          {error && (
            <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

            <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-4 flex-1 flex flex-col overflow-hidden">
              <div class="overflow-y-auto flex-1 custom-scrollbar">
                
                <table class="w-full">
                  <thead class="sticky top-0 bg-gray-100 z-10">
                    <tr class="border-b border-gray-300">
                      <th class="px-4 py-3 text-left font-medium text-navy ">Título</th>
                      <th class="px-4 py-3 text-left font-medium text-navy ">Recurso</th>
                      <th class="px-4 py-3 text-left font-medium text-navy ">Notificaciones</th>
                      <th class="px-4 py-3 text-left font-medium text-navy ">Fecha Inicio</th>
                      <th class="px-4 py-3 text-left font-medium text-navy ">Fecha Fin</th>
                      <th class="px-4 py-3 text-left font-medium text-navy ">Cliente</th>
                      <th class="px-4 py-3 text-left font-medium text-navy ">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reservations.map(reservation => (
                      <tr key={reservation.id}>
                        <td class="px-4 py-4 whitespace-nowrap">{reservation.title}</td>
                        <td class="px-4 py-4 whitespace-nowrap">{reservation.resourceGroup?.name || 'N/A'}</td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <NotificationToggle
                            eventId={String(reservation.id)}
                            title={reservation.title}
                            end={reservation.endDateTime}
                            type="reservation"
                          />
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">{new Date(reservation.startDateTime).toLocaleString()}</td>
                        <td class="px-4 py-4 whitespace-nowrap">{new Date(reservation.endDateTime).toLocaleString()}</td>
                        <td class="px-4 py-4 whitespace-nowrap">{reservation.reservedBy}</td>
                        <td class="px-4 py-4 whitespace-nowrap actions-cell">
                          <div class="flex space-x-2">
                            <EditItemModal
                              resource="reservations"
                              item={reservation}
                              fields={["title", "startDateTime", "endDateTime", "resourceGroup"]}
                              onSuccess={() => {}}
                            />
                            <DeleteButton
                              resource="reservations"
                              id={reservation.id}
                              onSuccess={() => {}}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </main>
      </div>
    </>
  );
}
