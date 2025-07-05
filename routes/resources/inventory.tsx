import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../../islands/Sidebar.tsx";
import ResourceInventory from "../../islands/ResourceInventory.tsx";
import { NewGroupButton } from "../../islands/Buttons/NewGroupButton.tsx";
import type { ResourceGroup } from "../../components/types.ts";
import { API } from "../../lib/api.ts";

interface InventoryData {
  groups: ResourceGroup[];
  error?: string;
}

export const handler: Handlers<InventoryData> = {
  async GET(_, ctx) {
    try {
      const response = await fetch(`${API}/api/resource-groups`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return ctx.render({ groups: data });
    } catch (error) {
      console.error("Error loading resource groups:", error);
      return ctx.render({
        groups: [],
        error: "No se pudieron cargar los grupos de recursos.",
      });
    }
  },
};

export default function InventoryPage({ data }: PageProps<InventoryData>) {
  const { groups, error } = data;

  return (
    <>
      <Head>
        <title>Orkestria - Inventario</title>
      </Head>
      <div class="flex h-screen bg-gray-100 font-sans">
        <Sidebar />
        <main class="flex-1 p-8 overflow-auto">
          {/* Encabezado con título y botón */}
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-navy">Inventario</h1>
            <div class="flex items-center">
              <NewGroupButton onSuccess={() => window.location.reload()} />
            </div>
          </div>

          {error && (
            <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}

          <ResourceInventory initialItems={groups} />
        </main>
      </div>
    </>
  );
}
