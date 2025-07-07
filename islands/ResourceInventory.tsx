import { useState, useEffect } from "preact/hooks";
import { BoxTree, BoxNode } from "./BoxTree.tsx";
import CreateNodeM    } catch (err) {
      console.error('Error updating node:', err);
      setError("No se pudo actualizar el nodo");
    } finally { from "./Buttons/CreateNodeModal.tsx";
import OptionsButton from "./Buttons/OptionsButton.tsx";
import { API } from "../lib/api.ts";

export default function ResourceInventory({ initialItems }: { initialItems: BoxNode[] }) {
  const [tree, setTree] = useState<BoxNode[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Build hierarchy
  useEffect(() => {
    const map = new Map<number, BoxNode>();
    initialItems.forEach(n => map.set(n.id, n));
    
    // Initialize children to empty array in each node so it doesn't accumulate duplicates
    map.forEach(node => {
      node.children = [];
    });

    const roots: BoxNode[] = [];

    // Build tree using parentId or parent?.id
    map.forEach(n => {
      const pid: number | undefined = n.parentId ?? (n as any).parent?.id;
      if (!pid) {
        roots.push(n);
      } else {
        const p = map.get(pid);
        if (p) p.children.push(n);
        else roots.push(n);
      }
    });

    setTree(roots);
  }, [initialItems]);

  // Handler to create a new root node
  const handleCreateRootNode = async (newNode: Omit<BoxNode, "id">) => {
    setIsLoading(true);
    setError("");
    
    try {
      // API call to create a resource group
      const response = await fetch(`${API}/api/resource-groups`, {
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
      
      setTree(prev => [...prev, nodeWithId]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating group:', err);
      setError("No se pudo crear el grupo de recursos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler to update an existing node
  const handleNodeUpdated = async (updatedNode: BoxNode) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Determine if it's a group or item based on type
      const isGroup = updatedNode.type === 'group';
      const resourceType = isGroup ? 'resource-groups' : 'resource-items';
      
      const response = await fetch(`${API}/api/resource-groups/${updatedNode.id}`, {
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
      
      // Update local state
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
      
      setTree(updateNodeInTree(tree));
    } catch (err) {
      console.error('Error updating node:', err);
      setError("No se pudo actualizar el recurso");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete node
  const handleNodeDeleted = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/resource-groups/${id}`, { method: "DELETE" });
      console.log("Delete response:", res.status);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const remove = (nodes: BoxNode[]): BoxNode[] =>
        nodes
          .filter(n => n.id !== id)
          .map(n => ({ ...n, children: remove(n.children) }));
      setTree(prev => remove(prev));
    } catch (err) {
      console.error("Error deleting node:", err);
    }
  };
  
  // Create child always in resource-groups
  const handleNodeCreated = async (
    newNodePayload: Omit<BoxNode, "id" | "children">,
    parentId: number
  ) => {
    try {
      const res = await fetch(`${API}/api/resource-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newNodePayload.name, parentId })
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const saved = await res.json();
      const nodeToAdd = { ...newNodePayload, id: saved.id, children: [] };
      setTree(prev => {
        const add = (nodes: BoxNode[]): BoxNode[] =>
          nodes.map(n => n.id === parentId
            ? { ...n, children: [...n.children, nodeToAdd] }
            : { ...n, children: add(n.children) }
          );
        return add(prev);
      });
    } catch (err) {
      console.error("Error adding node:", err);
    }
  };

  // Edit node locally
  const handleNodeEdited = (updated: BoxNode) => {
    const update = (nodes: BoxNode[]): BoxNode[] =>
      nodes.map(n =>
        n.id === updated.id
          ? { ...n, name: updated.name }
          : { ...n, children: update(n.children) }
      );
    setTree(prev => update(prev));
  };

  return (
    <>
      {error && (
        <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
      )}
      
      <div class="bg-gray-100 rounded-xl p-6 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]">
        <BoxTree
          items={tree}
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
      
      {/* Modal to create root node */}
      <CreateNodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRootNode}
        parentNode={null}
      />
    </>
  );
}

function TreeNode({
  node,
  onNodeCreated,
  onNodeDeleted,
}: {
  node: BoxNode;
  onNodeCreated: (n: Omit<BoxNode, "id" | "children">, p: number) => void;
  onNodeDeleted: (id: number) => void;
}) {
  return (
    <div class="ml-4">
      <div class="flex items-center">
        <span class="flex-1">{node.name}</span>
        <OptionsButton
          node={node}
          onNodeCreated={n => onNodeCreated(n, node.id)}
          onNodeDeleted={() => onNodeDeleted(node.id)}
          canHaveChildren={true}
        />
      </div>
      {node.children.length > 0 && (
        <div class="ml-4">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              onNodeCreated={onNodeCreated}
              onNodeDeleted={onNodeDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
