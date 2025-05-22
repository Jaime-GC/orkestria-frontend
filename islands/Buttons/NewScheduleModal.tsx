import { useState } from "preact/hooks";
import { JSX } from "preact";
import type { Schedule } from "../../components/types.ts";

export interface NewScheduleModalProps {
  onSuccess?: () => void
}

export function NewScheduleModal({ onSuccess }: NewScheduleModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Schedule>>({
    username: "",
    title: "",
    startDateTime: "",
    endDateTime: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    if (e.target) {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [target.name]: target.value });
    }
  }

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:8080/api/employee-schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isRead: true })
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setOpen(false)
      setFormData({ username: "", title: "", startDateTime: "", endDateTime: "" })
      onSuccess ? onSuccess() : window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando evento")
    } finally {
      setLoading(false)
    }
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
        Nuevo Evento
      </button>

      {open && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-gray-100 rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-navy">Crear Evento</h2>
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
                <label class="block mb-1">Empleado</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInput}
                  required
                  class="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label class="block mb-1">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInput}
                  required
                  class="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label class="block mb-1">Inicio</label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInput}
                  required
                  class="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label class="block mb-1">Fin</label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleInput}
                  required
                  class="w-full border px-2 py-1 rounded"
                />
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
