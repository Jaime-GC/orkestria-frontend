import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

interface NewReservationModalProps {
  onSuccess?: () => void;
}

export function NewReservationModal({ onSuccess }: NewReservationModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resourceGroups, setResourceGroups] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    resourceGroupId: "",
    title: "",
    startDateTime: "",
    endDateTime: "",
    reservedBy: "1"
  });

  // Fetch resource groups
  useEffect(() => {
    if (open) {
      fetch("http://localhost:8080/api/resource-groups")
        .then(response => response.json())
        .then(data => {
          setResourceGroups(data.filter((group: any) => group.isReservable));
        })
        .catch(err => {
          console.error("Error fetching resource groups:", err);
          setError("No se pudieron cargar los recursos. Por favor, intente nuevamente.");
        });
    }
  }, [open]);

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [target.name]: target.value
    });
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format dates as ISO strings to ensure consistency
      const payload = {
        ...formData,
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: new Date(formData.endDateTime).toISOString(),
      };
      
      const response = await fetch(`http://localhost:8080/api/resource-groups/${formData.resourceGroupId}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setOpen(false);
      resetForm();

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error creating reservation:", err);
      setError("No se pudo crear la reserva. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      resourceGroupId: "",
      title: "",
      startDateTime: "",
      endDateTime: "",
      reservedBy: "1"
    });
    setError(null);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        class="bg-gray-100 rounded-xl px-4 py-2 text-navy font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] flex items-center gap-2 transition-all"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Reserva
      </button>

      {open && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-gray-100 rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-navy">Crear Reserva</h2>
              <button 
                onClick={() => setOpen(false)}
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
            
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block mb-1 text-navy font-medium">Recurso</label>
                <select
                  name="resourceGroupId"
                  value={formData.resourceGroupId}
                  onChange={handleInput}
                  required
                  class="w-full bg-gray-100 border-none rounded-xl px-4 py-2 shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un recurso</option>
                  {resourceGroups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label class="block mb-1 text-navy font-medium">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInput}
                  required
                  class="w-full bg-gray-100 border-none rounded-xl px-4 py-2 shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block mb-1 text-navy font-medium">Fecha y hora de inicio</label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInput}
                  required
                  class="w-full bg-gray-100 border-none rounded-xl px-4 py-2 shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block mb-1 text-navy font-medium">Fecha y hora de fin</label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleInput}
                  required
                  class="w-full bg-gray-100 border-none rounded-xl px-4 py-2 shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  class="bg-gray-100 rounded-xl px-4 py-2 text-navy font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  class="bg-blue-600 rounded-xl px-4 py-2 text-white font-medium shadow-[3px_3px_6px_rgba(0,0,0,0.2)] hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
