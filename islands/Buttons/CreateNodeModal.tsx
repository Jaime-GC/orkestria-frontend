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

    // Reset the name input field whenever the modal is opened
    useEffect(() => {
        if (isOpen) {
            setName("");
        }
    }, [isOpen]);

    // If the modal is not open, render nothing
    if (!isOpen) return null;

    // Handle form submission to create a new node
    const handleSubmit = (e: Event) => {
        e.preventDefault();
        const newNode = {
            name,
            ...(isResourceGroup ? { children: [] } : {}) // Add children property if it's a group
        };
        onSave(newNode, parentNode?.id); // Pass the new node and parent ID to the onSave callback
        setName(""); // Reset the name input field
    };

    // Determine the modal title based on whether it's a group or item and if it has a parent
    let modalTitle = "";
    if (parentNode) {
        modalTitle = `Create ${isResourceGroup ? 'group' : 'item'} in "${parentNode.name}"`;
    } else {
        modalTitle = `Create ${isResourceGroup ? 'root group' : 'root item'}`;
    }

    return (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-gray-100 rounded-2xl p-8 w-96 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
                {/* Modal title */}
                <h2 class="text-xl font-semibold text-navy mb-4">{modalTitle}</h2>
                
                {/* Form to create a new node */}
                <form onSubmit={handleSubmit} class="space-y-4">
                    <div>
                        {/* Input field for the node name */}
                        <label class="block text-sm text-navy mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onInput={(e) => setName((e.target as HTMLInputElement).value)} // Update name state on input
                            required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                            placeholder="Resource name"
                        />
                    </div>
                    
                    {/* Action buttons */}
                    <div class="flex justify-end space-x-2 mt-4">
                        {/* Cancel button */}
                        <button
                            type="button"
                            onClick={onClose} // Close the modal
                            class="px-4 py-2 rounded-lg bg-gray-200 text-navy hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        
                        {/* Submit button */}
                        <button
                            type="submit"
                            class="px-4 py-2 rounded-lg bg-navy text-white hover:bg-blue-900 transition"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
