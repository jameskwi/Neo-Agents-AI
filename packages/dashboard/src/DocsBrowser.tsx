// filename: DocsBrowser.tsx
import React, { useState } from "react";
import type { AgentMap, DocGroup, DocFile, DocContent } from "./types";
import EmptyState from "./EmptyState";
import { SearchIcon, ChevronIcon, DocIcon, DownloadIcon } from "./icons";

/* ---------- DocTree (self-managing collapse + search + active) ---------- */
export interface DocTreeProps {
  groups: DocGroup[];
  agents?: AgentMap;
  activeFile?: string;
  onSelect?: (file: DocFile, group: DocGroup) => void;
}
export function DocTree({ groups, agents, activeFile, onSelect }: DocTreeProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    groups.forEach((g, i) => { o[g.code] = i < 2; });
    return o;
  });
  const [query, setQuery] = useState("");

  const toggle = (code: string) => setOpen((p) => ({ ...p, [code]: !p[code] }));
  const q = query.trim().toLowerCase();

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] flex flex-col min-h-0 overflow-hidden">
      <div className="m-3 flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-[7px] px-[10px] py-[7px] text-[var(--muted)]">
        <SearchIcon />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search docs…"
          className="flex-1 bg-transparent border-none outline-none text-[var(--text)] text-[11.5px] placeholder:text-[var(--muted)]" />
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {groups.map((g) => {
          const files = q ? g.files.filter((f) => f.name.toLowerCase().includes(q)) : g.files;
          if (q && files.length === 0) return null;
          const isOpen = q ? true : open[g.code];
          const color = (agents && agents[g.code] && agents[g.code].color) || g.color || "var(--muted)";
          return (
            <div key={g.code} className="mb-[2px]">
              <button onClick={() => toggle(g.code)} className="w-full flex items-center gap-2 px-[10px] py-[7px] rounded-[6px] hover:bg-[var(--surface-2)] transition-colors">
                <span className="w-[18px] h-[18px] rounded-[5px] inline-flex items-center justify-center text-[9px] font-medium text-[#0e1218]" style={{ background: color }}>{g.code}</span>
                <span className="text-[12px] text-[var(--text)] font-semibold flex-1 text-left truncate">{g.label}</span>
                <span className="text-[var(--muted)] transition-transform" style={{ transform: isOpen ? "rotate(90deg)" : "none" }}><ChevronIcon /></span>
              </button>
              {isOpen && (
                <div className="ml-[18px] pl-0 py-[2px] flex flex-col gap-px border-l border-dashed border-[var(--border)]">
                  {files.map((f) => {
                    const active = f.name === activeFile;
                    return (
                      <button key={f.name} onClick={() => onSelect && onSelect(f, g)}
                        className={"flex items-center gap-[7px] pl-[10px] pr-2 py-[5px] rounded-[4px] -ml-px border-l-2 text-left transition-colors " +
                          (active ? "text-[var(--accent)] border-[var(--accent)] bg-[rgba(118,171,174,0.07)]" : "text-[var(--muted)] border-transparent hover:text-[var(--text-soft)] hover:bg-[var(--surface-2)]")}>
                        <DocIcon />
                        <span className="text-[10.5px] flex-1 truncate">{f.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- DocViewer ---------- */
export interface DocViewerProps {
  doc?: DocContent | null;
  agents?: AgentMap;
  onDownload?: () => void;
}
export function DocViewer({ doc, onDownload }: DocViewerProps) {
  if (!doc) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] flex items-center justify-center">
        <EmptyState icon={<DocIcon />} title="Select a document" subtitle="Pick a file from the tree to preview it." />
      </div>
    );
  }
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] flex flex-col min-h-0 overflow-hidden">
      <div className="px-[22px] py-[14px] border-b border-[var(--border)] flex items-center gap-4">
        <div className="text-[11px] text-[var(--muted)] flex-1">
          {doc.breadcrumb && doc.breadcrumb.map((c, i) => (
            <span key={i}>
              {i > 0 && <span className="px-[6px] text-[var(--faint)]">/</span>}
              <b className={i === doc.breadcrumb!.length - 1 ? "text-[var(--text)] font-medium" : "font-normal"}>{c}</b>
            </span>
          ))}
        </div>
        <button onClick={onDownload} className="inline-flex items-center gap-[7px] bg-[var(--accent)] text-[#0e1218] px-[14px] py-[7px] rounded-[7px] text-[11px] font-medium tracking-[0.04em] hover:bg-[#86bdc0] transition-colors"><DownloadIcon /> Download</button>
      </div>
      <div className="flex-1 overflow-y-auto px-12 py-8">
        <div className="max-w-[760px] mx-auto">
          {doc.frontmatter && (
            <div className="bg-[rgba(118,171,174,0.06)] border border-[rgba(118,171,174,0.3)] border-l-[3px] rounded-[6px] px-[18px] py-[14px] mb-7 text-[11.5px] text-[var(--text-soft)] leading-[1.8] font-[var(--mono)]">
              {Object.entries(doc.frontmatter).map(([k, v]) => (
                <div key={k}><span className="text-[var(--accent)]">{k}:</span> {String(v)}</div>
              ))}
            </div>
          )}
          {doc.title && <h1 className="text-[30px] font-extrabold tracking-[-0.02em] mb-[10px] text-[var(--text)]">{doc.title}</h1>}
          {doc.body && doc.body.map((b, i) => {
            if (b.t === "h2") return <h2 key={i} className="text-[18px] font-bold mt-8 mb-[14px] pb-2 border-b border-[var(--border)] tracking-[-0.01em] text-[var(--text)]">{b.c}</h2>;
            if (b.t === "h3") return <h3 key={i} className="text-[14px] font-bold text-[var(--accent)] mt-[22px] mb-2">{b.c}</h3>;
            if (b.t === "code") return <pre key={i} className="bg-[#0e1218] border border-[var(--border)] rounded-[8px] px-[18px] py-4 text-[11.5px] leading-[1.7] text-[var(--text-soft)] overflow-x-auto my-4 font-[var(--mono)] whitespace-pre">{b.c}</pre>;
            return <p key={i} className={"text-[12.5px] leading-[1.75] mb-3 " + (b.lede ? "text-[var(--muted)]" : "text-[var(--text-soft)]")}>{b.c}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- DocsBrowser (composes tree + viewer, manages selection) ---------- */
export interface DocsBrowserProps {
  groups: DocGroup[];
  agents?: AgentMap;
  /** Content shown in the viewer (consumer-controlled). */
  doc?: DocContent | null;
  /** Initially-highlighted file in the tree. */
  initialFile?: string;
  onSelect?: (file: DocFile, group: DocGroup) => void;
  onDownload?: () => void;
  height?: number | string;
}
export default function DocsBrowser({ groups, agents, doc, initialFile, onSelect, onDownload, height }: DocsBrowserProps) {
  const [active, setActive] = useState<string | undefined>(
    initialFile || (doc && doc.breadcrumb && doc.breadcrumb[doc.breadcrumb.length - 1]) || undefined
  );
  const select = (f: DocFile, g: DocGroup) => { setActive(f.name); onSelect && onSelect(f, g); };
  return (
    <div className="grid grid-cols-[240px_1fr] gap-[14px]" style={{ height: height || "560px" }}>
      <DocTree groups={groups} agents={agents} activeFile={active} onSelect={select} />
      <DocViewer doc={doc} agents={agents} onDownload={onDownload} />
    </div>
  );
}
