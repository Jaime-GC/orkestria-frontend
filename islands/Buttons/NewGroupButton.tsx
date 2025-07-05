import { useState } from "preact/hooks";
import { API } from "../../lib/api.ts";
import type { ResourceGroup } from "../../components/types.ts";

interface NewGroupButtonProps {
  onSuccess?: () => void;
}

export function NewGroupButton({ onSuccess }: NewGroupButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ResourceGroup>>({
    name: "",
    parentId: undefined
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
       console.log(">>> SSR Tasks – API_URL =", API);
      const response = await fetch(`${API}/api/resource-groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      setIsOpen(false);
      setFormData({
        name: "",
        parentId: undefined
      });
      
      // Aseguramos que el callback onSuccess se ejecuta después de la operación exitosa
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload(); // Fallback si no hay callback
        }
      }, 100);
      
    } catch (err) {
      console.error("Error creating resource group:", err);
      setError("No se pudo crear el grupo. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        class="bg-gray-100 rounded-xl px-4 py-2 text-navy font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] flex items-center gap-2 transition-all"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Grupo
      </button>

      {isOpen && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-gray-100 rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-navy">Nuevo Grupo de Recursos</h2>
              <button 
                onClick={() => setIsOpen(false)}
                class="text-gray-500 hover:text-gray-700"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div class="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div class="mb-4">
                <label class="block text-navy text-sm font-medium mb-2" for="name">
                  Nombre del Grupo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onInput={handleInput}
                  required
                  class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                />
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  class="bg-gray-100 rounded-xl px-4 py-2 text-navy font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  class="bg-navy rounded-xl px-4 py-2 text-white font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                      Guardando...
                    </>
                  ) : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
