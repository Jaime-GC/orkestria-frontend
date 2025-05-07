export const API_BASE = "http://localhost:8080";

export async function deleteResource(resource: string, id: number) {
  const res = await fetch(`${API_BASE}/${resource}/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error deleting ${resource}/${id}`);
}

export async function updateResource(resource: string, id: number, body: unknown) {
  const res = await fetch(`${API_BASE}/${resource}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error updating ${resource}/${id}`);
}