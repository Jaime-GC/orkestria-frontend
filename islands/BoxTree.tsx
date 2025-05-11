import { h } from "preact";
import OptionsButton from "./Buttons/OptionsButton.tsx";

// Define the node structure for the box tree
export interface BoxNode {
  id: string;
  name: string;
  children?: BoxNode[];
  type?: 'group' | 'item'; // Opcional: distinguir entre grupos (pueden tener hijos) e ítems
}

interface BoxTreeProps {
  items: BoxNode[];
  level?: number;
  gridCols?: number;
  onNodeUpdated?: (updatedNode: BoxNode) => void;
  onNodeDeleted?: (id: string) => void;
  onNodeCreated?: (newNode: Omit<BoxNode, "id">, parentId: string) => void;
}

export function BoxTree({ 
  items, 
  level = 0, 
  gridCols = 3,
  onNodeUpdated,
  onNodeDeleted,
  onNodeCreated 
}: BoxTreeProps) {
  // Calculate grid columns based on nesting level
  const cols = Math.max(1, gridCols - level);
  
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 ${
    cols > 2 ? `lg:grid-cols-${cols}` : ""
  } gap-4`;

  return (
    <div class={`${gridClass} ${level > 0 ? 'ml-6 mt-3 border-l-2 border-gray-200 pl-3' : ''}`}>
      {items.map(item => {
        // Determine if this node can have children (by default, all nodes can unless type is explicitly 'item')
        let canHaveChildren;
        if (!item.type || item.type === 'group') {
          canHaveChildren = true;
        } else {
          canHaveChildren = false;
        }
        
        return (
          <div 
            key={item.id} 
            class="bg-gray-100 rounded-xl p-4 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] transition-all hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-navy font-medium text-lg">{item.name}</h3>
              <OptionsButton 
                node={item}
                onNodeUpdated={onNodeUpdated}
                onNodeDeleted={onNodeDeleted}
                onNodeCreated={onNodeCreated}
                canHaveChildren={canHaveChildren}
              />
            </div>
            
            {item.children && item.children.length > 0 && (
              <div class="mt-3">
                <BoxTree 
                  items={item.children} 
                  level={level + 1} 
                  gridCols={gridCols}
                  onNodeUpdated={onNodeUpdated}
                  onNodeDeleted={onNodeDeleted}
                  onNodeCreated={onNodeCreated}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
