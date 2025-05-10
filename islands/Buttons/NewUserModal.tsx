import { useState } from "preact/hooks";
import type { User } from "../../components/types.ts";
import { FunctionalComponent } from "preact/src/index.d.ts";

export interface NewUserModalProps {
    onSuccess?: () => void;
}

export const NewUserModal: FunctionalComponent<NewUserModalProps> = ({ onSuccess }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        name: "",
        email: "",
        username: "",
        role: "EMPLOYEE"
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setFormData({ ...formData, [target.name]: target.value });
    };

    async function handleSubmit(e: Event) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            setOpen(false);
            setFormData({
                name: "",
                email: "",
                username: "",
                role: "EMPLOYEE"
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error creating user:", err);
            setError("No se pudo crear el usuario. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
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
                New User
            </button>
            {open && (
                <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div class="bg-gray-100 rounded-2xl p-8 w-80 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">

                        <h2 class="text-xl font-semibold text-navy mb-4">Add User</h2>

                        <form onSubmit={handleSubmit} class="space-y-4">

                            <div>
                                <label class="block text-sm text-navy mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onInput={handleInput}
                                    required
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                                />
                            </div>

                            <div>
                                <label class="block text-sm text-navy mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onInput={handleInput}
                                    required
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring"
                                />
                            </div>

                            {error && (
                                <div class="text-red-500 text-sm mt-2">
                                    {error}
                                </div>
                            )}

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
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
};