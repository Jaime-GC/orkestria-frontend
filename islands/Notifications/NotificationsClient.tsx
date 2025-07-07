"use client";
import { useEffect, useState } from "preact/hooks";

interface NotificationEvent {
  title: string;
  end: string;
  // ...other fields if needed...
}

export default function NotificationsClient() {
  const [pending, setPending] = useState<NotificationEvent[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("notif:event:")
    );
    const notifs: NotificationEvent[] = [];
    keys.forEach((key) => {
      try {
        const data: NotificationEvent = JSON.parse(localStorage.getItem(key)!);
        // Only include notification if it hasn't expired yet
        if (new Date(data.end).getTime() > Date.now()) {
          notifs.push(data);
        }
      } catch {
        // Ignore parsing errors
      }
    });
    setPending(notifs);
  }, []);

  return (
    <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
      {pending.length === 0 ? (
        <p class="text-gray-700">No hay notificaciones pendientes.</p>
      ) : (
        pending.map((notif, i) => (
          <div key={i} class="border p-4 rounded mb-4">
            <h2 class="text-lg font-bold">{notif.title}</h2>
            <p class="text-sm text-gray-600">
              Finaliza a {new Date(notif.end).toLocaleTimeString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
