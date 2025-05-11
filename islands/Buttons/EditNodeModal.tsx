import { useState, useEffect } from "preact/hooks";
import { BoxNode } from "../BoxTree.tsx";

interface EditNodeModalProps {
  node: BoxNode;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedNode: BoxNode) => void;
}

export default function EditNodeModal({ node, isOpen, onClose, onSave }: EditNodeModalProps) {
  const [name, setName] = useState(node.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when node changes
  useEffect(() => {
    setName(node.name);
  }, [node]);

  // Close modal and reset error on close
  const handleClose = () => {
    onClose();
    setError(null);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isGroup = node.type === "group";
      const endpoint = isGroup
        ? "/api/resource-groups"
        : "/api/resource-items";
      const url = `http://localhost:8080/api/resource-groups/${node.id}`;
      const payload = {
        name,
        parentId: node.parentId,
        type: isGroup ? "group" : "item"
      };

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Backend update response:", res.status, await res.clone().json());
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Error ${res.status}`);
      }

      onSave({ ...node, name, type: payload.type });
      handleClose();
    } catch (err) {
      console.error("Error updating node:", err);
      setError(err instanceof Error ? err.message : "No se pudo actualizar el recurso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-100 rounded-2xl p-8 w-96 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
        <h2 class="text-xl font-semibold text-navy mb-4">Editar Elemento</h2>
        
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm text-navy mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
            />
          </div>

          {error && <div class="text-red-500 text-sm">{error}</div>}

          <div class="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              class={`px-4 py-2 rounded-lg transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-navy text-white hover:bg-blue-900"}`}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
