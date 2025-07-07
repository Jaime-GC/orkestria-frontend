// lib/api.ts
export const API = typeof window === "undefined"
  // in SSR: use localhost for local development, backend for Docker
  ? Deno.env.get("API_URL") ?? "http://localhost:8080"
  // in client: the script we inject assigns window.API_URL
  : (window as { API_URL?: string }).API_URL ?? "http://localhost:8080";
