// lib/api.ts
export const API = typeof window === "undefined"
  // en SSR: usa localhost para desarrollo local, backend para Docker
  ? Deno.env.get("API_URL") ?? "http://localhost:8080"
  // en cliente: el script que inyectamos asigna window.API_URL
  : (window as { API_URL?: string }).API_URL ?? "http://localhost:8080";
