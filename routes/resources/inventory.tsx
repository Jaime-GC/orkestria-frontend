import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import TreeView, { TreeItem } from "../../components/TreeView.tsx";

export const handler = {
  GET(_, ctx) {
    const items: TreeItem[] = [
      {
        id: "1",
        name: "Equipo",
        children: [
          { id: "1.1", name: "Portátiles" },
          { id: "1.2", name: "Monitores" },
        ],
      },
      {
        id: "2",
        name: "Mobiliario",
        children: [
          { id: "2.1", name: "Mesas" },
          { id: "2.2", name: "Sillas" },
        ],
      },
    ];
    return ctx.render({ items });
  },
};

export default function Inventory({ data }: { data: { items: TreeItem[] } }) {
  return (
    <>
      <Head>
        <title>Inventario - Orkestria</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </Head>
      <div class="flex h-screen bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <h1 class="text-2xl font-bold text-navy mb-4">Inventario</h1>
          <TreeView items={data.items} />
        </main>
      </div>
    </>
  );
}
