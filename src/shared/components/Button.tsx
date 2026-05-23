import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  pressableDanger,
  pressableGhost,
  pressableGrapefruit,
  pressablePrimary,
  pressableSecondary,
} from "../styles/interactive";

type ButtonVariant = "primary" | "grapefruit" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: pressablePrimary,
  grapefruit: pressableGrapefruit,
  secondary: pressableSecondary,
  ghost: pressableGhost,
  danger: pressableDanger,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm rounded-xl",
  md: "min-h-[48px] px-5 text-base rounded-2xl",
  lg: "min-h-[52px] px-6 text-base rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className = "",
  children,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex cursor-pointer items-center justify-center gap-2 font-extrabold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
