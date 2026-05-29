// filename: index.ts
// Barrel export for the Neo Agents AI component library.

export { default as AgentBadge } from "./AgentBadge";
export type { AgentBadgeProps } from "./AgentBadge";

export { default as StatusPill } from "./StatusPill";
export type { StatusPillProps } from "./StatusPill";

export { default as KpiCard } from "./KpiCard";
export type { KpiCardProps, KpiTone } from "./KpiCard";

export { default as EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

export { default as Toast } from "./Toast";
export type { ToastProps, ToastTone } from "./Toast";

export { default as TabBar } from "./TabBar";
export type { TabBarProps } from "./TabBar";

export { default as DashboardHeader } from "./DashboardHeader";
export type { DashboardHeaderProps, HeaderPhase, HeaderUser } from "./DashboardHeader";

export { default as TaskQueue } from "./TaskQueue";
export type { TaskQueueProps } from "./TaskQueue";

export { default as AgentStatusRow } from "./AgentStatusRow";
export type { AgentStatusRowProps, BarTone } from "./AgentStatusRow";

export { default as TaskCard } from "./TaskCard";
export type { TaskCardProps } from "./TaskCard";

export { default as KanbanBoard } from "./KanbanBoard";
export type { KanbanBoardProps } from "./KanbanBoard";

export { default as ChatPanel, ChatMessage, ApproveBanner } from "./ChatPanel";
export type { ChatPanelProps, ChatMessageProps, ApproveBannerProps } from "./ChatPanel";

export { default as DocsBrowser, DocTree, DocViewer } from "./DocsBrowser";
export type { DocsBrowserProps, DocTreeProps, DocViewerProps } from "./DocsBrowser";

export { default as Timeline, PhaseStrip } from "./Timeline";
export type { TimelineProps, PhaseStripProps } from "./Timeline";

export { default as AppShell, HEADER_HEIGHT, TABBAR_HEIGHT, SHELL_OFFSET } from "./AppShell";
export type { AppShellProps, AppShellTab, AppShellUser } from "./AppShell";

export { default as BoardView } from "./BoardView";
export type { BoardViewProps, Task, TaskStep, ColumnKey, StepStatus } from "./BoardView";
export type { AppShellProps, AppShellTab, AppShellUser } from "./AppShell";

export * from "./icons";
export * from "./types";
