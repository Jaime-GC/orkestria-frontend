import { useEffect, useRef } from "preact/hooks";

export default function useNotificationScheduler() {
  const timers = useRef<number[]>([]);

  const scheduleAll = () => {
    // DEBUG: show in console which notifications are stored
    const notifKeys = Object.keys(localStorage).filter(k => k.startsWith("notif:event:"));
    console.log("🔍 localStorage entries for notifications:", 
      notifKeys.map(k => ({ key: k, value: JSON.parse(localStorage.getItem(k)!) }))
    );

    timers.current.forEach(t => clearTimeout(t));
    timers.current = [];
    Object.keys(localStorage)
      .filter(k => k.startsWith("notif:event:"))
      .forEach(k => {
        try {
          const { title, end } = JSON.parse(localStorage.getItem(k)!);
          const delay = new Date(end).getTime() - Date.now();
          if (Notification.permission === "granted" && delay > 0) {
            const id = window.setTimeout(
              () => new Notification(title, { body: `Ended at ${new Date(end).toLocaleTimeString()}` }),
              delay,
            );
            timers.current.push(id);
          }
        } catch {}
      });
  };

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    scheduleAll();
    const handler = () => scheduleAll();
    addEventListener("notif-changed", handler);
    return () => removeEventListener("notif-changed", handler);
  }, []);
}
