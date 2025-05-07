import { DashboardIcon, ExpensesIcon, IncomesIcon, CategoriesIcon, ReportsIcon, UsersIcon } from "../components/Icons.tsx";
import { useEffect, useState } from "preact/hooks";

const iconMap = {
  DashboardIcon,
  ExpensesIcon,
  IncomesIcon,
  CategoriesIcon,
  ReportsIcon,
  UsersIcon,
};

export default function Sidebar() {
  const [currentPath, setCurrentPath] = useState("");
  
  // Detectar la ruta actual cuando el componente se monta
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  
  const menuItems = [
    { href: "/", label: "Dashboard", icon: "DashboardIcon" },
    { href: "/expenses", label: "Expenses", icon: "ExpensesIcon" },
    { href: "/incomes", label: "Incomes", icon: "IncomesIcon" },
    { href: "/categories", label: "Categories", icon: "CategoriesIcon" },
    { href: "/reports", label: "Reports", icon: "ReportsIcon" },
    { href: "/users", label: "Users", icon: "UsersIcon" },
  ];

  return (
    <aside class="flex flex-col justify-start w-64 min-h-screen bg-gray-100 px-6 py-8 rounded-tr-3xl rounded-br-3xl shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff]">
      <nav class="flex flex-col gap-4">
        {menuItems.map(({ href, label, icon }) => {
          const IconComponent = iconMap[icon as keyof typeof iconMap];
          
          const isActive = (href === "/" && currentPath === "/") || 
                          (href !== "/" && currentPath.startsWith(href));
          
          return (
            <a
              key={href}
              href={href}
              class={
                `flex items-center gap-3 bg-gray-100 rounded-xl px-5 py-3 text-navy font-medium text-lg transition-all
                     
                ${isActive 
                       ? "shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] bg-gray-200" 
                       : "shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]"
                      }`}
            >
              <IconComponent/>
              {label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
