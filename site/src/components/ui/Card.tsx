import { h } from "preact";

interface CardProps {
  children: preact.ComponentChildren;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      class={`card card-sm shadow-sm ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      {children}
    </div>
  );
}
