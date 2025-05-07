import { useState } from "preact/hooks";
import { FunctionalComponent } from "preact";
import axios from "npm:axios";

export interface NewItemModalProps {
  /** nombre del recurso REST: "expenses" | "incomes" | ... */
  resource: string;
  /** título singular: "Expense" | "Income" | ... */
  label: string;
  /** callback tras crear el registro (p. ej. recargar la lista) */
  onSuccess?: () => void;
}

export const NewButton: FunctionalComponent<NewItemModalProps> = ({
  resource,
  label,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const url = `http://localhost:8080/${resource}/create/${userId}/${category}`;
    try {
      await axios.post(url, {
        description,
        amount: Number(amount),
        date,
      });
      setOpen(false);
      if (onSuccess) onSuccess();
      else window.location.reload();
    } catch (err) {
      console.error(`Error creating ${resource}:`, err);
      alert(`Fallo al crear ${label}: ${err}`);
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
        New {label}
      </button>

      {open && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-gray-100 rounded-2xl p-8 w-96 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
            <h2 class="text-xl font-semibold text-navy mb-4">Add {label}</h2>
            
            <form onSubmit={handleSubmit} class="space-y-4">
              
              <div>
                <label class="block text-sm text-navy mb-1">User ID</label>
                <input
                  type="number"
                  value={userId}
                  onInput={(e) => setUserId(e.currentTarget.value)}
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                />
              </div>
              
              <div>
                <label class="block text-sm text-navy mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onInput={(e) => setCategory(e.currentTarget.value)}
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                />
              </div>
              
              <div>
                <label class="block text-sm text-navy mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onInput={(e) => setDescription(e.currentTarget.value)}
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                />
              </div>
              
              <div>
                <label class="block text-sm text-navy mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onInput={(e) => setAmount(e.currentTarget.value)}
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                />
              </div>
              
              <div>
                <label class="block text-sm text-navy mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onInput={(e) => setDate(e.currentTarget.value)}
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                />
              </div>
              
              <div class="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
                >Cancel</button>
                
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-navy text-white hover:bg-blue-900 transition"
                >Save</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

