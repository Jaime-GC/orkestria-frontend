// components/Card.tsx
import { h } from "preact";

export interface CardProps {
  class?: string;
  children: h.JSX.Element;
}

export function Card({ class: _class = "", children }: CardProps) {
  return (
    <div class={`bg-gray-100 rounded-xl shadow-inner p-6 neumorphic ${_class}`}>
      {children}
    </div>
  );
}
