import { useState } from "preact/hooks";
import { API } from "../../lib/api.ts";
import { DeleteIcon } from "../../components/Icons.tsx";

interface DeleteButtonProps {
  resource: string;
  id: string;
  onSuccess?: () => void;
}

export function DeleteButton({ resource, id, onSuccess }: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`${API}/api/${resource}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setIsModalOpen(false);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload(); // Fallback if no callback
        }
      }, 100);
    } catch (err) {
      console.error("Error deleting:", err);
      setError(`No se pudo eliminar. Por favor, intente nuevamente.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        class="p-1 hover:bg-red-200 rounded-full ml-2 text-red-600"
      >
        <DeleteIcon />
      </button>

      {isModalOpen && (
        <div class="modal-fixed">
          <div class="modal-container">
            <h2 class="text-left text-xl font-semibold text-navy mb-4">
              Confirmar eliminación
            </h2>
            <p class="text-left mb-6 break-words whitespace-normal">
              ¿Está seguro de que desea eliminar este elemento?
            </p>

            {error && (
              <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <div class="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}