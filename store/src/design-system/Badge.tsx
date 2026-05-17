import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "accent" | "warn";
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const tones = {
    neutral: "bg-surface-muted text-ink-muted ring-1 ring-border",
    accent: "bg-accent/10 text-accent ring-1 ring-accent/20",
    warn: "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-sm font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
