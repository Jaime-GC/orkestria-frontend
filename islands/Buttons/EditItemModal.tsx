import { useState, useEffect } from "preact/hooks";
import { API } from "../../lib/api.ts";
import { EditIcon } from "../../components/Icons.tsx";
import type { User } from "../../components/types.ts";

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
  
  // Initialize formData with item data and handle assignedUser
  const initFormData = () => {
    const data = { ...item };
    // If it's a task and has assignedUser, convert it to userId for the form
    if (resource === "tasks" && item.assignedUser) {
      data.userId = item.assignedUser.id.toString();
      console.log("Initialized userId from assignedUser:", data.userId);
    } else if (resource === "tasks" && item.user) {
      // Fallback for compatibility
      data.userId = item.user.id.toString();
      console.log("Initialized userId from user:", data.userId);
    }
    console.log("EditItemModal initialized with data:", data);
    return data;
  };
  
  const [formData, setFormData] = useState<Record<string, any>>(initFormData());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Reinitialize formData when modal opens with a different item
  useEffect(() => {
    if (isOpen) {
      setFormData(initFormData());
    }
  }, [isOpen, item]);

  // Load users when modal opens and contains userId field
  useEffect(() => {
    if (isOpen && fields.includes("userId")) {
      fetchUsers();
    }
  }, [isOpen, fields]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}/api/users`);
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Prepare data for PUT request
      const updateData = { ...formData };
      
      // If it's a task, handle user assignment
      if (resource === "tasks") {
        if (updateData.userId && updateData.userId !== "") {
          // Assign user
          updateData.assignedUser = {
            id: parseInt(updateData.userId)
          };
        } else {
          // Explicitly unassign user
          updateData.assignedUser = null;
        }
        // Remove userId from body (not part of expected structure)
        delete updateData.userId;
      }

      console.log("Sending update data:", updateData);

      const response = await fetch(
        `${API}/api/${resource}/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Log for debugging
      const result = await response.json();
      console.log("Backend response after editing:", result);

      setIsOpen(false);
      
      // Wait a bit to ensure backend processed the update
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Ensure onSuccess callback executes after successful operation
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload(); // Fallback if no callback
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

  // Determine if a field is of select type
  const isSelectField = (field: string) => {
    return field === "role" || field === "status" || field === "priority" || field === "type" || field === "userId";
  };

  // Render options for select fields
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
      // Check if we're editing a project or task based on resource
      if (resource === "projects") {
        return (
          <>
            <option value="PLANNED">Planificado</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="COMPLETE">Completado</option>
          </>
        );
      } else {
        // Task statuses
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
    
    if (field === "userId") {
      return (
        <>
          <option value="">Sin asignar</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
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
                     field === "userId" ? "Usuario asignado" :
                     field === "startDate" ? "Fecha de inicio" :
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