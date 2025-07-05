import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Sidebar from "../islands/Sidebar.tsx";
import { NewUserModal } from "../islands/Buttons/NewUserModal.tsx";
import { DeleteButton } from "../islands/Buttons/DeleteButton.tsx";
import { EditItemModal } from "../islands/Buttons/EditItemModal.tsx";
import type { User } from "../components/types.ts";
import { API } from "../lib/api.ts";

export const handler: Handlers<{ users: User[]; error?: string }> = {
  async GET(_, ctx) {
    try {
      const response = await fetch(`${API}/api/users`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return ctx.render({ users: data });
    } catch (error) {
      console.error("Error loading users:", error);
      return ctx.render({ 
        users: [],
        error: "No se pudieron cargar los usuarios. Por favor, intente nuevamente."
      });
    }
  },
};

export default function Users({ data }: PageProps<{ users: User[]; error?: string }>) {
  const { users, error } = data;
  
  // Función de recarga forzada para asegurar actualización completa
  const forceRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Orkestria - Usuarios</title>
      </Head>
      <div class="flex h-screen bg-gray-100 font-sans">
        <Sidebar />

        <main class="flex-1 p-8 flex flex-col">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold text-navy">Usuarios</h1>
            <NewUserModal onSuccess={forceRefresh} />
          </div>
          
          {error && (
            <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}
          
          <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6 flex-1 flex flex-col">
            <div class="overflow-y-auto flex-1 custom-scrollbar">
              
              {users.length === 0 && !error ? (
                <div class="text-center text-gray-500 p-8">
                  <p class="text-xl">No hay usuarios disponibles</p>
                </div>
              ) : (
                <table class="w-full">
                  <thead class="sticky top-0 bg-gray-100 z-10">
                    <tr class="border-b border-gray-300">
                      <th class="py-3 px-4 text-left font-medium text-navy">Nombre</th>
                      <th class="py-3 px-4 text-left font-medium text-navy">Email</th>
                      <th class="py-3 px-4 text-left font-medium text-navy">Rol</th>
                      <th class="py-3 px-4 text-right font-medium text-navy">Acciones</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="py-3 px-4">{user.username}</td>
                        <td class="py-3 px-4">{user.email}</td>
                        <td class="py-3 px-4">
                          {user.role === "EMPLOYEE" ? "Empleado" : 
                           user.role === "CLIENT" ? "Cliente" : 
                           user.role}
                        </td>
                        <td class="py-3 px-4 text-right">
                          <div class="inline-flex">
                            <EditItemModal
                              resource="users"
                              item={user}
                              fields={["username", "email", "role"]}
                              onSuccess={forceRefresh}
                            />
                            <DeleteButton
                              resource="users"
                              id={user.id}
                              onSuccess={forceRefresh}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}