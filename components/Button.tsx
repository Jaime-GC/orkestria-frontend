import { h } from "preact";

interface ButtonProps {
  children: h.JSX.Element;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      class={`bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]
              hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]
              px-6 py-4 text-xl font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}
