// filename: Timeline.tsx
import React from "react";
import type { AgentMap, Phase, Milestone, MilestoneState } from "./types";
import AgentBadge from "./AgentBadge";
import { CheckIcon } from "./icons";

/* ---------- PhaseStrip ---------- */
export interface PhaseStripProps {
  phases: Phase[];
}
export function PhaseStrip({ phases }: PhaseStripProps) {
  return (
    <div className="grid grid-cols-4 bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-6 py-[22px]">
      {phases.map((p, i) => {
        const numCls = p.state === "done"
          ? "bg-[var(--accent)] text-[#0e1218] border-[var(--accent)]"
          : p.state === "active"
            ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]"
            : "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]";
        return (
          <div key={p.num} className={"flex flex-col gap-[10px] relative px-[14px] " + (i > 0 ? "border-l border-[var(--border)]" : "")}>
            <div className="flex items-center gap-[10px]">
              <span className={"w-[30px] h-[30px] rounded-[7px] inline-flex items-center justify-center text-[11px] font-medium border " + numCls}
                    style={p.state === "active" ? { animation: "pulseRing 2s ease-out infinite" } : undefined}>
                {p.state === "done" ? <CheckIcon /> : p.num}
              </span>
              <div className="flex-1 flex flex-col">
                <span className="text-[9.5px] text-[var(--muted)] tracking-[0.08em] uppercase">Phase {p.num}</span>
                <span className="text-[14px] font-bold text-[var(--text)]">{p.label}</span>
              </div>
            </div>
            <div className="h-1 rounded-[2px] overflow-hidden bg-[var(--surface-2)] border border-[var(--border)]">
              <div className="h-full" style={{ width: p.pct + "%", background: p.state === "upcoming" ? "var(--faint)" : "var(--accent)" }} />
            </div>
            <div className="text-[10.5px] text-[var(--muted)]">{p.dates}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Timeline (milestones) ---------- */
const MS_STATE: Record<MilestoneState, { ring: string; fill: string; glow: boolean }> = {
  done:     { ring: "var(--accent)", fill: "var(--accent)", glow: false },
  active:   { ring: "var(--accent)", fill: "var(--accent)", glow: true },
  upcoming: { ring: "var(--border-bright)", fill: "var(--bg)", glow: false },
};

export interface TimelineProps {
  milestones: Milestone[];
  agents?: AgentMap;
  onSelect?: (milestone: Milestone) => void;
  title?: string;
}

/** Connected milestone list. Pair with <PhaseStrip> for a full timeline view. */
export default function Timeline({ milestones, agents, onSelect, title = "Milestones" }: TimelineProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] overflow-hidden">
      <div className="px-5 py-[14px] border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-[13px] font-bold text-[var(--text)]">{title}</span>
        <span className="text-[10.5px] text-[var(--muted)]">{milestones.length} milestones</span>
      </div>
      {milestones.map((m, i) => {
        const st = MS_STATE[m.status] || MS_STATE.upcoming;
        return (
          <div key={i} onClick={() => onSelect && onSelect(m)}
            className={"grid grid-cols-[90px_16px_1fr_auto] gap-[18px] items-center px-5 py-[14px] transition-colors hover:bg-[var(--surface-2)] " +
              (onSelect ? "cursor-pointer " : "") + (i < milestones.length - 1 ? "border-b border-[var(--border)]" : "")}>
            <span className="text-[11px] text-[var(--muted)]">{m.date}</span>
            <span className="relative w-[14px] h-[14px] flex items-center justify-center">
              {i < milestones.length - 1 && <span className="absolute top-[14px] left-1/2 -translate-x-1/2 w-px h-[40px] bg-[var(--border)]" />}
              <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: st.ring, background: st.fill, boxShadow: st.glow ? "0 0 0 4px rgba(118,171,174,0.15)" : "none" }} />
            </span>
            <span className="text-[13px] font-semibold text-[var(--text)]">{m.title}</span>
            <AgentBadge code={m.agent} agents={agents} size={24} radius={6} />
          </div>
        );
      })}
    </div>
  );
}
