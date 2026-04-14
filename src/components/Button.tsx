import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "outlineDark";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonOnlyProps = CommonProps & {
  href?: never;
  onClick?: () => void | Promise<void>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

type ButtonProps = LinkProps | ButtonOnlyProps;

const variantClasses: Record<Variant, string> = {
  primary: "bg-gold-400 text-navy-900 hover:bg-gold-500 shadow-md hover:shadow-lg",
  secondary: "bg-navy-700 text-white hover:bg-navy-800 shadow-md hover:shadow-lg",
  ghost: "text-navy-700 hover:text-gold-500 hover:bg-navy-50",
  // For use on dark backgrounds (hero sections)
  outline: "border-2 border-white text-white hover:bg-white hover:text-navy-700",
  // For use on light backgrounds
  outlineDark: "border-2 border-navy-200 text-navy-800 hover:border-gold-500 hover:text-gold-600 hover:bg-navy-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
  } = props;

  const classes = `inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer touch-manipulation select-none active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Link mode
  if ("href" in props) {
    const { href, external = false } = props as LinkProps;

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

  // Button mode
  const { onClick, type = "button", disabled = false } = props as ButtonOnlyProps;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      onTouchStart={() => {
        // iOS Safari: sometimes needs a touch handler to consistently treat it as interactive
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
