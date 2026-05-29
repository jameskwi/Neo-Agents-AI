// filename: TaskQueue.tsx
import React from "react";
import type { AgentMap, QueueItem } from "./types";
import AgentBadge from "./AgentBadge";
import StatusPill from "./StatusPill";
import EmptyState from "./EmptyState";
import { InboxIcon } from "./icons";

export interface TaskQueueProps {
  items: QueueItem[];
  agents?: AgentMap;
  onOpen?: (item: QueueItem) => void;
  /** Custom empty node; falls back to a built-in EmptyState. */
  emptyState?: React.ReactNode;
}

/** Run queue — agent badge, title, status pill, timestamp, with a built-in empty state. */
export default function TaskQueue({ items, agents, onOpen, emptyState }: TaskQueueProps) {
  if (!items || items.length === 0) {
    return (
      <>
        {emptyState || (
          <EmptyState compact icon={<InboxIcon />} title="No tasks in queue" subtitle="Approve a plan from Chat to get started" />
        )}
      </>
    );
  }
  return (
    <div>
      {items.map((t, i) => (
        <button
          key={t.id}
          onClick={() => onOpen && onOpen(t)}
          className={"w-full text-left grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center px-[18px] py-3 transition-colors hover:bg-[var(--surface-2)] " +
            (i < items.length - 1 ? "border-b border-[var(--border)]" : "")}
        >
          <AgentBadge code={t.agent} agents={agents} size={26} radius={6} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[var(--text)] truncate">{t.title}</div>
            <div className="text-[10.5px] text-[var(--muted)] mt-[2px] truncate">
              {t.id} · {(agents && agents[t.agent] && agents[t.agent].name) || t.agent} · {t.ts}
            </div>
          </div>
          <StatusPill status={t.status} />
          <span className="text-[10.5px] text-[var(--muted)] whitespace-nowrap">{t.ts}</span>
        </button>
      ))}
    </div>
  );
}
