// filename: types.ts
// Shared types for the Neo Agents AI dashboard component library.

/** A single agent in the registry. `code` is the short monogram (e.g. "BA"). */
export interface Agent {
  code: string;
  name: string;
  /** Any CSS color string — drives the badge background. */
  color: string;
  role?: string;
}

/** Registry of agents keyed by code. Passed into every agent-aware component. */
export type AgentMap = Record<string, Agent>;

export type Priority = "high" | "med" | "low";
export type Effort = "S" | "M" | "L" | "XL";

/** Status values understood by <StatusPill>. */
export type PillStatus =
  | "backlog"
  | "queued"
  | "progress"
  | "running"
  | "review"
  | "done";

/** Live execution state for an agent row. */
export type AgentRunState = "thinking" | "running" | "done" | "idle";

export interface QueueItem {
  id: string;
  title: string;
  /** Agent code — resolved against the AgentMap. */
  agent: string;
  status: "queued" | "running" | "done";
  ts: string;
}

export interface BoardTask {
  id: string;
  title: string;
  agent: string;
  prio: Priority;
  effort?: Effort;
  date?: string;
}

export interface BoardColumn {
  key: string;
  title: string;
  /** Column accent — used for the top border and count chip. */
  color: string;
  cards: BoardTask[];
}

export interface ChatMessageData {
  id: string;
  role: "user" | "agent";
  /** Required when role === "agent". */
  agent?: string;
  /** Fallback display name when no agent is resolved. */
  name?: string;
  ts?: string;
  /** Plain-text body. */
  text?: string;
  /** Trusted rich HTML body (rendered via dangerouslySetInnerHTML). */
  html?: string;
  /** Render the animated typing indicator instead of a bubble. */
  typing?: boolean;
}

export interface ApprovalData {
  label: string;
  title: string;
  approveLabel?: string;
  rejectLabel?: string;
}

export interface DocFile {
  name: string;
}

export interface DocGroup {
  /** Group code — if it matches an agent code, that agent's color is used. */
  code: string;
  label: string;
  color?: string;
  files: DocFile[];
}

export type DocBlockType = "p" | "h2" | "h3" | "code";
export interface DocBlock {
  t: DocBlockType;
  c: string;
  /** Render a paragraph as muted lede text. */
  lede?: boolean;
}
export interface DocContent {
  title?: string;
  breadcrumb?: string[];
  frontmatter?: Record<string, string | number>;
  body?: DocBlock[];
}

export type PhaseState = "done" | "active" | "upcoming";
export interface Phase {
  num: string;
  label: string;
  state: PhaseState;
  dates: string;
  /** 0–100 completion. */
  pct: number;
}

export type MilestoneState = "done" | "active" | "upcoming";
export interface Milestone {
  phase: number;
  date: string;
  title: string;
  agent: string;
  status: MilestoneState;
}

export interface TabItem {
  key: string;
  label: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}
