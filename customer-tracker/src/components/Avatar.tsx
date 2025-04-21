import React from "react";

// Generates a vibrant and visually distinct color based on a string (e.g., name or id)
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Vibrant HSL: variable hue, high saturation, mid-high lightness
  const hue = Math.abs(hash) % 360;
  const sat = 75 + (Math.abs(hash) % 20); // 75-95%
  const light = 45 + (Math.abs(hash) % 20); // 45-65%
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

// Optionally, generate a secondary color for border/shadow (darker shade)
function stringToBorderColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const sat = 70 + (Math.abs(hash) % 15); // 70-85%
  const light = 30 + (Math.abs(hash) % 15); // 30-45%
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

interface AvatarProps {
  name: string;
  size?: number; // px
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 40, className = "" }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  const bgColor = stringToColor(name || "?");
  const borderColor = stringToBorderColor(name || "?");
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: bgColor,
        color: "#fff",
        fontSize: size * 0.45,
        minWidth: size,
        minHeight: size,
        border: `2.5px solid ${borderColor}`,
        boxShadow: `0 2px 8px 0 ${borderColor}33`,
      }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </span>
  );
};

export default Avatar;
