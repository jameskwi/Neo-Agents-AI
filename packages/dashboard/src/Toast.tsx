// filename: Toast.tsx
import React, { useEffect } from "react";
import { CheckIcon } from "./icons";

export type ToastTone = "success" | "info" | "danger";

export interface ToastProps {
  message: string;
  tone?: ToastTone;
  /** Override the leading icon. */
  icon?: React.ReactNode;
  /** Auto-dismiss after N ms (calls onClose). Omit to keep it sticky. */
  duration?: number;
  onClose?: () => void;
  /** Render in flow instead of fixed-bottom-center. */
  inline?: boolean;
}

const TONE_BORDER: Record<ToastTone, string> = {
  success: "border-[rgba(76,175,120,0.4)] border-l-[var(--green)]",
  info:    "border-[rgba(118,171,174,0.4)] border-l-[var(--accent)]",
  danger:  "border-[rgba(255,87,34,0.4)] border-l-[var(--danger)]",
};
const TONE_ICON: Record<ToastTone, string> = {
  success: "var(--green)", info: "var(--accent)", danger: "var(--danger)",
};

/** Toast / inline status banner. Relies on the `toastIn` keyframe (see styles.css). */
export default function Toast({ message, tone = "success", icon, duration, onClose, inline = false }: ToastProps) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      className={"bg-[var(--surface-2)] border border-l-[3px] rounded-[8px] text-[var(--text)] text-[12px] px-[18px] py-[11px] inline-flex items-center gap-[10px] shadow-lg " + TONE_BORDER[tone] + (inline ? "" : " fixed bottom-6 left-1/2 -translate-x-1/2 z-50")}
      style={{ animation: "toastIn .25s ease-out" }}
      role="status"
    >
      <span style={{ color: TONE_ICON[tone] }} className="inline-flex">{icon || <CheckIcon />}</span>
      <span>{message}</span>
      {onClose && !duration && (
        <button onClick={onClose} className="ml-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors text-[14px] leading-none">×</button>
      )}
    </div>
  );
}
