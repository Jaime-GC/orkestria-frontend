import { h } from "preact";
import useNotificationScheduler from "../../hooks/useNotificationScheduler.ts";

export default function NotificationSchedulerIsland() {
  useNotificationScheduler();
  return null; 
}