import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import Sidebar from "../../islands/Sidebar.tsx";

interface Reservation {
  id: string;
  resource: string;
  user: string;
  date: string;
}

export const handler = {
  async GET(_: Request, ctx: { render: (data: unknown) => Response }) {
    const data: Reservation[] = [
      { id: "r1", resource: "Portátil A", user: "Alice", date: "2024-07-01" },
      { id: "r2", resource: "Silla X",    user: "Bob",   date: "2024-07-02" },
    ];
    return ctx.render({ data });
  },
};

export default function Reservations({ data }: { data: { data: Reservation[] } }) {
  return (
    <>
      <Head>
        <title>Reservas - Orkestria</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </Head>
      <div class="flex h-screen bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <h1 class="text-2xl font-bold text-navy mb-4">Reservas</h1>
          <table class="w-full table-auto bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]">
            <thead>
              <tr class="bg-gray-200">
                <th class="p-2 text-left text-navy">Resource</th>
                <th class="p-2 text-left text-navy">User</th>
                <th class="p-2 text-left text-navy">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map(r => (
                <tr key={r.id} class="border-b border-gray-300 hover:bg-gray-50">
                  <td class="p-2">{r.resource}</td>
                  <td class="p-2">{r.user}</td>
                  <td class="p-2">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}
