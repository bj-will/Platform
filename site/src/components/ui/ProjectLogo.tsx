import { h } from "preact";

interface ProjectLogoProps {
  projectSlug: string;
  size?: number; // default 40px
  className?: string;
  onClick?: () => void;
  style?: preact.JSX.CSSProperties; // custom styles override defaults
  position?: { top?: string; left?: string; right?: string; bottom?: string }; // optional absolute positioning
}


export default function ProjectLogo({
  projectSlug,
  size = 40,
  className = "",
  onClick,
  style = {},
  position,
}: ProjectLogoProps) {
  const positionStyle = position
    ? { position: "absolute", ...position }
    : {};

  return (
   <img
      src={`projects/logo/${projectSlug}_logo.png`}
      class={`rounded-circle border border-2 border-white ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        opacity: "0.9",
        cursor: onClick ? "pointer" : undefined,
        ...positionStyle,
        ...style,
      }}
      onClick={onClick}
    />
  );
}
