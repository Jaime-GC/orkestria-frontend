import { useState } from "preact/hooks";
import { JSX } from "preact";
import type { Reservation } from "../../components/types.ts";

export interface NewReservationModalProps {
  onSuccess?: () => void
}

export function NewReservationModal({ onSuccess }: NewReservationModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    groupId: "",
    startDateTime: "",
    endDateTime: "",
    reservedBy: ""
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
      const res = await fetch(
        `http://localhost:8080/api/resource-groups/${formData.groupId}/reservations`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }
      )
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setOpen(false)
      setFormData({ groupId: "", startDateTime: "", endDateTime: "", reservedBy: "" })
      onSuccess ? onSuccess() : window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando reserva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-100 rounded-xl px-4 py-2 text-green-700 font-medium shadow hover:bg-green-200 transition"
      >
        + Nueva Reserva
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Crear Reserva</h2>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Group ID</label>
                <input
                  type="number"
                  name="groupId"
                  value={formData.groupId}
                  onChange={handleInput}
                  required
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Inicio</label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInput}
                  required
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Fin</label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleInput}
                  required
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Reservado por (usuario)</label>
                <input
                  type="text"
                  name="reservedBy"
                  value={formData.reservedBy}
                  onChange={handleInput}
                  required
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
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
