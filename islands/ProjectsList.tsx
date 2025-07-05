import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import type { Project } from "../components/types.ts";
import { EditItemModal } from "./Buttons/EditItemModal.tsx";
import { DeleteButton } from "./Buttons/DeleteButton.tsx";
import { API } from "../lib/api.ts";

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`${API}/api/projects`);
        console.log("Projects fetched:", response);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("No se pudieron cargar los proyectos. Por favor, intente nuevamente.");
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  if (loading) return <div class="text-center py-8">Cargando proyectos...</div>;
  if (error) return <div class="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>;

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.length === 0 ? (
        <div class="col-span-full text-center text-gray-500 py-8">
          No hay proyectos disponibles.
        </div>
      ) : (
        projects.map(project => (
          <div
            key={project.id}
            class="bg-white rounded-xl p-6 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]
                   hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]
                   transition-all cursor-pointer"
          >


            <a href={`/projects/${project.id}`} class="text-navy">
            <h3 class="text-xl font-bold text-navy mb-2">{project.name}</h3>
            {project.description && (
              <p class="text-gray-600 mb-4">{project.description}</p>
            )}
            
            {/* Mostrar el estado del proyecto si está disponible */}
            {project.status && (
              <div class="flex items-center mb-2">
                <span class="text-sm font-medium mr-2">Estado:</span>
                <span 
                  class={`text-sm px-2 py-1 rounded-md ${
                    project.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'COMPLETE' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status === 'PLANNED' ? 'Planificado' :
                   project.status === 'IN_PROGRESS' ? 'En progreso' :
                   project.status === 'COMPLETE' ? 'Completado' :
                   project.status}
                </span>
              </div>
            )}
            
            {/* Mostrar la fecha de inicio si está disponible */}
            {project.startDate && (
              <div class="flex items-center mb-3">
                <span class="text-sm font-medium mr-2">Fecha de inicio:</span>
                <span class="text-sm text-gray-600">
                  {new Date(project.startDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
            </a>
            
            <div class="flex justify-end items-center mt-4 space-x-2">
              <EditItemModal
                resource="projects"
                item={project}
                fields={["name", "description", "startDate", "status"]}
                onSuccess={() => window.location.reload()}
              />
              <DeleteButton
                resource="projects"
                id={project.id}
                onSuccess={() => window.location.reload()}
              />
              
              
            </div>

            
          </div>
        ))
      )}
    </div>
  );
}
