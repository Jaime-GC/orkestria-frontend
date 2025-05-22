"use client";
import { useEffect, useState } from "preact/hooks";

interface User {
  id: number;
  username: string;
  // ...otros campos...
}

interface ResourceSelectProps {
  selected?: string;
  onSelect: (value: string) => void;
}

export default function ResourceSelect({ selected, onSelect }: ResourceSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    // Reemplazar esta URL con la ruta correcta o sustituir por datos estáticos si se desea.
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error al obtener usuarios:", err));
  }, []);
  return (
    <select value={selected} onChange={(e) => onSelect(e.currentTarget.value)}>
      <option value="">Selecciona un recurso</option>
      {users.map(u => (
        <option key={u.id} value={u.username}>{u.username}</option>
      ))}
    </select>
  );
}
