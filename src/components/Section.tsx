import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  bg?: "white" | "gray" | "navy" | "gold";
}

const bgClasses = {
  white: "bg-white",
  gray: "bg-navy-50",
  navy: "bg-navy-700 text-white",
  gold: "bg-gold-50",
};

export default function Section({
  children,
  className = "",
  id,
  bg = "white",
}: SectionProps) {
  return (
    <section id={id} className={`${bgClasses[bg]} py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl mb-12`}>
      {eyebrow && (
        <p
          className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
            light ? "text-gold-400" : "text-gold-500"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg leading-relaxed ${
            light ? "text-navy-100" : "text-navy-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
