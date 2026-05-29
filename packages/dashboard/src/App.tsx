import React, { useState, useEffect, useCallback } from "react";
import type {
  AgentMap, AgentRunState, BoardColumn, BoardTask, DocContent, DocBlock,
  DocFile, DocGroup, Effort, Milestone, Phase, Priority, QueueItem, TabItem,
} from "./types";
import DashboardHeader from "./DashboardHeader";
import TabBar from "./TabBar";
import KpiCard from "./KpiCard";
import AgentStatusRow from "./AgentStatusRow";
import KanbanBoard from "./KanbanBoard";
import DocsBrowser from "./DocsBrowser";
import Timeline, { PhaseStrip } from "./Timeline";
import TaskQueue from "./TaskQueue";
import Toast from "./Toast";

/* ── Agent registry ── */
const AGENTS: AgentMap = {
  BA:  { code: "BA",  name: "Business Analyst",   color: "#7c95ff", role: "Requirements" },
  SA:  { code: "SA",  name: "Solution Architect", color: "#c57ff5", role: "Architecture" },
  DS:  { code: "DS",  name: "Designer",           color: "#FF6F91", role: "Design" },
  DEV: { code: "DEV", name: "Developer",          color: "#FFB547", role: "Engineering" },
  PM:  { code: "PM",  name: "Project Manager",    color: "#76ABAE", role: "Coordination" },
};

/* ── Hardcoded v1 timeline data ── */
const PHASES: Phase[] = [
  { num: "1", label: "Foundation",  state: "done",     dates: "May 2025",     pct: 100 },
  { num: "2", label: "Core Agents", state: "active",   dates: "May–Jun 2026", pct: 65  },
  { num: "3", label: "Dashboard",   state: "active",   dates: "Jun 2026",     pct: 30  },
  { num: "4", label: "Release",     state: "upcoming", dates: "Jul 2026",     pct: 0   },
];

const MILESTONES: Milestone[] = [
  { phase: 1, date: "May 2025", title: "Repo initialized",         agent: "SA",  status: "done"     },
  { phase: 1, date: "May 2025", title: "Plugin system built",      agent: "DEV", status: "done"     },
  { phase: 2, date: "May 2026", title: "BA / SA agents live",      agent: "BA",  status: "done"     },
  { phase: 2, date: "May 2026", title: "DS / DEV agents live",     agent: "DS",  status: "done"     },
  { phase: 3, date: "Jun 2026", title: "Dashboard Vite migration", agent: "DEV", status: "active"   },
  { phase: 3, date: "Jun 2026", title: "KPI + board live",         agent: "PM",  status: "upcoming" },
  { phase: 4, date: "Jul 2026", title: "v1.5.0 release",           agent: "PM",  status: "upcoming" },
];

/* ── Board column definitions ── */
const COLUMN_DEFS = [
  { key: "Backlog",      title: "Backlog",      color: "var(--muted)"  },
  { key: "In Progress",  title: "In Progress",  color: "var(--amber)"  },
  { key: "Review",       title: "Review",       color: "var(--accent)" },
  { key: "Done",         title: "Done",         color: "var(--green)"  },
];

/* ── Doc group labels ── */
const DOC_LABELS: Record<string, string> = {
  BA:   "Business Analyst",
  SA:   "Solution Architect",
  DS:   "Designer",
  DEV:  "Developer",
  PM:   "Project Manager",
  SPEC: "Spec Docs",
};

/* ── Local types ── */
type Config = { project_name?: string; project_type?: string; neo_agents_version?: string };
type RawTask = {
  id: string; title: string; agent: string; column: string;
  status: string; prio?: string; effort?: string;
  updated_at?: string; date?: string;
};

/* ── Token helper (passed in URL query when access_token is set) ── */
function getToken(): string {
  return new URLSearchParams(window.location.search).get("token") ?? "";
}

/* ── Markdown → DocContent parser ── */
function parseMd(md: string, breadcrumb: string[]): DocContent {
  let text = md.trim();
  let frontmatter: Record<string, string | number> | undefined;

  if (text.startsWith("---")) {
    const end = text.indexOf("\n---", 3);
    if (end !== -1) {
      const fmText = text.slice(3, end).trim();
      frontmatter = {};
      for (const line of fmText.split("\n")) {
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0) {
          const k = line.slice(0, colonIdx).trim();
          const v = line.slice(colonIdx + 1).trim();
          frontmatter[k] = v;
        }
      }
      text = text.slice(end + 4).trim();
    }
  }

  let title: string | undefined;
  const body: DocBlock[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let titleFound = false;

  for (const line of text.split("\n")) {
    if (line.startsWith("```")) {
      if (inCode) {
        body.push({ t: "code", c: codeLines.join("\n") });
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }
    if (!titleFound && line.startsWith("# ")) {
      title = line.slice(2).trim();
      titleFound = true;
      continue;
    }
    if (line.startsWith("## "))      body.push({ t: "h2", c: line.slice(3).trim() });
    else if (line.startsWith("### ")) body.push({ t: "h3", c: line.slice(4).trim() });
    else if (line.trim())             body.push({ t: "p",  c: line.trim() });
  }

  return { title, breadcrumb, frontmatter, body };
}

/* ════════════════════════════════════════════════
   App
   ════════════════════════════════════════════════ */
export default function App() {
  const [config,       setConfig]       = useState<Config | null>(null);
  const [tasks,        setTasks]        = useState<RawTask[]>([]);
  const [docs,         setDocs]         = useState<Record<string, string[]>>({});
  const [doc,          setDoc]          = useState<DocContent | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState("overview");
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);
  const [toast,        setToast]        = useState<string | null>(null);

  /* ── Data fetching ── */
  const fetchAll = useCallback(async () => {
    const token = getToken();
    const qs    = token ? `?token=${token}` : "";
    try {
      const [cfgRes, tasksRes, docsRes] = await Promise.all([
        fetch(`/api/config${qs}`),
        fetch(`/api/tasks${qs}`),
        fetch(`/api/docs${qs}`),
      ]);
      if (cfgRes.ok)   setConfig(await cfgRes.json());
      if (tasksRes.ok) { const d = await tasksRes.json(); setTasks(d.tasks ?? []); }
      if (docsRes.ok)  setDocs(await docsRes.json());
    } catch { /* swallow — no network, server not yet started */ }
  }, []);

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
    const id = setInterval(fetchAll, 5000);
    return () => clearInterval(id);
  }, [fetchAll]);

  /* ── Derived state ── */
  const columns: BoardColumn[] = COLUMN_DEFS.map(col => ({
    ...col,
    cards: tasks
      .filter(t => t.column === col.key)
      .map(t => ({
        id: t.id, title: t.title, agent: t.agent,
        prio:   (t.prio ?? "med") as Priority,
        effort: t.effort as Effort | undefined,
        date:   t.date,
      })),
  }));

  const docGroups: DocGroup[] = Object.entries(docs)
    .filter(([, files]) => files.length > 0)
    .map(([code, files]) => ({
      code,
      label: DOC_LABELS[code] ?? code,
      color: AGENTS[code]?.color,
      files: files.map(name => ({ name })),
    }));

  const queueItems: QueueItem[] = [...tasks].reverse().slice(0, 8).map(t => ({
    id: t.id, title: t.title, agent: t.agent,
    status: t.column === "Done" ? "done" : t.column === "In Progress" ? "running" : "queued",
    ts: t.updated_at ? new Date(t.updated_at).toLocaleDateString() : "",
  }));

  const agentStatuses = Object.keys(AGENTS).map(code => {
    const agentTasks = tasks.filter(t => t.agent === code);
    const done       = agentTasks.filter(t => t.column === "Done").length;
    const inProgress = agentTasks.some(t => t.column === "In Progress");
    const pct        = agentTasks.length > 0 ? Math.round((done / agentTasks.length) * 100) : 0;
    const status: AgentRunState = inProgress ? "running" : (pct >= 100 && agentTasks.length > 0) ? "done" : "idle";
    return { code, pct, files: agentTasks.length, status };
  });

  const TABS: TabItem[] = [
    { key: "overview",  label: "Overview"                   },
    { key: "board",     label: "Board",    count: tasks.length },
    { key: "docs",      label: "Docs"                       },
    { key: "timeline",  label: "Timeline"                   },
    { key: "terminal",  label: "Terminal"                   },
  ];

  /* ── Handlers ── */
  async function handleDocSelect(file: DocFile, group: DocGroup) {
    const token  = getToken();
    const p      = `.ai-agents/docs/${group.code}/${file.name}`;
    const qs     = token ? `&token=${token}` : "";
    try {
      const res = await fetch(`/api/doc?path=${encodeURIComponent(p)}${qs}`);
      if (!res.ok) return;
      const md = await res.text();
      setDoc(parseMd(md, [DOC_LABELS[group.code] ?? group.code, file.name]));
    } catch { /* ignore */ }
  }

  async function handleTaskMove(task: BoardTask, column: string) {
    const token = getToken();
    const body: Record<string, string> = { id: task.id, column };
    if (token) body.token = token;
    try {
      await fetch("/api/task/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setToast(`Moved to ${column}`);
      fetchAll();
    } catch { /* ignore */ }
    setSelectedTask(null);
  }

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg)] text-[var(--muted)] text-[13px]">
        Loading…
      </div>
    );
  }

  /* ── Shell ── */
  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] overflow-hidden">
      <DashboardHeader
        project={config?.project_name}
        projectType={config?.project_type}
        version={config?.neo_agents_version}
        taskCount={tasks.length}
        user={{ name: "User", initial: "U" }}
      />
      <TabBar tabs={TABS} value={activeTab} onChange={setActiveTab} />

      <main className="flex-1 overflow-auto bg-[var(--bg)]">
        <div className="p-6 max-w-[1480px] mx-auto">

          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-[14px]">
              {/* KPI row */}
              <div className="grid grid-cols-4 gap-[14px]">
                <KpiCard label="Total Tasks"  value={tasks.length}                                          tone="default" />
                <KpiCard label="Done"         value={tasks.filter(t => t.column === "Done").length}         tone="green"   />
                <KpiCard label="In Progress"  value={tasks.filter(t => t.column === "In Progress").length}  tone="amber"   />
                <KpiCard label="In Review"    value={tasks.filter(t => t.column === "Review").length}       tone="accent"  />
              </div>

              {/* Agent status + recent tasks */}
              <div className="grid grid-cols-[1.1fr_1fr] gap-[14px]">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] overflow-hidden">
                  <div className="px-5 py-[14px] border-b border-[var(--border)] flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[var(--text)]">Agent Status</span>
                  </div>
                  {agentStatuses.map((a, i) => (
                    <AgentStatusRow
                      key={a.code}
                      agent={a.code}
                      agents={AGENTS}
                      pct={a.pct}
                      files={a.files}
                      status={a.status}
                      divider={i < agentStatuses.length - 1}
                    />
                  ))}
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] overflow-hidden">
                  <div className="px-5 py-[14px] border-b border-[var(--border)]">
                    <span className="text-[13px] font-bold text-[var(--text)]">Recent Tasks</span>
                  </div>
                  <TaskQueue
                    items={queueItems}
                    agents={AGENTS}
                    onOpen={() => { setActiveTab("board"); }}
                  />
                </div>
              </div>

              {/* Pipeline bar */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-5 py-[18px]">
                <div className="text-[11px] text-[var(--muted)] uppercase tracking-[0.06em] mb-3">Pipeline</div>
                <div className="flex gap-1 h-2">
                  {COLUMN_DEFS.map(col => {
                    const count = tasks.filter(t => t.column === col.key).length;
                    const pct   = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                    return (
                      <div
                        key={col.key}
                        title={`${col.title}: ${count}`}
                        className="h-full rounded-[2px] transition-all"
                        style={{ width: pct + "%", background: col.color, minWidth: pct > 0 ? 4 : 0 }}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-2">
                  {COLUMN_DEFS.map(col => (
                    <span key={col.key} className="flex items-center gap-[6px] text-[10.5px] text-[var(--muted)]">
                      <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                      {col.title} · {tasks.filter(t => t.column === col.key).length}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Board ── */}
          {activeTab === "board" && (
            <KanbanBoard
              columns={columns}
              agents={AGENTS}
              onCardClick={setSelectedTask}
              height="calc(100vh - 160px)"
            />
          )}

          {/* ── Docs ── */}
          {activeTab === "docs" && (
            <DocsBrowser
              groups={docGroups}
              agents={AGENTS}
              doc={doc}
              onSelect={handleDocSelect}
              onDownload={doc ? () => {
                const blob = new Blob(
                  [(doc.breadcrumb?.join(" / ") ?? "") + "\n\n" + (doc.body?.map(b => b.c).join("\n") ?? "")],
                  { type: "text/plain" }
                );
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = (doc.breadcrumb?.at(-1) ?? "doc") + ".txt";
                a.click();
              } : undefined}
              height="calc(100vh - 160px)"
            />
          )}

          {/* ── Timeline ── */}
          {activeTab === "timeline" && (
            <div className="flex flex-col gap-[14px]">
              <PhaseStrip phases={PHASES} />
              <Timeline milestones={MILESTONES} agents={AGENTS} />
            </div>
          )}

          {/* ── Terminal ── */}
          {activeTab === "terminal" && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-8 py-10 text-center">
              <div className="text-[var(--muted)] text-[13px] mb-2 font-[var(--mono)]">$</div>
              <div className="text-[var(--text-soft)] text-[14px] font-semibold mb-1">
                Terminal — coming in v2 (requires node-pty)
              </div>
              <div className="text-[var(--muted)] text-[12px]">
                An embedded shell will connect to the agent runner in a future release.
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast}
          tone="success"
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Task move modal ── */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-6 w-[340px] shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-[13px] font-bold text-[var(--text)] mb-1 truncate">{selectedTask.title}</div>
            <div className="text-[11px] text-[var(--muted)] mb-4">Move to column:</div>
            <div className="flex flex-col gap-2">
              {COLUMN_DEFS.map(col => (
                <button
                  key={col.key}
                  onClick={() => handleTaskMove(selectedTask, col.key)}
                  className="text-left px-4 py-[10px] rounded-[7px] bg-[var(--surface-2)] border border-[var(--border)] text-[12px] text-[var(--text)] hover:border-[var(--border-bright)] hover:bg-[var(--surface-3)] transition-colors flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: col.color }} />
                  {col.title}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="mt-4 text-[11px] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
