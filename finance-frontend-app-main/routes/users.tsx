import { Handlers, PageProps } from "$fresh/server.ts";
import Sidebar from "../islands/Sidebar.tsx";
import axios from "npm:axios";
import { NewUserModal } from "../islands/NewUserModal.tsx";
import { DeleteButton } from "../islands/DeleteButton.tsx";
import { EditItemModal } from "../islands/EditItemModal.tsx";

interface User {
  id: number;
  name: string;
  email: string;
}

export const handler: Handlers<{ users: User[] }> = {
  async GET(_, ctx) {
    try {
      const resp = await axios.get<User[]>("http://localhost:8080/users/all");
      return ctx.render({ users: resp.data });
    } catch {
      return ctx.render({ users: [] });
    }
  },
};

export default function Users({ data }: PageProps<{ users: User[] }>) {
  const { users } = data;

  return (
    <div class="flex h-screen overflow-hidden bg-gray-100 font-sans">
      <Sidebar />

      <main class="flex-1 p-8 flex flex-col overflow-hidden">

        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-navy">Users</h1>
          <NewUserModal onSuccess={() => window.location.reload()} />
        </div>
        <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]
                    p-6 flex-1 flex flex-col overflow-hidden">
          <div class="overflow-y-auto flex-1 custom-scrollbar">
            
            <table class="w-full">

              {/* Encabezado de la tabla */}
              <thead class="sticky top-0 bg-gray-100 z-10">
                <tr class="border-b border-gray-300">
                  <th class="py-3 px-4 text-left font-medium text-navy">Name</th>
                  <th class="py-3 px-4 text-left font-medium text-navy">Email</th>
                  <th class="py-3 px-4 text-right font-medium text-navy">Actions</th>
                </tr>
              </thead>

              {/* Cuerpo de la tabla */}
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4">{user.name}</td>
                    <td class="py-3 px-4">{user.email}</td>
                    <td class="py-3 px-4 text-right">
                      <EditItemModal
                        resource="users"
                        item={user}
                        fields={["name", "email"]}
                        onSuccess={() => window.location.reload()}
                      />
                      <DeleteButton
                        resource="users"
                        id={user.id}
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