// filename: icons.tsx
// Inline-SVG icon set. Self-contained, currentColor-driven, no dependencies.
import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export const SearchIcon: React.FC<IconProps> = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
export const ChevronIcon: React.FC<IconProps> = (p) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const DocIcon: React.FC<IconProps> = (p) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
);
export const DownloadIcon: React.FC<IconProps> = (p) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const ListIcon: React.FC<IconProps> = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
export const BoardIcon: React.FC<IconProps> = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="6" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" /><rect x="11" y="4" width="6" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" /><rect x="19" y="4" width="2" height="16" rx="1" stroke="currentColor" strokeWidth="1.6" /></svg>
);
export const TimeIcon: React.FC<IconProps> = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
export const ChatIcon: React.FC<IconProps> = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M21 12a8 8 0 1 1-3.6-6.7L21 4l-1.3 3.7A8 8 0 0 1 21 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8 11h.01M12 11h.01M16 11h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
export const SendIcon: React.FC<IconProps> = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12l16-8-5 18-4-7-7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
);
export const BellIcon: React.FC<IconProps> = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
export const CheckIcon: React.FC<IconProps> = (p) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const InboxIcon: React.FC<IconProps> = (p) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 13l2.5-7h11L20 13M4 13v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M4 13h4l1.5 2.5h5L16 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" /></svg>
);
export const TerminalIcon: React.FC<IconProps> = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><rect x="2" y="3" width="20" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M6 9l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 18h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
