import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

interface NotificationToggleProps {
  eventId: string;
  title: string;
  end: string;
  type: "employee" | "reservation";
}

export default function NotificationToggle({ eventId, title, end, type }: NotificationToggleProps) {
  const key = `notif:event:${eventId}`;
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(!!localStorage.getItem(key));
  }, []);

  const toggle = async () => {
    if (!on) {
      if (Notification.permission === "default") await Notification.requestPermission();
      localStorage.setItem(key, JSON.stringify({ id: eventId, title, end, type }));
    } else {
      localStorage.removeItem(key);
    }
    setOn(!on);
    dispatchEvent(new CustomEvent("notif-changed"));
    console.log("🔔 NotificationToggle:", {
      key,
      stored: localStorage.getItem(key),
    });
  };

  return (
    <button onClick={toggle} title={on ? "Desactivar notificación" : "Activar notificación"}>
      {on ? "🔔" : "🔕"}
    </button>
  );
}
