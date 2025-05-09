import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import ResourceInventory from "../../islands/ResourceInventory.tsx";
import { BoxNode } from "../../islands/BoxTree.tsx";

export const handler = {
  GET(_: Request, ctx: { render: (data: unknown) => Response }) {
    const items: BoxNode[] = [
      {
        id: "1",
        name: "Equipo Informático",
        children: [
          {
            id: "1.1",
            name: "Portátiles",
            children: [
              { id: "1.1.1", name: "Dell XPS" },
              { id: "1.1.2", name: "MacBook Pro" },
              { id: "1.1.3", name: "ThinkPad X1" },
            ],
          },
          {
            id: "1.2",
            name: "Monitores",
            children: [
              { id: "1.2.1", name: "Dell 27\"" },
              { id: "1.2.2", name: "LG Ultrawide" },
            ],
          },
          { id: "1.3", name: "Periféricos" },
        ],
      },
      {
        id: "2",
        name: "Mobiliario",
        children: [
          { id: "2.1", name: "Mesas" },
          { id: "2.2", name: "Sillas" },
          { id: "2.3", name: "Archivadores" },
        ],
      },
      {
        id: "3",
        name: "Material de Oficina",
        children: [
          { id: "3.1", name: "Papelería" },
          { id: "3.2", name: "Artículos de escritura" },
        ],
      },
    ];
    return ctx.render({ items });
  },
};

export default function Inventory({ data }: { data: { items: BoxNode[] } }) {
  return (
    <>
      <Head>
        <title>Inventario - Orkestria</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </Head>
      <div class="flex h-screen bg-gray-100">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          <ResourceInventory initialItems={data.items} />
        </main>
      </div>
    </>
  );
}
