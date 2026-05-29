// filename: DashboardHeader.tsx
import React from "react";
import { BellIcon } from "./icons";

export interface HeaderPhase {
  /** e.g. "Phase 2". */
  label: string;
  /** e.g. "MVP". */
  name: string;
}
export interface HeaderUser {
  name: string;
  /** Single-letter avatar fallback; defaults to first letter of name. */
  initial?: string;
}

export interface DashboardHeaderProps {
  brand?: string;
  logoText?: string;
  project?: string;
  projectType?: string;
  phase?: HeaderPhase;
  taskCount?: number;
  version?: string;
  notifications?: number;
  user?: HeaderUser;
  onNotificationsClick?: () => void;
  onProjectClick?: () => void;
}

/** Top app bar: brand, project pill, phase/task meta, notifications, avatar. */
export default function DashboardHeader({
  brand = "Neo Agents AI", logoText = "N",
  project, projectType, phase, taskCount, version,
  notifications = 0, user, onNotificationsClick, onProjectClick,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center gap-4 px-5 h-14 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-[7px] bg-[var(--accent)] inline-flex items-center justify-center font-extrabold text-[14px] text-[#1a1f26] tracking-[-0.02em]">{logoText}</div>
        <span className="font-bold text-[15px] text-[var(--text)] tracking-[-0.01em]">{brand}</span>
      </div>

      <div className="flex-1 flex justify-center items-center gap-2">
        {project && (
          <button onClick={onProjectClick} className="inline-flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-[8px] px-3 py-[6px] text-[12px] text-[var(--text)] hover:border-[var(--border-bright)] transition-colors">
            <span className="text-[var(--muted)] text-[10.5px]">project</span>
            <span className="text-[var(--accent)]">›</span>
            <span>{project}</span>
          </button>
        )}
        {projectType && (
          <span className="inline-flex items-center gap-[6px] bg-[var(--surface-2)] border border-[var(--border)] rounded-[6px] px-[10px] py-[5px] text-[10.5px] text-[var(--muted)]">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--accent)]" />{projectType}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 text-[11.5px] text-[var(--muted)]">
        {phase && (
          <span className="inline-flex items-center gap-[5px] px-[10px] py-[5px] rounded-[6px] text-[var(--accent)] border border-[rgba(118,171,174,0.3)] bg-[rgba(118,171,174,0.08)]">
            <span className="text-[var(--muted)]">{phase.label} ·</span> {phase.name}
          </span>
        )}
        {taskCount != null && (
          <span className="inline-flex items-center gap-[6px] bg-[var(--surface-2)] border border-[var(--border)] px-[10px] py-[5px] rounded-[6px] text-[var(--text-soft)]">
            <span className="text-[var(--muted)]">tasks</span> {taskCount}
          </span>
        )}
        {version && <span className="text-[11px] text-[var(--muted)]">{version}</span>}
        <button onClick={onNotificationsClick} title="Notifications" className="relative w-8 h-8 rounded-[8px] bg-[var(--surface-2)] border border-[var(--border)] inline-flex items-center justify-center text-[var(--text-soft)] hover:bg-[var(--surface-3)] hover:border-[var(--border-bright)] hover:text-[var(--text)] transition-colors">
          <BellIcon />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[var(--danger)] text-white text-[9.5px] font-medium inline-flex items-center justify-center border-2 border-[var(--surface)] leading-none">{notifications}</span>
          )}
        </button>
        {user && (
          <div title={user.name} className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[13px] font-bold text-[#0e1218] cursor-pointer border border-white/5 transition-transform hover:scale-105"
               style={{ background: "linear-gradient(135deg,var(--accent),#5e9295)" }}>
            {user.initial || user.name[0] || "?"}
          </div>
        )}
      </div>
    </div>
  );
}
