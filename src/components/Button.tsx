import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold-400 text-navy-900 hover:bg-gold-500 shadow-md hover:shadow-lg",
  secondary:
    "bg-navy-700 text-white hover:bg-navy-800 shadow-md hover:shadow-lg",
  ghost: "text-navy-700 hover:text-gold-500 hover:bg-navy-50",
  outline:
    "border-2 border-white text-white hover:bg-white hover:text-navy-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
