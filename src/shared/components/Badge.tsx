import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "green" | "grapefruit" | "blue" | "yellow" | "slate" | "red";
}

const toneClasses = {
  green: "bg-correct text-green-dark",
  grapefruit: "bg-grapefruit-light text-grapefruit",
  blue: "bg-selected-bg text-selected",
  yellow: "bg-[#fff3bf] text-[#9a7600]",
  slate: "bg-page text-text-secondary",
  red: "bg-wrong-feedback text-wrong",
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
