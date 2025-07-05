import { useState, useEffect } from "preact/hooks";
import { BoxNode } from "../../islands/BoxTree.tsx";

interface CreateNodeModalProps {
    parentNode?: BoxNode | null; // null/undefined for root nodes
    isOpen: boolean; // Determines if the modal is open or closed
    onClose: () => void; // Callback to close the modal
    onSave: (newNode: Omit<BoxNode, "id">, parentId?: string) => void; // Callback to save the new node
    isResourceGroup?: boolean; // Defines if the created node will be a group (can have children) or an item
}

export default function CreateNodeModal({parentNode, isOpen, onClose, onSave, isResourceGroup = true}: CreateNodeModalProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset the name input field whenever the modal is opened
    useEffect(() => {
        if (isOpen) {
            setName("");
        }
    }, [isOpen]);

    // If the modal is not open, render nothing
    if (!isOpen) return null;

    // Handle form submission to create a new node
    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (!name.trim()) throw new Error("El nombre no puede estar vacío.");
            // Only call the callback with the minimum data
            onSave({ name }, parentNode?.id);
            onClose();
        } catch (err) {
            console.error("Error creando el nodo:", err);
            setError(err instanceof Error ? err.message : "No se pudo crear.");
        } finally {
            setLoading(false);
        }
    };

    // Determine the modal title based on whether it's a group or item and if it has a parent
    let modalTitle = "";
    if (parentNode) {
        modalTitle = `Crear ${isResourceGroup ? 'grupo' : 'item'} en "${parentNode.name}"`;
    } else {
        modalTitle = `Crear ${isResourceGroup ? 'grupo raíz' : 'item raíz'}`;
    }

    return (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-gray-100 rounded-2xl p-6 w-96 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
                {/* Modal title */}
                <h2 class="text-xl font-semibold text-navy mb-4">{modalTitle}</h2>
                
                {/* Error message */}
                {error && <div class="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                
                {/* Form to create a new node */}
                <form onSubmit={handleSubmit} class="space-y-4">
                    <div>
                        {/* Input field for the node name */}
                        <label class="block text-sm text-navy mb-1">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onInput={(e) => setName((e.target as HTMLInputElement).value)} // Update name state on input
                            required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                            placeholder="Nombre del recurso"
                        />
                    </div>
                    
                    {/* Action buttons */}
                    <div class="flex justify-end space-x-2">
                        {/* Cancel button */}
                        <button
                            type="button"
                            onClick={onClose} // Close the modal
                            class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        
                        {/* Submit button */}
                        <button
                            type="submit"
                            class="px-4 py-2 rounded-lg bg-navy text-white hover:bg-blue-900 transition"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
