import { useState } from "preact/hooks";
import { BoxTree, BoxNode } from "./BoxTree.tsx";
import CreateNodeModal from "./Buttons/CreateNodeModal.tsx";

interface ResourceInventoryProps {
  initialItems: BoxNode[];
}

export default function ResourceInventory({ initialItems }: ResourceInventoryProps) {
  const [items, setItems] = useState<BoxNode[]>(initialItems);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Función para generar un ID único simple
  const generateId = () => `resource_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Handler para crear un nodo raíz nuevo
  const handleCreateRootNode = (newNode: Omit<BoxNode, "id">) => {
    const nodeWithId: BoxNode = {
      ...newNode,
      id: generateId()
    };
    
    setItems([...items, nodeWithId]);
    setIsCreateModalOpen(false);
  };
  
  // Handler para actualizar un nodo existente
  const handleNodeUpdated = (updatedNode: BoxNode) => {
    // Función recursiva para actualizar un nodo en cualquier nivel del árbol
    const updateNodeInTree = (nodes: BoxNode[]): BoxNode[] => {
      return nodes.map(node => {
        if (node.id === updatedNode.id) {
          return updatedNode;
        }
        if (node.children) {
          return {
            ...node,
            children: updateNodeInTree(node.children)
          };
        }
        return node;
      });
    };
    
    setItems(updateNodeInTree(items));
  };
  
  // Handler para eliminar un nodo existente
  const handleNodeDeleted = (nodeId: string) => {
    // Función recursiva para eliminar un nodo en cualquier nivel del árbol
    const deleteNodeFromTree = (nodes: BoxNode[]): BoxNode[] => {
      return nodes
        .filter(node => node.id !== nodeId)
        .map(node => {
          if (node.children) {
            return {
              ...node,
              children: deleteNodeFromTree(node.children)
            };
          }
          return node;
        });
    };
    
    setItems(deleteNodeFromTree(items));
  };
  
  // Handler para crear un nodo hijo
  const handleNodeCreated = (newNode: Omit<BoxNode, "id">, parentId: string) => {
    // Función recursiva para agregar un hijo a un nodo específico
    const addChildToNode = (nodes: BoxNode[]): BoxNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...(node.children || []),
              { ...newNode, id: generateId() }
            ]
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addChildToNode(node.children)
          };
        }
        return node;
      });
    };
    
    setItems(addChildToNode(items));
  };

  return (
    <>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-navy">Inventario</h1>
        
        {/* Botón para crear nodo raíz */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          class="bg-gray-100 rounded-xl px-4 py-2 text-navy font-medium flex items-center gap-2 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] transition-all"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo grupo
        </button>
      </div>
      
      <BoxTree 
        items={items} 
        onNodeUpdated={handleNodeUpdated}
        onNodeDeleted={handleNodeDeleted}
        onNodeCreated={handleNodeCreated}
      />
      
      {/* Modal para crear nodo raíz */}
      <CreateNodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRootNode}
        parentNode={null}
      />
    </>
  );
}
