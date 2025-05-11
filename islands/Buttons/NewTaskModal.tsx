import { useState } from "preact/hooks";
import type { Task } from "../../components/types.ts";

export interface NewTaskModalProps {
    projectId: string;
    onSuccess?: () => void;
}

export function NewTaskModal({ projectId, onSuccess }: NewTaskModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Task>>({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        type: "OTHER",
        projectId: projectId
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
            const response = await fetch(`http://localhost:8080/api/projects/${projectId}/tasks`, {
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
                title: "",
                description: "",
                status: "todo"
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error creating task:", err);
            setError("No se pudo crear la tarea. Por favor, intente nuevamente.");
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
                Nueva Tarea
            </button>

            {open && (
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-gray-100 rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] p-6 w-full max-w-md">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-semibold text-navy">Nueva Tarea</h2>
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
                                <label class="block text-navy text-sm font-medium mb-2" for="title">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onInput={handleInput}
                                    required
                                    class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                                />
                            </div>
                            <div class="mb-4">
                                <label class="block text-navy text-sm font-medium mb-2" for="description">
                                    Descripción
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onInput={handleInput}
                                    class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                                    rows={3}
                                />
                            </div>
                            <div class="mb-4">
                                <label class="block text-navy text-sm font-medium mb-2" for="status">
                                    Estado
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInput}
                                    class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="DOING">In Progress</option>
                                    <option value="BLOCKED">Blocked</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label class="block text-navy text-sm font-medium mb-2" for="priority">
                                    Prioridad
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInput}
                                    class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                                >
                                    <option value="LOW">Baja</option>
                                    <option value="MEDIUM">Media</option>
                                    <option value="HIGH">Alta</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label class="block text-navy text-sm font-medium mb-2" for="type">
                                    Tipo
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInput}
                                    class="w-full bg-gray-200 rounded-lg px-4 py-2 border-2 border-transparent focus:border-navy focus:outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                                >
                                    <option value="URGENT">Urgente</option>
                                    <option value="RECURRING">Recurrente</option>
                                    <option value="OTHER">Otro</option>
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
