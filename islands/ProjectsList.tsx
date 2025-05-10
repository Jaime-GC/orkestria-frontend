import { useState, useEffect } from "preact/hooks";
import type { Project } from "../components/types.ts";

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://localhost:8080/api/projects");
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
          <div key={project.id} class="bg-white rounded-xl p-6 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]">
            <h3 class="text-xl font-bold text-navy mb-2">{project.name}</h3>
            {project.description && (
              <p class="text-gray-600 mb-4">{project.description}</p>
            )}
            <div class="flex justify-between mt-4">
              <a href={`/projects/${project.id}`} class="text-navy hover:underline">Ver detalles</a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
