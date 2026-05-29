# Neo Agents AI — Component Library

Self-contained React + TypeScript components for the Neo Agents AI Claude Code plugin dashboard. Dark theme only, styled with Tailwind arbitrary values that read the app's CSS variables directly (`bg-[var(--surface)]`, `text-[var(--muted)]`, …).

## Setup

1. Make sure the CSS variables and fonts from the spec are defined globally (the `:root { --bg … }` block and the DM Sans / DM Mono `@font-face` / Google Fonts link).
2. Import the keyframes + bubble styles once at app root:
   ```ts
   import "./styles.css";
   ```
3. Import components from the barrel:
   ```tsx
   import { KanbanBoard, ChatPanel, type AgentMap } from "./";
   ```

## Conventions

- **Props-driven** — no hardcoded data. Pass your own `agents: AgentMap`; agent codes (`"BA"`, `"SA"`, `"DEV"`, …) resolve to color + name from that map, so the agent set is entirely yours.
- **Default export** per component; named exports for sub-parts (`ChatMessage`, `ApproveBanner`, `DocTree`, `DocViewer`, `PhaseStrip`) and all prop types.
- **Local state where it helps** — `TabBar` (uncontrolled or controlled), `DocTree` (collapse + search), `ChatPanel` (composer draft), `Toast` (auto-dismiss). Everything else is presentational and fires callbacks.
- **Inline SVG** icons in `icons.tsx` — `currentColor`-driven, no dependencies.

## Components

| File | Export | Notes |
|------|--------|-------|
| `AgentBadge.tsx` | `AgentBadge` | Monogram tile; `size` / `radius` props |
| `StatusPill.tsx` | `StatusPill` | backlog / queued / progress / running / review / done |
| `KpiCard.tsx` | `KpiCard` | tone-colored stat tile |
| `DashboardHeader.tsx` | `DashboardHeader` | top app bar |
| `TabBar.tsx` | `TabBar` | controlled or self-managing |
| `TaskQueue.tsx` | `TaskQueue` | run queue + built-in empty state |
| `AgentStatusRow.tsx` | `AgentStatusRow` | live agent row w/ progress |
| `TaskCard.tsx` / `KanbanBoard.tsx` | `TaskCard`, `KanbanBoard` | four-column board |
| `ChatPanel.tsx` | `ChatPanel`, `ChatMessage`, `ApproveBanner` | conversation surface |
| `DocsBrowser.tsx` | `DocsBrowser`, `DocTree`, `DocViewer` | docs tree + viewer |
| `Timeline.tsx` | `Timeline`, `PhaseStrip` | phase strip + milestones |
| `EmptyState.tsx` / `Toast.tsx` | `EmptyState`, `Toast` | placeholders + notifications |

A live preview of every component (rendered from sample props) is in **`Neo Agents AI — Components.html`** at the project root.
