import { useState, useEffect } from "preact/hooks";
import { BoxNode } from "../../islands/BoxTree.tsx";

interface CreateNodeModalProps {
  parentNode?: BoxNode | null; // null/undefined para nodos raíz
  isOpen: boolean;
  onClose: () => void;
  onSave: (newNode: Omit<BoxNode, "id">, parentId?: string) => void;
  isResourceGroup?: boolean; // define si el nodo creado será un grupo (puede tener hijos) o un ítem
}

export default function CreateNodeModal({ 
  parentNode, 
  isOpen, 
  onClose, 
  onSave,
  isResourceGroup = true
}: CreateNodeModalProps) {
  const [name, setName] = useState("");
  
  // Reinicia el formulario cuando se abre
  useEffect(() => {
    if (isOpen) {
      setName("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    const newNode = {
      name,
      // Los hijos solo se incluyen si es un grupo de recursos
      ...(isResourceGroup ? { children: [] } : {})
    };
    
    onSave(newNode, parentNode?.id);
    setName("");
  };

  const modalTitle = parentNode 
    ? `Crear ${isResourceGroup ? 'grupo' : 'ítem'} en "${parentNode.name}"`
    : `Crear ${isResourceGroup ? 'grupo' : 'ítem'} raíz`;

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-100 rounded-2xl p-8 w-96 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
        <h2 class="text-xl font-semibold text-navy mb-4">{modalTitle}</h2>
        
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm text-navy mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
              placeholder="Nombre del recurso"
            />
          </div>

          {/* Si implementamos más campos (como tipo) irían aquí */}
          
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
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
