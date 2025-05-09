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
  
  // Reset form when node changes
  useEffect(() => {
    setName(node.name);
  }, [node]);

  if (!isOpen) return null;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSave({
      ...node,
      name,
    });
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

          <div class="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-navy text-white hover:bg-blue-900 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
