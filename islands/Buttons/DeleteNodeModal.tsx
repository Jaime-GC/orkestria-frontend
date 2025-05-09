import { BoxNode } from "../../islands/BoxTree.tsx";

interface DeleteNodeModalProps {
  node: BoxNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteNodeModal({ node, isOpen, onClose, onConfirm }: DeleteNodeModalProps) {
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-100 rounded-2xl p-8 w-96 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
        <h2 class="text-xl font-semibold text-navy mb-4">Confirmar eliminación</h2>
        
        <p class="mb-6">¿Está seguro de que desea eliminar <strong>{node.name}</strong>?</p>

        <div class="flex justify-end space-x-2">
          <button
            onClick={onClose}
            class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
