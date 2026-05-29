// filename: ChatPanel.tsx
import React, { useState, useEffect, useRef } from "react";
import type { AgentMap, ChatMessageData, ApprovalData } from "./types";
import AgentBadge from "./AgentBadge";
import { CheckIcon, SendIcon } from "./icons";

/* ---------- ChatMessage ---------- */
export interface ChatMessageProps {
  msg: ChatMessageData;
  agents?: AgentMap;
}
export function ChatMessage({ msg, agents }: ChatMessageProps) {
  const isUser = msg.role === "user";
  const a = !isUser && agents && msg.agent ? agents[msg.agent] : undefined;
  const color = (a && a.color) || "var(--accent)";
  const roleName = isUser ? "You" : (a && a.name) || msg.name || msg.agent || "Agent";

  return (
    <div className={"flex flex-col gap-[6px] max-w-[760px] " + (isUser ? "self-end items-end" : "self-start")}>
      <div className="flex items-center gap-2 text-[10px] text-[var(--muted)]">
        {!isUser && msg.agent && <AgentBadge code={msg.agent} agents={agents} size={18} radius={5} />}
        <span className="font-medium" style={{ color: isUser ? "var(--accent)" : "var(--text-soft)" }}>{roleName}</span>
        {msg.ts && <span>{msg.ts}</span>}
      </div>
      {msg.typing ? (
        <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[8px] px-[14px] py-3 inline-flex items-center gap-[5px]" style={{ borderLeft: "2px solid " + color }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-[6px] h-[6px] rounded-full bg-[var(--muted)]" style={{ animation: "typingDot 1.1s ease-in-out infinite", animationDelay: i * 0.15 + "s" }} />
          ))}
        </div>
      ) : (
        <div
          className={"chat-bubble border border-[var(--border)] rounded-[8px] px-[14px] py-3 text-[12px] leading-[1.65] text-[var(--text-soft)] max-w-[680px] " +
            (isUser ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)]")}
          style={isUser ? { borderRight: "2px solid var(--accent)" } : { borderLeft: "2px solid " + color }}
          {...(msg.html ? { dangerouslySetInnerHTML: { __html: msg.html } } : {})}
        >
          {msg.html ? null : msg.text}
        </div>
      )}
    </div>
  );
}

/* ---------- ApproveBanner ---------- */
export interface ApproveBannerProps extends ApprovalData {
  onApprove?: () => void;
  onReject?: () => void;
}
export function ApproveBanner({ label, title, onApprove, onReject, approveLabel = "Approve & queue", rejectLabel = "Revise" }: ApproveBannerProps) {
  return (
    <div className="mx-5 mb-[14px] bg-[var(--surface-2)] border border-[var(--border)] border-l-[3px] border-l-[var(--accent)] rounded-[8px] pl-4 pr-[14px] py-3 flex items-center gap-[14px]">
      <div className="flex-1 flex flex-col gap-[2px] min-w-0">
        <span className="text-[9.5px] tracking-[0.1em] uppercase text-[var(--accent)]">{label}</span>
        <span className="text-[13px] font-semibold text-[var(--text)] truncate">{title}</span>
      </div>
      <button onClick={onReject} className="bg-transparent text-[var(--muted)] px-3 py-2 rounded-[7px] text-[11px] border border-[var(--border)] hover:text-[var(--text-soft)] hover:border-[var(--border-bright)] transition-colors">{rejectLabel}</button>
      <button onClick={onApprove} className="bg-[var(--accent)] text-[#0e1218] px-[14px] py-2 rounded-[7px] text-[11px] font-medium tracking-[0.03em] inline-flex items-center gap-[6px] hover:bg-[#86bdc0] transition-colors">
        <CheckIcon /> {approveLabel}
      </button>
    </div>
  );
}

/* ---------- ChatPanel ---------- */
export interface ChatPanelProps {
  /** Header agent code. */
  agent: string;
  agents?: AgentMap;
  messages: ChatMessageData[];
  /** Show an approval banner above the composer. */
  approval?: ApprovalData;
  placeholder?: string;
  onSend?: (text: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSave?: () => void;
}

/** Full conversation surface — bubbles, typing indicator, approval banner, composer. */
export default function ChatPanel({ agent, agents, messages = [], approval, placeholder = "Message the agent…", onSend, onApprove, onReject, onSave }: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);
  const a = agents && agents[agent];

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages.length]);

  const submit = () => {
    const v = draft.trim();
    if (!v) return;
    onSend && onSend(v);
    setDraft("");
  };
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] flex flex-col min-h-0 overflow-hidden h-full">
      <div className="px-5 py-[14px] border-b border-[var(--border)] flex items-center gap-3">
        <AgentBadge code={agent} agents={agents} size={30} radius={7} />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[14px] font-bold text-[var(--text)]">{(a && a.name) || agent}</span>
          {a && a.role && <span className="text-[10.5px] text-[var(--muted)]">{a.role}</span>}
        </div>
        <span className="text-[10.5px] text-[var(--muted)]">{messages.length} messages</span>
      </div>

      <div ref={feedRef} className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-[18px] min-h-0">
        {messages.map((m) => <ChatMessage key={m.id} msg={m} agents={agents} />)}
      </div>

      {approval && <ApproveBanner {...approval} onApprove={onApprove} onReject={onReject} />}

      <div className="px-5 pt-[14px] pb-[18px] border-t border-[var(--border)] flex flex-col gap-[10px] bg-[var(--surface)]">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          rows={2}
          placeholder={placeholder}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[8px] px-[14px] py-[11px] text-[12px] text-[var(--text)] outline-none resize-none leading-[1.5] transition-colors focus:border-[var(--accent)] placeholder:text-[var(--muted)]"
        />
        <div className="flex items-center gap-[10px] text-[10.5px] text-[var(--muted)]">
          <span>⏎ to send · ⇧⏎ newline</span>
          <span className="flex-1" />
          {onSave && (
            <button onClick={onSave} className="bg-[var(--surface-2)] text-[var(--text-soft)] px-3 py-[7px] rounded-[7px] border border-[var(--border)] text-[11px] inline-flex items-center gap-[6px] hover:bg-[var(--surface-3)] hover:border-[var(--border-bright)] transition-colors">Save draft</button>
          )}
          <button onClick={submit} className="bg-[var(--accent)] text-[#0e1218] px-4 py-[7px] rounded-[7px] text-[11px] font-medium tracking-[0.03em] inline-flex items-center gap-[6px] hover:bg-[#86bdc0] transition-colors">
            <SendIcon /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
