import { useState } from "preact/hooks";
import { EditIcon } from "../../components/Icons.tsx";

interface EditItemModalProps {
  resource: string;
  item: Record<string, any>;
  fields: string[];
  onSuccess?: () => void;
}

export function EditItemModal(
  { resource, item, fields, onSuccess }: EditItemModalProps,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({ ...item });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/${resource}/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setIsOpen(false);
      
      // Aseguramos que el callback onSuccess se ejecuta después de la operación exitosa
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload(); // Fallback si no hay callback
        }
      }, 100);
      
    } catch (err) {
      console.error(`Error updating ${resource}:`, err);
      setError(
        `No se pudo actualizar el ${resource}. Por favor, intente nuevamente.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Determinar si un campo es de tipo select
  const isSelectField = (field: string) => {
    return field === "role";
  };

  // Renderizar las opciones para el select de role
  const renderOptions = (field: string) => {
    if (field === "role") {
      return (
        <>
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="CLIENT">CLIENT</option>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        class="p-1 hover:bg-gray-200 rounded-full"
      >
        <EditIcon />
      </button>

      {isOpen && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-gray-100 rounded-2xl p-6 w-80">
            <h2 class="text-xl font-semibold text-navy mb-4">
              Edit {resource.slice(0, -1)}
            </h2>

            {error && (
              <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} class="space-y-3">
              {fields.map((field) => (
                <div key={field} class="mb-4">
                  <label class="block text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {isSelectField(field) ? (
                    <select
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleInput}
                      class="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      {renderOptions(field)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={formData[field] || ""}
                      onInput={handleInput}
                      class="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  )}
                </div>
              ))}

              <div class="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  class="px-4 py-2 border border-gray-300 rounded"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-navy text-white rounded flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                      Saving...
                    </>
                  ) : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}