// filename: AppShell.tsx
// Root layout wrapper for the Neo Agents AI dashboard.
// Fixed header (56 px) + fixed tab bar (48 px) + scrollable main content.

import React from "react";
import { ListIcon, BoardIcon, DocIcon, TimeIcon, TerminalIcon } from "./icons";

/* ---- Layout constants (also exported so consumers can compute offsets) ---- */
export const HEADER_HEIGHT = 56;
export const TABBAR_HEIGHT = 48;
export const SHELL_OFFSET = HEADER_HEIGHT + TABBAR_HEIGHT; // 104 px

/* ---- Types ---- */
export interface AppShellTab {
  key: string;
  label: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  /** Renders an accent badge on the tab. */
  count?: number;
}

export interface AppShellUser {
  name: string;
  /** Single-char avatar fallback; defaults to first letter of name. */
  initial?: string;
}

export interface AppShellProps {
  projectName: string;
  projectType: string;
  version: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  /** Number shown on the Board badge. */
  inProgressCount?: number;
  /** Override the default 5 tabs. */
  tabs?: AppShellTab[];
  user?: AppShellUser;
}

/* ---- Default tabs ---- */
function buildDefaultTabs(inProgressCount = 0): AppShellTab[] {
  return [
    { key: "overview",  label: "Overview",  icon: ListIcon },
    { key: "board",     label: "Board",     icon: BoardIcon, count: inProgressCount || undefined },
    { key: "docs",      label: "Docs",      icon: DocIcon },
    { key: "timeline",  label: "Timeline",  icon: TimeIcon },
    { key: "terminal",  label: "Terminal",  icon: TerminalIcon },
  ];
}

/* ---- Header ---- */
function ShellHeader({ projectName, projectType, version, user }: Pick<AppShellProps, "projectName" | "projectType" | "version" | "user">) {
  const u = user || { name: "Mohammad", initial: "M" };
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center gap-4 px-5 bg-[var(--surface)] border-b border-[var(--border)]"
      style={{ height: HEADER_HEIGHT }}
    >
      {/* Logo + brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-[8px] bg-[var(--accent)] inline-flex items-center justify-center font-extrabold text-[13px] tracking-[-0.02em] text-[#1a1f26] select-none">
          NA
        </div>
        <span className="font-bold text-[15px] text-[var(--text)] tracking-[-0.01em]">Neo Agents AI</span>
      </div>

      {/* Center — project pill + stack badge */}
      <div className="flex-1 flex justify-center items-center gap-2">
        <div className="inline-flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-[8px] px-3 py-[6px] text-[12px] text-[var(--text)]">
          <span className="text-[var(--muted)] text-[10.5px]">project</span>
          <span className="text-[var(--accent)]">›</span>
          <span className="font-medium">{projectName}</span>
        </div>
        <div className="inline-flex items-center gap-[6px] bg-[var(--surface-2)] border border-[var(--border)] rounded-[6px] px-[10px] py-[5px] text-[10.5px] text-[var(--muted)]">
          <span className="w-[6px] h-[6px] rounded-full bg-[var(--accent)]" />
          {projectType}
        </div>
      </div>

      {/* Right — version + avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-[var(--muted)] font-[var(--mono)]">{version}</span>
        <div
          title={u.name}
          className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[13px] font-bold text-[#0e1218] cursor-pointer border border-white/5 transition-transform hover:scale-105 select-none"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dim))" }}
        >
          {u.initial || u.name[0] || "?"}
        </div>
      </div>
    </header>
  );
}

/* ---- Tab bar ---- */
function ShellTabBar({ tabs, activeTab, onTabChange }: { tabs: AppShellTab[]; activeTab: string; onTabChange: (k: string) => void }) {
  return (
    <div
      className="fixed left-0 right-0 z-40 flex items-stretch px-5 bg-[var(--surface)] border-b border-[var(--border)]"
      style={{ top: HEADER_HEIGHT, height: TABBAR_HEIGHT }}
    >
      {tabs.map((t) => {
        const on = t.key === activeTab;
        const Ico = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={"inline-flex items-center gap-2 px-[18px] text-[12px] tracking-[0.025em] uppercase font-medium border-b-2 transition-colors " +
              (on ? "text-[var(--accent)] border-[var(--accent)]" : "text-[var(--muted)] border-transparent hover:text-[var(--text-soft)]")}
          >
            {Ico && <Ico />}
            <span>{t.label}</span>
            {t.count != null && t.count > 0 && (
              <span className={"text-[10px] rounded-full px-[7px] py-px border transition-colors " +
                (on
                  ? "text-[var(--accent)] border-[rgba(118,171,174,0.3)] bg-[var(--accent-soft)]"
                  : "text-[var(--muted)] border-[var(--border)] bg-[var(--surface-2)]")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---- AppShell ---- */
export default function AppShell({
  projectName, projectType, version,
  activeTab, onTabChange,
  children, inProgressCount = 0,
  tabs, user,
}: AppShellProps) {
  const resolvedTabs = tabs ?? buildDefaultTabs(inProgressCount);

  return (
    <div className="bg-[var(--bg)] h-screen overflow-hidden" style={{ fontFamily: "var(--sans)" }}>
      <ShellHeader projectName={projectName} projectType={projectType} version={version} user={user} />
      <ShellTabBar tabs={resolvedTabs} activeTab={activeTab} onTabChange={onTabChange} />
      <main
        className="overflow-y-auto"
        style={{ paddingTop: SHELL_OFFSET, height: "100vh" }}
      >
        {children}
      </main>
    </div>
  );
}
