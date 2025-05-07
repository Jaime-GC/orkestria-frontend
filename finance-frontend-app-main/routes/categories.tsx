import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../islands/Sidebar.tsx";
import axios from "npm:axios";
import { NewCategoryModal } from "../islands/NewCategoryModal.tsx";
import { DeleteButton } from "../islands/DeleteButton.tsx";
import { EditItemModal } from "../islands/EditItemModal.tsx";

interface Category {
  id: number;
  name: string;
}

export const handler: Handlers<{ categories: Category[] }> = {
  async GET(_, ctx) {
    try {
      const resp = await axios.get<Category[]>("http://localhost:8080/categories/all");
      return ctx.render({ categories: resp.data });
    } catch {
      return ctx.render({ categories: [] });
    }
  },
};

export default function Categories({ data }: PageProps<{ categories: Category[] }>) {
  const { categories } = data;

  return (
    <div class="flex h-screen overflow-hidden bg-gray-100 font-sans">
      <Sidebar />
      <main class="flex-1 p-8 flex flex-col overflow-hidden">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-navy">Categories</h1>
          <NewCategoryModal onSuccess={() => window.location.reload()} />
        </div>
        <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]
                    p-6 flex-1 flex flex-col overflow-hidden">
          <div class="overflow-y-auto flex-1 custom-scrollbar">
            <table class="w-full">


              <thead class="sticky top-0 bg-gray-100 z-10">
                <tr class="border-b border-gray-300">
                  <th class="py-3 px-4 text-left font-medium text-navy">Name</th>
                  <th class="py-3 px-4 text-right font-medium text-navy">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4">{category.name}</td>
                    <td class="py-3 px-4 text-right">
                      <EditItemModal
                        resource="categories"
                        item={category}
                        fields={["name"]}
                        onSuccess={() => window.location.reload()}
                      />
                      <DeleteButton
                        resource="categories"
                        id={category.id}
                        onSuccess={() => window.location.reload()}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </main>
    </div>
  );
}