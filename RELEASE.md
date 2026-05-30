# Release Notes — v1.5.1

**Released:** 2026-05-30
**Branch:** main
**Type:** v1 — Full release

---

## What's New

### v1 is shipped — UAT passed

All v1 acceptance criteria met and verified end-to-end.

---

## What's Included in v1.5.1

### BA Agent (`/neo:ba`)
- Interactive interview — 3–7 questions, one at a time
- Full BRD output: Feature Overview, User Stories (Given/When/Then), Process Flows, Edge Cases, Open Questions
- BRD saved to `.ai-agents/docs/BA/`
- SPEC file created/appended at `.ai-agents/docs/SPEC/`
- `tasks.json` updated automatically

### Setup (`/neo:setup`)
- Auto-detects 10 stack types: Next.js, React, Vue, Node.js, Django, FastAPI, Python, Flutter, Static HTML, Generic
- Generates `config.json` with access token
- Creates full `.ai-agents/docs/` folder structure
- Re-run prompts update confirmation — never overwrites silently

### Dashboard (`/neo:dashboard`)
- Single-file `packages/dashboard/dist/index.html` — no build step, works offline
- 5 tabs: Overview, Board, Docs, Timeline, Task Detail modal
- Live API wiring — polls `tasks.json` every 5s
- Move tasks between columns — updates `tasks.json` instantly
- Stop Server button with confirmation popover → `POST /api/shutdown`
- PID file management — stale server detection, auto-kill on restart
- Binds to `127.0.0.1` only — never exposed externally

### Core (`packages/core`)
- All file I/O via Node.js — no Python3 required
- `write-brd`, `write-spec`, `update-tasks`, `write-config`, `detect-stack`

---

## Agents Status

| Agent | Status |
|---|---|
| BA — Business Analyst | ✅ v1 active |
| Dashboard | ✅ v1 active |
| SA — Solution Architect | 🔲 v2 |
| DS — Designer | 🔲 v2 |
| DEV — Engineer | 🔲 v2 |
| PM — Planner | 🔲 v2 |

---

## What's Next — v2.0

- `/neo:sa` — Solution Architect: BRD → SSD (API endpoints, data model, technical risks, design_required decision)
- `/neo:ds` — Designer: BRD + SSD → Claude Design prompt
- `/neo:dev` — Engineer: full context → Implementation File for Claude Code
- `/neo:pm` — Planner: passive task board tracker

---

*Neo Agents AI v1.5.1 — [GitHub](https://github.com/jameskwi/Neo-Agents-AI)*
