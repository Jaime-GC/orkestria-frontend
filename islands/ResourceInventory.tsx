import { useState } from "preact/hooks";
import { BoxTree, BoxNode } from "./BoxTree.tsx";
import CreateNodeModal from "./Buttons/CreateNodeModal.tsx";
import type { ResourceGroup } from "../components/types.ts";

interface ResourceInventoryProps {
  initialItems: ResourceGroup[];
}

export default function ResourceInventory({ initialItems }: ResourceInventoryProps) {
  const [items, setItems] = useState<BoxNode[]>(initialItems.map(group => ({
    id: group.id.toString(),
    name: group.name,
    type: 'group',
    children: []
  })));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Handler para crear un nuevo nodo raíz
  const handleCreateRootNode = async (newNode: Omit<BoxNode, "id">) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Llamada a la API para crear un grupo de recursos
      const response = await fetch("http://localhost:8080/api/resource-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newNode.name,
          parentId: null
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      const nodeWithId: BoxNode = {
        ...newNode,
        id: responseData.id.toString(),
        type: 'group'
      };
      
      setItems([...items, nodeWithId]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error al crear grupo:', err);
      setError("No se pudo crear el grupo de recursos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler para actualizar un nodo existente
  const handleNodeUpdated = async (updatedNode: BoxNode) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Determinar si es un grupo o un ítem basado en el tipo
      const isGroup = updatedNode.type === 'group';
      const resourceType = isGroup ? 'resource-groups' : 'resource-items';
      
      const response = await fetch(`http://localhost:8080/api/${resourceType}/${updatedNode.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: updatedNode.name
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Actualizar el estado local
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
    } catch (err) {
      console.error('Error al actualizar nodo:', err);
      setError("No se pudo actualizar el recurso");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler para eliminar un nodo existente
  const handleNodeDeleted = async (nodeId: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Buscar el nodo para determinar su tipo
      const findNode = (nodes: BoxNode[], id: string): BoxNode | null => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };
      
      const node = findNode(items, nodeId);
      if (!node) throw new Error("Nodo no encontrado");
      
      const isGroup = node.type === 'group';
      const resourceType = isGroup ? 'resource-groups' : 'resource-items';
      
      const response = await fetch(`http://localhost:8080/api/${resourceType}/${nodeId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Actualizar el estado local
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
    } catch (err) {
      console.error('Error al eliminar nodo:', err);
      setError("No se pudo eliminar el recurso");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler para crear un nodo hijo
  const handleNodeCreated = async (newNode: Omit<BoxNode, "id">, parentId: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Determinar si estamos creando un grupo o un ítem
      const isGroup = newNode.type === 'group';
      let response;
      
      if (isGroup) {
        // Crear un nuevo grupo dentro de otro grupo
        response = await fetch('http://localhost:8080/api/resource-groups', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: newNode.name,
            parentId: parentId
          })
        });
      } else {
        // Crear un nuevo item dentro de un grupo
        response = await fetch('http://localhost:8080/api/resource-items', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: newNode.name,
            groupId: parentId
          })
        });
      }
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Actualizar el árbol
      const addChildToNode = (nodes: BoxNode[]): BoxNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [
                ...(node.children || []),
                { 
                  ...newNode as BoxNode, 
                  id: responseData.id.toString() 
                }
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
      
    } catch (err) {
      console.error('Error al crear recurso:', err);
      setError("No se pudo crear el recurso");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
      )}
      
      <div class="flex justify-between items-center mb-6">        
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
      
      <div class="bg-gray-100 rounded-xl p-6 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]">
        <BoxTree
          items={items}
          onNodeUpdated={handleNodeUpdated}
          onNodeDeleted={handleNodeDeleted}
          onNodeCreated={handleNodeCreated}
        />
      </div>
      
      {isLoading && (
        <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
        </div>
      )}
      
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
