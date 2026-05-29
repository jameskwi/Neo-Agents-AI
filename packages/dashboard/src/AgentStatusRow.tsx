// filename: AgentStatusRow.tsx
import React from "react";
import type { AgentMap, AgentRunState } from "./types";
import AgentBadge from "./AgentBadge";

export type BarTone = "default" | "warn" | "done";

export interface AgentStatusRowProps {
  /** Agent code, resolved against `agents`. */
  agent: string;
  agents?: AgentMap;
  /** 0–100 completion. */
  pct?: number;
  files?: number;
  ts?: string;
  status?: AgentRunState;
  /** Force the progress-bar color; otherwise auto-toned by pct. */
  barTone?: BarTone;
  onClick?: () => void;
  /** Render a bottom divider. Default true. */
  divider?: boolean;
}

const STATUS_DOT: Record<AgentRunState, { color: string; label: string; animate: boolean }> = {
  thinking: { color: "var(--amber)", label: "Thinking", animate: true },
  running:  { color: "var(--accent)", label: "Running", animate: true },
  done:     { color: "var(--green)", label: "Done", animate: false },
  idle:     { color: "var(--faint)", label: "Idle", animate: false },
};

/** One agent's live row — status dot, role + files, auto-toned progress bar. */
export default function AgentStatusRow({ agent, agents, pct = 0, files, ts, status = "idle", barTone, onClick, divider = true }: AgentStatusRowProps) {
  const a = agents && agents[agent];
  const dot = STATUS_DOT[status] || STATUS_DOT.idle;
  const tone: BarTone = barTone || (pct >= 100 ? "done" : pct < 35 ? "warn" : "default");
  const barColor = { done: "var(--green)", warn: "var(--amber)", default: "var(--accent)" }[tone];

  return (
    <div
      onClick={onClick}
      className={"grid grid-cols-[auto_1fr_auto] gap-3 items-center px-[18px] py-3 transition-colors hover:bg-[var(--surface-2)] " +
        (onClick ? "cursor-pointer " : "") + (divider ? "border-b border-[var(--border)]" : "")}
    >
      <AgentBadge code={agent} agents={agents} size={34} radius={8} />
      <div className="flex flex-col gap-[5px] min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[var(--text)] truncate">{(a && a.name) || agent}</span>
          <span className="inline-flex items-center gap-[6px] text-[9.5px] uppercase tracking-[0.06em]" style={{ color: dot.color }}>
            <span className="w-[7px] h-[7px] rounded-full" style={{ background: dot.color, animation: dot.animate ? "dotPulse 1.4s ease-in-out infinite" : "none" }} />
            {dot.label}
          </span>
        </div>
        <div className="text-[10.5px] text-[var(--muted)] flex items-center gap-[10px]">
          {a && a.role && <span>{a.role}</span>}
          {files != null && (<><span className="text-[var(--faint)]">·</span><span>{files} files</span></>)}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-[140px] h-1 rounded-[2px] overflow-hidden bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="h-full" style={{ width: pct + "%", background: barColor }} />
        </div>
        <div className="text-right flex flex-col gap-[2px] w-[52px]">
          <span className="text-[12px] text-[var(--text)]">{pct}%</span>
          {ts && <span className="text-[10px] text-[var(--muted)]">{ts}</span>}
        </div>
      </div>
    </div>
  );
}
