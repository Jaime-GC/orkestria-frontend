import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import TuiCalendarIsland, { TuiEvent } from "../../islands/TuiCalendarIsland.tsx";
import type { Reservation } from "../../components/types.ts";
import { NewReservationModal } from "../../islands/Buttons/NewReservationModal.tsx";
import { API } from "../../lib/api.ts";

interface ReservationsCalendarData {
  events: TuiEvent[];
  error?: string;
}

export const handler: Handlers<ReservationsCalendarData> = {
  async GET(req, ctx) {
    try {
      const response = await fetch(`${API}/api/reservations`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const reservations: Reservation[] = await response.json();
      
      // Map Reservation to TuiEvent
      const events: TuiEvent[] = reservations.map((reservation) => ({
        id: String(reservation.id),
        calendarId: "2", // Using calendar ID defined in TuiCalendarIsland for reservations
        title: `${reservation.resourceGroup.name}: ${reservation.title || 'Sin título'}`,
        category: "time",
        start: reservation.startDateTime,
        end: reservation.endDateTime,
        raw: {
          reservedBy: reservation.reservedBy
        }
      }));
      
      return ctx.render({ events });
    } catch (error) {
      console.error("Error loading reservations:", error);
      return ctx.render({
        events: [],
        error: "No se pudieron cargar las reservas."
      });
    }
  },
};

export default function ReservationsCalendarPage({ data }: PageProps<ReservationsCalendarData>) {
  const { events, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Calendario de Reservas</title>
      </Head>
      <div class="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-navy">Calendario de Reservas</h1>
            <div class="flex space-x-2">
              <NewReservationModal onSuccess={() => window.location.reload()} />
            </div>
          </div>
          
          {error && <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}
          
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
            <TuiCalendarIsland events={events} view="month" />
          </div>
        </main>
      </div>
    </>
  );
}
