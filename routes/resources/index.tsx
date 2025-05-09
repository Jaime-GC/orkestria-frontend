import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import { InventoryIcon, ScheduleIcon, ReservationIcon } from "../../components/Icons.tsx";

export default function ResourcesIndex() {
    return (
        <>
            <Head>
                <title>Orkestria - Recursos</title>
                <meta name="description" content="Gestión de recursos: inventario, horarios de empleados y reservas de clientes." />
            </Head>
            <div class="flex">
                <Sidebar />
                <div class="p-8 bg-gray-100 min-h-screen flex-1">
                    <h1 class="text-3xl font-bold text-navy mb-6">Recursos</h1>
                    <div class="grid grid-cols-3 gap-6">
                        <a
                            href="/resources/inventory"
                            class="flex flex-col items-center gap-2 bg-gray-100 text-gray-800 py-4 px-6 rounded shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition"
                        >
                            <InventoryIcon class="w-8 h-8 text-navy" />
                            <span class="text-xl font-semibold">Inventario</span>
                        </a>
                        <a
                            href="/resources/schedules"
                            class="flex flex-col items-center gap-2 bg-gray-100 text-gray-800 py-4 px-6 rounded shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition"
                        >
                            <ScheduleIcon class="w-8 h-8 text-navy" />
                            <span class="text-xl font-semibold">Horarios de empleados</span>
                        </a>
                        <a
                            href="/resources/reservations"
                            class="flex flex-col items-center gap-2 bg-gray-100 text-gray-800 py-4 px-6 rounded shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition"
                        >
                            <ReservationIcon class="w-8 h-8 text-navy" />
                            <span class="text-xl font-semibold">Reservas de clientes</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
