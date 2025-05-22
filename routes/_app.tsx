import { type PageProps } from "$fresh/server.ts";
import NotificationSchedulerIsland from "../islands/Notifications/NotificationSchedulerIsland.tsx";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Orkestria</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/calendar-custom.css" />
      </head>
      <body>
        <NotificationSchedulerIsland />
        <Component />
      </body>
    </html>
  );
}
