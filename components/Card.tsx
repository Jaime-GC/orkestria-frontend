// components/Card.tsx
import { h } from "preact";

export interface CardProps {
  class?: string;
  children: h.JSX.Element;
}

export function Card({ class: _class = "", children }: CardProps) {
  return (
    <div class={`rounded-xl p-6 ${_class}`}>
      {children}
    </div>
  );
}
