import { useState } from "preact/hooks";
import { EditIcon, DeleteIcon } from "../../components/Icons.tsx";
import EditNodeModal from "./EditNodeModal.tsx";
import DeleteNodeModal from "./DeleteNodeModal.tsx";
import CreateNodeModal from "./CreateNodeModal.tsx";
import { BoxNode } from "../../islands/BoxTree.tsx";

interface OptionsButtonProps {
  node: BoxNode;
  onNodeUpdated?: (updatedNode: BoxNode) => void;
  onNodeDeleted?: (id: string) => void;
  onNodeCreated?: (newNode: Omit<BoxNode, "id">, parentId: string) => void;
  canHaveChildren?: boolean; // Indica si este nodo puede tener hijos (ResourceGroup)
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

  const handleEdit = () => {
    setIsMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };
  
  const handleCreateChild = () => {
    setIsMenuOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleSaveEdit = (updatedNode: BoxNode) => {
    setIsEditModalOpen(false);
    if (onNodeUpdated) {
      onNodeUpdated(updatedNode);
    } else {
      console.log('Guardando cambios:', updatedNode);
      alert(`Cambios guardados para el elemento ${updatedNode.id} (simulado)`);
    }
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    if (onNodeDeleted) {
      onNodeDeleted(node.id);
    } else {
      console.log(`Eliminando elemento con ID: ${node.id}`);
      alert(`Elemento ${node.id} eliminado (simulado)`);
    }
  };
  
  const handleSaveNewNode = (newNode: Omit<BoxNode, "id">) => {
    setIsCreateModalOpen(false);
    if (onNodeCreated) {
      onNodeCreated(newNode, node.id);
    } else {
      console.log('Creando nuevo nodo hijo:', newNode);
      alert(`Nuevo nodo creado como hijo de ${node.id} (simulado)`);
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
          <>
            <div 
              class="fixed inset-0 z-10" 
              onClick={() => setIsMenuOpen(false)}
            ></div>
            <div class="absolute right-0 bottom-8 z-20 bg-white shadow-lg rounded-md py-1 min-w-28">
              <button 
                onClick={handleEdit}
                class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <EditIcon />
                <span class="ml-2">Editar</span>
              </button>
              
              {/* Opción para crear hijo (solo para nodos que pueden tener hijos) */}
              {canHaveChildren && (
                <button 
                  onClick={handleCreateChild}
                  class="w-full flex items-center px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="ml-2">Añadir recurso</span>
                </button>
              )}
              
              <button 
                onClick={handleDelete}
                class="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <DeleteIcon />
                <span class="ml-2">Eliminar</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
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
