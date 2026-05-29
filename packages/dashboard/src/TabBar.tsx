// filename: TabBar.tsx
import React, { useState } from "react";
import type { TabItem } from "./types";

export interface TabBarProps {
  tabs: TabItem[];
  /** Controlled active key. Omit to let the component manage its own state. */
  value?: string;
  /** Initial active key when uncontrolled. */
  defaultValue?: string;
  onChange?: (key: string) => void;
}

/** Underlined tab bar. Controlled (via `value`) or self-managing (via `defaultValue`). */
export default function TabBar({ tabs, value, defaultValue, onChange }: TabBarProps) {
  const isControlled = value != null;
  const [internal, setInternal] = useState<string>(defaultValue != null ? defaultValue : (tabs[0] && tabs[0].key));
  const active = isControlled ? value : internal;

  const select = (k: string) => {
    if (!isControlled) setInternal(k);
    onChange && onChange(k);
  };

  return (
    <div className="flex items-stretch px-5 bg-[var(--surface)] border-b border-[var(--border)]">
      {tabs.map((t) => {
        const on = active === t.key;
        const Ico = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => select(t.key)}
            className={"inline-flex items-center gap-2 px-[18px] h-12 text-[12px] tracking-[0.02em] uppercase font-medium border-b-2 transition-colors " +
              (on ? "text-[var(--accent)] border-[var(--accent)]" : "text-[var(--muted)] border-transparent hover:text-[var(--text-soft)]")}
          >
            {Ico && <Ico />}
            <span>{t.label}</span>
            {t.count != null && (
              <span className={"text-[10px] rounded-full px-[7px] py-px border " +
                (on ? "text-[var(--accent)] border-[rgba(118,171,174,0.3)] bg-[var(--accent-soft)]" : "text-[var(--muted)] border-[var(--border)] bg-[var(--surface-2)]")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
