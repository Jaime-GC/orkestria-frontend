import { useState } from "preact/hooks";
import { BoxNode } from "../BoxTree.tsx";
import EditNodeModal from "./EditNodeModal.tsx";
import DeleteNodeModal from "./DeleteNodeModal.tsx";
import CreateNodeModal from "./CreateNodeModal.tsx";

export interface OptionsButtonProps {
  node: BoxNode;
  onNodeUpdated?: (updatedNode: BoxNode) => void;
  onNodeDeleted?: (nodeId: number) => void;
  onNodeCreated?: (newNode: Omit<BoxNode, "id">, parentId: number) => void;
  canHaveChildren?: boolean;
}

export default function OptionsButton({ 
  node, 
  onNodeUpdated, 
  onNodeDeleted,
  onNodeCreated,
  canHaveChildren = true
}: OptionsButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSaveEdit = (updatedNode: BoxNode) => {
    setIsEditModalOpen(false);
    if (onNodeUpdated) {
      onNodeUpdated(updatedNode);
    } else {
      console.log('Guardando cambios:', updatedNode);
      alert(`Cambios guardados para el elemento ${updatedNode.id} (simulado)`);
      // Forzamos recarga si no hay callback
      window.location.reload();
    }
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    if (onNodeDeleted) {
      onNodeDeleted(node.id);
    } else {
      console.log(`Eliminando elemento con ID: ${node.id}`);
      alert(`Elemento ${node.id} eliminado (simulado)`);
      // Forzamos recarga si no hay callback
      window.location.reload();
    }
  };
  
  const handleSaveNewNode = (newNode: Omit<BoxNode, "id">) => {
    setIsCreateModalOpen(false);
    if (onNodeCreated) {
      onNodeCreated(newNode, node.id);
    } else {
      console.log('Creando nuevo nodo hijo:', newNode);
      alert(`Nuevo nodo creado como hijo de ${node.id} (simulado)`);
      // Forzamos recarga si no hay callback
      window.location.reload();
    }
  };

  return (
    <>
      <div class="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          class="text-gray-600 hover:text-navy focus:outline-none p-1 rounded-full"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
        
        {isMenuOpen && (
          <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                setIsMenuOpen(false);
                setIsEditModalOpen(true);
              }}
            >
              Editar
            </button>
            
            {canHaveChildren && (
              <button 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsCreateModalOpen(true);
                }}
              >
                Añadir subgrupo
              </button>
            )}
            
            <button 
              class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                setIsMenuOpen(false);
                setIsDeleteModalOpen(true);
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <EditNodeModal 
        node={node}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      <DeleteNodeModal
        node={node}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      
      {canHaveChildren && (
        <CreateNodeModal
          parentNode={node}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveNewNode}
        />
      )}
    </>
  );
}
