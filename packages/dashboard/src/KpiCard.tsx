// filename: KpiCard.tsx
import React from "react";

export type KpiTone = "accent" | "amber" | "green" | "default";

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  /** Tints the big value. Default "default". */
  tone?: KpiTone;
  /** e.g. "+12". Rendered green, or red when `deltaNegative`. */
  delta?: string;
  deltaNegative?: boolean;
  /** Trailing footnote, e.g. "this week". */
  foot?: string;
  /** Optional icon node shown top-right. */
  icon?: React.ReactNode;
}

const KPI_TONE: Record<KpiTone, string> = {
  accent: "var(--accent)", amber: "var(--amber)", green: "var(--green)", default: "var(--text)",
};

/** Stat tile with tone-colored value, optional delta + trailing icon. */
export default function KpiCard({ label, value, tone = "default", delta, deltaNegative = false, foot, icon }: KpiCardProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-5 py-[18px] flex flex-col gap-[10px] transition-colors hover:border-[var(--border-bright)]">
      <div className="flex items-center justify-between text-[var(--muted)] text-[11px] tracking-[0.06em] uppercase">
        <span>{label}</span>
        {icon != null && (
          <span className="w-6 h-6 rounded-[6px] inline-flex items-center justify-center bg-[var(--surface-2)] text-[var(--muted)]">{icon}</span>
        )}
      </div>
      <div className="text-[32px] font-medium tracking-[-0.02em] leading-none" style={{ color: KPI_TONE[tone] }}>{value}</div>
      <div className="text-[10.5px] text-[var(--muted)] flex items-center gap-[6px]">
        {delta != null && <span style={{ color: deltaNegative ? "var(--danger)" : "var(--green)" }}>{delta}</span>}
        {foot && <span>{foot}</span>}
      </div>
    </div>
  );
}
