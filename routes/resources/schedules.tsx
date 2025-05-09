import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import CalendarTable, { Schedule } from "../../components/CalendarTable.tsx";

export const handler = {
  async GET(_: Request, ctx: { render: (data: unknown) => Response }) {
    const data: Schedule[] = [
      { date: "2024-07-01", shift: "Morning" },
      { date: "2024-07-01", shift: "Evening" },
      { date: "2024-07-02", shift: "Night" },
    ];
    return ctx.render({ data });
  },
};

export default function Schedules({ data }: { data: { data: Schedule[] } }) {
  return (
    <>
      <Head>
        <title>Horarios de empleados - Orkestria</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </Head>
      <div class="flex h-screen bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <h1 class="text-2xl font-bold text-navy mb-4">Horarios</h1>
          <CalendarTable data={data.data} />
        </main>
      </div>
    </>
  );
}
