export const EditIcon = () => (
  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

export const DeleteIcon = () => (
  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);



// Icons of Sidebar
import { h } from "preact";

export const DashboardIcon = () => (
    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
);

export function IconProjects(props: h.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 7h18M3 12h18M3 17h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function IconUsers(props: h.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export function IconResources(props: h.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 3h18v18H3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9 3v18M15 3v18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

export function IconBell(props: h.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}



// Icons of Resources
export function InventoryIcon(props: h.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 9h18M9 21V9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function ScheduleIcon(props: h.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function ReservationIcon(props: h.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Libro abierto */}
      <path d="M4 19.5V4.5a.5.5 0 0 1 .65-.48L12 6l7.35-1.98a.5.5 0 0 1 .65.48v15a.5.5 0 0 1-.65.48L12 18l-7.35 1.98a.5.5 0 0 1-.65-.48z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      {/* Páginas */}
      <line x1="12" y1="6" x2="12" y2="18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="7" y1="9" x2="17" y2="9" stroke-width="1" stroke-linecap="round"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke-width="1" stroke-linecap="round"/>
      <line x1="7" y1="15" x2="17" y2="15" stroke-width="1" stroke-linecap="round"/>
    </svg>
  );
}
