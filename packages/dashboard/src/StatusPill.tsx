// filename: StatusPill.tsx
import React from "react";
import type { PillStatus } from "./types";

export interface StatusPillProps {
  status: PillStatus;
  /** Override the default label for the status. */
  label?: string;
}

const PILL_STYLES: Record<PillStatus, string> = {
  backlog:  "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]",
  queued:   "bg-[var(--surface-2)] text-[var(--text-soft)] border-[var(--border)]",
  progress: "bg-[rgba(240,180,41,0.12)] text-[var(--amber)] border-[rgba(240,180,41,0.3)]",
  running:  "bg-[var(--accent-soft)] text-[var(--accent)] border-[rgba(118,171,174,0.3)]",
  review:   "bg-[var(--accent-soft)] text-[var(--accent)] border-[rgba(118,171,174,0.3)]",
  done:     "bg-[rgba(76,175,120,0.12)] text-[var(--green)] border-[rgba(76,175,120,0.3)]",
};
const PILL_LABELS: Record<PillStatus, string> = {
  backlog: "Backlog", queued: "Queued", progress: "In Progress",
  running: "Running", review: "Review", done: "Done",
};

/** Compact status token with built-in color + label mapping. */
export default function StatusPill({ status, label }: StatusPillProps) {
  return (
    <span className={"inline-block font-medium uppercase tracking-[0.08em] text-[9.5px] px-2 py-[3px] rounded-[4px] border whitespace-nowrap " + (PILL_STYLES[status] || PILL_STYLES.backlog)}>
      {label || PILL_LABELS[status] || status}
    </span>
  );
}
