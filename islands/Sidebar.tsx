import { DashboardIcon, IconBell, IconProjects, IconResources, IconUsers } from "../components/Icons.tsx";
import { useEffect, useState } from "preact/hooks";

const items = [
  { href: "/",        label: "Dashboard", icon: DashboardIcon },
  { href: "/projects", label: "Proyectos", icon: IconProjects },
  { href: "/users",    label: "Usuarios",  icon: IconUsers },
  { href: "/resources",label: "Recursos",  icon: IconResources },
  { href: "/notifications", label: "Notificaciones", icon: IconBell },
];

export default function Sidebar() {
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => { setCurrentPath(window.location.pathname); }, []);

  return (
    <aside class="flex flex-col justify-start w-64 min-h-screen bg-gray-100 px-6 py-8 rounded-tr-3xl rounded-br-3xl shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
      <h1 class="text-3xl font-bold text-navy mb-6 ml-8">Orkestria</h1>
      <nav class="flex flex-col gap-4">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = (href === "/" && currentPath === "/") || (href !== "/" && currentPath.startsWith(href));
          return (
            <a
              key={href}
              href={href}
              class={`flex items-center gap-3 w-full h-14 bg-gray-100 rounded-xl px-5 text-navy font-normal text-lg transition-all
              ${
                isActive
                ? "shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] bg-gray-200"
                : "shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
              }`}
            >
              <Icon class="w-5 h-5" />
              <span class="flex-1 text-left">{label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
