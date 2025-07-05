import { useState } from "preact/hooks";
import { API } from "../../lib/api.ts";
import type { User } from "../../components/types.ts";

export interface NewUserModalProps {
    onSuccess?: () => void;
}

export function NewUserModal({ onSuccess }: NewUserModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        username: "",
        email: "",
        role: "EMPLOYEE"
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData({ ...formData, [target.name]: target.value });
    };

    async function handleSubmit(e: Event) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API}/api/users`, {
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
                username: "",
                email: "",
                role: "EMPLOYEE"
            });
            
            // Aseguramos que el callback onSuccess se ejecuta después de la operación exitosa
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    window.location.reload(); // Fallback si no hay callback
                }
            }, 100);
            
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
                class="bg-gray-100 rounded-xl px-4 py-2 text-navy font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] flex items-center gap-2 transition-all"
            >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Usuario
            </button>

            {open && (
                <div class="modal-fixed">
                    <div class="modal-container">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-semibold text-navy">Nuevo Usuario</h2>
                            <button 
                                onClick={() => setOpen(false)}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div class="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div class="mb-4">
                                <label class="block text-navy text-sm font-medium mb-2" for="username">
                                    Nombre de usuario
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onInput={handleInput}
                                    required
                                    class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                                />
                            </div>
                            <div class="mb-4">
                                <label class="block text-navy text-sm font-medium mb-2" for="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onInput={handleInput}
                                    required
                                    class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                                />
                            </div>
                            <div class="mb-4">
                                <label class="block text-navy text-sm font-medium mb-2" for="role">
                                    Rol
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInput}
                                    class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                                >
                                    <option value="EMPLOYEE">Empleado</option>
                                    <option value="CLIENT">Cliente</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    class="bg-gray-100 rounded-xl px-4 py-2 text-navy font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    class="bg-navy rounded-xl px-4 py-2 text-white font-medium shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:bg-opacity-90 transition-all flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                                            Guardando...
                                        </>
                                    ) : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}