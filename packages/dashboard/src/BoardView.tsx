// filename: BoardView.tsx
// Kanban task board: 4 columns (Backlog / In Progress / Review / Done),
// step-dot workflow indicator per card, inline move buttons.

import React, { useState } from "react";
import type { AgentMap, Priority } from "./types";
import AgentBadge from "./AgentBadge";
import { CheckIcon } from "./icons";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type ColumnKey = "backlog" | "progress" | "review" | "done";
export type StepStatus = "done" | "active" | "idle";

export interface TaskStep {
  /** Agent code shown inside the dot (e.g. "BA", "SA", "DS", "DEV"). */
  agent: string;
  status: StepStatus;
}

export interface Task {
  id: string;
  title: string;
  column: ColumnKey;
  /** Primary owner — drives the agent badge in the card footer. */
  agent: string;
  /** Ordered workflow steps shown as dot indicators. */
  steps?: TaskStep[];
  prio?: Priority;
  effort?: "S" | "M" | "L" | "XL";
  date?: string;
}

export interface BoardViewProps {
  tasks: Task[];
  agents?: AgentMap;
  onSelect: (task: Task) => void;
  onMove: (taskId: string, column: ColumnKey) => void;
  /** Fixed height (px / CSS value) to enable per-column scroll. */
  height?: number | string;
}

/* ─── Column config ──────────────────────────────────────────────────────── */

const COLUMNS: { key: ColumnKey; title: string; color: string }[] = [
  { key: "backlog",  title: "Backlog",     color: "#7a8699" },
  { key: "progress", title: "In Progress", color: "#f0b429" },
  { key: "review",   title: "Review",      color: "#76ABAE" },
  { key: "done",     title: "Done",        color: "#4caf78" },
];

const PRIO_DOT: Record<Priority, string> = {
  high: "var(--danger)", med: "var(--amber)", low: "var(--green)",
};

/* ─── StepDot ────────────────────────────────────────────────────────────── */

const STEP_STYLE: Record<StepStatus, { bg: string; color: string }> = {
  done:   { bg: "var(--green)",     color: "#0e1218" },
  active: { bg: "var(--amber)",     color: "#0e1218" },
  idle:   { bg: "var(--surface-3)", color: "var(--faint)" },
};

function StepDot({ step }: { step: TaskStep }) {
  const s = STEP_STYLE[step.status];
  return (
    <span
      title={step.agent + " — " + step.status}
      className="inline-flex items-center justify-center font-medium tracking-[0.03em] select-none shrink-0"
      style={{ width: 18, height: 18, borderRadius: 4, background: s.bg, color: s.color, fontSize: 8.5, fontFamily: "var(--sans)" }}
    >
      {step.status === "done" ? <CheckIcon width={9} height={9} /> : step.agent}
    </span>
  );
}

/* ─── TaskCard ───────────────────────────────────────────────────────────── */

interface TaskCardProps {
  task: Task;
  agents?: AgentMap;
  onSelect: (t: Task) => void;
  onMove: (id: string, col: ColumnKey) => void;
}

function TaskCard({ task, agents, onSelect, onMove }: TaskCardProps) {
  const targets = COLUMNS.filter((c) => c.key !== task.column);

  return (
    <div
      onClick={() => onSelect(task)}
      className="group relative bg-[var(--surface-2)] border border-[var(--border)] rounded-[8px] px-[13px] pt-3 pb-[10px] flex flex-col gap-[9px] cursor-pointer transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-3)]"
    >
      {/* ID row */}
      <div className="flex items-center gap-2">
        {task.prio && (
          <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: PRIO_DOT[task.prio] }} title={task.prio + " priority"} />
        )}
        <span className="text-[10px] text-[var(--muted)] ml-auto font-[var(--mono)]">{task.id}</span>
      </div>

      {/* Title */}
      <div className="text-[13px] font-semibold text-[var(--text)] leading-[1.35]">{task.title}</div>

      {/* Footer: agent badge + step dots + date */}
      <div className="flex items-center gap-[7px] min-w-0">
        <AgentBadge code={task.agent} agents={agents} size={22} radius={5} />
        {task.steps && task.steps.length > 0 && (
          <div className="flex items-center gap-[3px]">
            {task.steps.map((s, i) => <StepDot key={i} step={s} />)}
          </div>
        )}
        <span className="flex-1" />
        {task.effort && (
          <span className="text-[9.5px] font-medium text-[var(--text-soft)] bg-[var(--surface)] border border-[var(--border)] rounded-[3px] px-[5px] py-px">{task.effort}</span>
        )}
        {task.date && <span className="text-[10.5px] text-[var(--muted)] whitespace-nowrap">{task.date}</span>}
      </div>

      {/* Move buttons — revealed on hover */}
      <div className="flex items-center gap-[5px] flex-wrap h-0 overflow-hidden group-hover:h-auto group-hover:overflow-visible opacity-0 group-hover:opacity-100 transition-all duration-150">
        {targets.map((t) => (
          <button
            key={t.key}
            onClick={(e) => { e.stopPropagation(); onMove(task.id, t.key); }}
            className="text-[9.5px] text-[var(--muted)] hover:text-[var(--text-soft)] px-[7px] py-[2px] rounded-[4px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-bright)] transition-colors whitespace-nowrap"
          >
            → {t.title}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── BoardView ──────────────────────────────────────────────────────────── */

export default function BoardView({ tasks, agents, onSelect, onMove, height }: BoardViewProps) {
  return (
    <div className="grid grid-cols-4 gap-[14px]" style={{ height: height || "auto" }}>
      {COLUMNS.map((col) => {
        const cards = tasks.filter((t) => t.column === col.key);
        return (
          <div
            key={col.key}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] flex flex-col min-h-0 overflow-hidden"
            style={{ borderTop: "3px solid " + col.color }}
          >
            {/* Column header */}
            <div className="px-4 pt-[14px] pb-3 flex items-center justify-between border-b border-[var(--border)]">
              <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text)]">{col.title}</span>
              <span
                className="text-[10.5px] rounded-full px-2 py-px bg-[var(--surface-2)] border border-[var(--border)]"
                style={{ color: col.color }}
              >{cards.length}</span>
            </div>

            {/* Cards */}
            <div className="p-3 flex flex-col gap-[10px] overflow-y-auto flex-1">
              {cards.length === 0 ? (
                <div className="text-[11px] text-[var(--faint)] text-center py-6">No tasks</div>
              ) : (
                cards.map((c) => (
                  <TaskCard key={c.id} task={c} agents={agents} onSelect={onSelect} onMove={onMove} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
