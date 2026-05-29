// filename: EmptyState.tsx
import React from "react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Optional action node (e.g. a button) rendered below the copy. */
  action?: React.ReactNode;
  /** Tighter vertical padding for use inside panels. */
  compact?: boolean;
}

/** Reusable empty placeholder. */
export default function EmptyState({ icon, title, subtitle, action, compact = false }: EmptyStateProps) {
  return (
    <div className={"flex flex-col items-center justify-center text-center gap-3 text-[var(--muted)] " + (compact ? "py-10 px-5" : "py-[60px] px-5")}>
      {icon != null && (
        <div className="w-12 h-12 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--faint)]">{icon}</div>
      )}
      <div className="text-[14px] font-semibold text-[var(--text-soft)]">{title}</div>
      {subtitle && <div className="text-[11px] text-[var(--muted)] max-w-[320px]">{subtitle}</div>}
      {action}
    </div>
  );
}
