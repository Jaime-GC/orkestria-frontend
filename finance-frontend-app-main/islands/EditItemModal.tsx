import { useState } from "preact/hooks";
import { updateResource } from "../components/api.ts";
import { EditIcon } from "../components/Icons.tsx";

interface EditItemModalProps<T> {
  resource: string;
  item: T & { id: number };
  fields: (keyof T)[];
  onSuccess?: () => void;
}

export const EditItemModal = <T extends {}>(
  { resource, item, fields, onSuccess }: EditItemModalProps<T>,
) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...item } as any);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    await updateResource(resource, item.id, form);
    setOpen(false);
    if (onSuccess) onSuccess();
    else window.location.reload();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} class="p-1 hover:bg-gray-200 rounded-full">
        <EditIcon/>
      </button>
      {open && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-gray-100 rounded-2xl p-6 w-80">
            <h2 class="text-xl font-semibold text-navy mb-4">Edit {resource}</h2>

            <form onSubmit={handleSubmit} class="space-y-3">
              {fields.map((key) => (
                <div>
                  <label class="block text-sm mb-1">{String(key)}</label>
                  <input
                    type="text"
                    value={form[key]}
                    onInput={(e: any) => setForm({ ...form, [key]: e.target.value })}
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
              ))}

              <div class="flex justify-end space-x-2">
                <button type="button" onClick={() => setOpen(false)} class="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
                <button type="submit" class="px-4 py-2 bg-navy text-white rounded">
                  Save
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}
    </>
  );
};