import { h } from "preact";

export interface TreeItem {
  id: string;
  name: string;
  children?: TreeItem[];
}

export default function TreeView({ items }: { items: TreeItem[] }) {
  return (
    <ul class="pl-4 space-y-2">
      {items.map(item => (
        <li key={item.id}>
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 bg-navy rounded-full"></span>
            <span class="text-navy">{item.name}</span>
          </div>
          {item.children && <TreeView items={item.children} />}
        </li>
      ))}
    </ul>
  );
}
