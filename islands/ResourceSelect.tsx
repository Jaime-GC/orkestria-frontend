"use client";
import { useEffect, useState } from "preact/hooks";
import { API } from "../lib/api.ts";

interface User {
  id: number;
  username: string;
  // ...other fields...
}

interface ResourceSelectProps {
  selected?: string;
  onSelect: (value: string) => void;
}

export default function ResourceSelect({ selected, onSelect }: ResourceSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
   
    fetch(`${API}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error getting users:", err));
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
