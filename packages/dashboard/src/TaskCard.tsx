// filename: TaskCard.tsx
import React from "react";
import type { AgentMap, BoardTask, Priority } from "./types";
import AgentBadge from "./AgentBadge";

export interface TaskCardProps {
  task: BoardTask;
  agents?: AgentMap;
  onClick?: (task: BoardTask) => void;
}

const PRIO_COLOR: Record<Priority, string> = {
  high: "var(--danger)", med: "var(--amber)", low: "var(--green)",
};

/** Kanban card — priority dot, title, agent badge, effort chip and date. */
export default function TaskCard({ task, agents, onClick }: TaskCardProps) {
  return (
    <div
      onClick={() => onClick && onClick(task)}
      className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[8px] px-[13px] py-3 flex flex-col gap-[10px] cursor-pointer transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-3)]"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIO_COLOR[task.prio] || "var(--muted)" }} title={task.prio + " priority"} />
        <span className="text-[10px] text-[var(--muted)] ml-auto">{task.id}</span>
      </div>
      <div className="text-[13px] font-semibold text-[var(--text)] leading-[1.35]">{task.title}</div>
      <div className="flex items-center gap-2 text-[10.5px] text-[var(--muted)]">
        <AgentBadge code={task.agent} agents={agents} size={22} radius={5} />
        {task.effort && (
          <span className="text-[9.5px] font-medium text-[var(--text-soft)] bg-[var(--surface)] border border-[var(--border)] rounded-[4px] px-[6px] py-px">{task.effort}</span>
        )}
        <span className="flex-1" />
        {task.date && <span>{task.date}</span>}
      </div>
    </div>
  );
}
