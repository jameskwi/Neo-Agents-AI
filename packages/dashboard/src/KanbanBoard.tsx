// filename: KanbanBoard.tsx
import React from "react";
import type { AgentMap, BoardColumn, BoardTask } from "./types";
import TaskCard from "./TaskCard";

export interface KanbanBoardProps {
  columns: BoardColumn[];
  agents?: AgentMap;
  onCardClick?: (task: BoardTask) => void;
  /** Fixed height (px or CSS string) to enable per-column scroll. */
  height?: number | string;
}

/** Four-up Kanban board with colored column headers + scrollable bodies. */
export default function KanbanBoard({ columns, agents, onCardClick, height }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-[14px]" style={{ height: height || "auto" }}>
      {columns.map((col) => (
        <div
          key={col.key}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] flex flex-col min-h-0 overflow-hidden"
          style={{ borderTop: "3px solid " + (col.color || "var(--muted)") }}
        >
          <div className="px-4 pt-[14px] pb-3 flex items-center justify-between border-b border-[var(--border)]">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text)]">{col.title}</span>
            <span className="text-[10.5px] rounded-full px-2 py-px bg-[var(--surface-2)] border border-[var(--border)]" style={{ color: col.color || "var(--muted)" }}>{col.cards.length}</span>
          </div>
          <div className="p-3 flex flex-col gap-[10px] overflow-y-auto flex-1">
            {col.cards.length === 0
              ? <div className="text-[11px] text-[var(--faint)] text-center py-6">No tasks</div>
              : col.cards.map((c) => <TaskCard key={c.id} task={c} agents={agents} onClick={onCardClick} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
