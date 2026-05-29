// filename: AgentBadge.tsx
import React from "react";
import type { AgentMap } from "./types";

export interface AgentBadgeProps {
  /** Agent code, resolved against `agents`. */
  code: string;
  agents?: AgentMap;
  /** Square edge length in px. Default 34. */
  size?: number;
  /** Corner radius in px. Default 8. */
  radius?: number;
  /** Tooltip override (defaults to agent name). */
  title?: string;
}

/** Square monogram tile. Color + name resolve from the agents map by code. */
export default function AgentBadge({ code, agents, size = 34, radius = 8, title }: AgentBadgeProps) {
  const a = agents && agents[code];
  const color = (a && a.color) || "var(--muted)";
  return (
    <span
      title={title != null ? title : (a && a.name) || code}
      className="inline-flex items-center justify-center font-medium text-[#0e1218] tracking-[0.04em] shrink-0 select-none"
      style={{
        width: size, height: size, borderRadius: radius, background: color,
        fontSize: Math.max(8.5, Math.round(size * 0.32)), fontFamily: "var(--sans)",
      }}
    >
      {code}
    </span>
  );
}
