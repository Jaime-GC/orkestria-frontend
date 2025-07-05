import { useState } from "preact/hooks";
import { API } from "../../lib/api.ts";
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
        `${API}/api/${resource}/${item.id}`,
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
    return field === "role" || field === "status" || field === "priority" || field === "type";
  };

  // Renderizar las opciones para los campos select
  const renderOptions = (field: string) => {
    if (field === "role") {
      return (
        <>
          <option value="EMPLOYEE">Empleado</option>
          <option value="CLIENT">Cliente</option>
        </>
      );
    }
    
    if (field === "status") {
      // Verificar si estamos editando un proyecto o una tarea basándonos en el recurso
      if (resource === "projects") {
        return (
          <>
            <option value="PLANNED">Planificado</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="COMPLETE">Completado</option>
          </>
        );
      } else {
        // Estados para tareas
        return (
          <>
            <option value="TODO">Por hacer</option>
            <option value="DOING">En progreso</option>
            <option value="BLOCKED">Bloqueada</option>
            <option value="DONE">Hecha</option>
          </>
        );
      }
    }
    
    if (field === "priority") {
      return (
        <>
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
        </>
      );
    }
    
    if (field === "type") {
      return (
        <>
          <option value="URGENT">Urgente</option>
          <option value="RECURRING">Recurrente</option>
          <option value="OTHER">Otro</option>
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
        <div class="modal-fixed">
          <div class="modal-container">
            <h2 class="text-left text-xl font-semibold text-navy mb-4">
              Editar {resource.slice(0, -1)}
            </h2>

            {error && (
              <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} class="space-y-3">
              {fields.map((field) => (
                <div key={field} class="mb-4">
                  <label class="block text-left text-navy text-sm font-medium mb-2">

                    {field === "status" ? "Estado" :
                     field === "priority" ? "Prioridad" :
                     field === "type" ? "Tipo" :
                     field === "username" ? "Nombre de usuario" :
                     field === "email" ? "Email" :
                     field === "role" ? "Rol" :
                     field === "name" ? "Nombre" :
                     field === "title" ? "Título" :
                     field === "startDateTime" ? "Fecha de inicio" :
                     field === "endDateTime" ? "Fecha de fin" :
                     field === "resourceGroup" ? "Grupo de recursos" :
                     field === "description" ? "Descripción" :
                     field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {isSelectField(field) ? (
                    <select
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleInput}
                      class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                    >
                      {renderOptions(field)}
                    </select>
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field] || ""}
                      onInput={handleInput}
                      class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                    />
                  )}
                </div>
              ))}

              <div class="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  class="bg-gray-100 rounded-xl px-4 py-2 text-navy font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] transition-all"
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="bg-navy rounded-xl px-4 py-2 text-white font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:bg-opacity-90 transition-all flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
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