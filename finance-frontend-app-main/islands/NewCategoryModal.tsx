import { useState } from "preact/hooks";
import { FunctionalComponent } from "preact";
import axios from "npm:axios";

export interface NewCategoryModalProps {
  onSuccess?: () => void;
}

export const NewCategoryModal: FunctionalComponent<NewCategoryModalProps> = ({onSuccess}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/categories/create", { name });
      setOpen(false);
      onSuccess ? onSuccess() : window.location.reload();
    } catch (err) {
      console.error("Error creating category:", err);
      alert(`Fallo al crear categoría: ${err}`);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        class="bg-gray-100 rounded-xl px-5 py-3 text-navy font-medium text-lg transition-all
               shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]
               hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
      >
        New Category
      </button>
      {open && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-gray-100 rounded-2xl p-8 w-80 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">

            <h2 class="text-xl font-semibold text-navy mb-4">Add Category</h2>

            <form onSubmit={handleSubmit} class="space-y-4">

              <div>
                <label class="block text-sm text-navy mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onInput={(e) => setName(e.currentTarget.value)}
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                />
              </div>

              <div class="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
                >Cancel
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-navy text-white hover:bg-blue-900 transition"
                >Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};