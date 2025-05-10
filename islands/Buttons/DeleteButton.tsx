import { useState } from "preact/hooks";
import { DeleteIcon } from "../../components/Icons.tsx";

interface DeleteButtonProps {
  resource: string;
  id: number | string;
  onSuccess?: () => void;
}

export function DeleteButton({ resource, id, onSuccess }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsOpen(false);
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/${resource}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(`Error deleting ${resource}:`, err);
      setError(`No se pudo eliminar el recurso. ${err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        class="p-1 hover:bg-gray-200 rounded-full ml-2"
      >
        <DeleteIcon />
      </button>

      {isOpen && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-gray-100 rounded-2xl p-6 w-80 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
            <h2 class="text-xl font-semibold text-navy mb-4">
              Confirmar eliminación
            </h2>

            <p class="mb-6">
              ¿Está seguro de que desea eliminar este {resource.slice(0, -1)}?
            </p>

            {error && (
              <div class="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div class="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}