# Neo Agents AI

> **Your AI crew — BA, SA, Designer, Engineer, PM — inside any project.**

Drop Neo Agents AI into any project and get an interactive crew of role-based AI agents. They interview you before producing output — no assumptions, no generic templates. Works on any stack, any size, zero configuration.

---

## What It Does

Instead of hiring a BA, SA, Designer, or Engineer — you have an AI crew that fills those roles **inside your project**. Agents behave like real consultants: they ask targeted questions, dig into your codebase, and only produce structured output when they truly understand the need.

The pipeline ends with a prompt you paste into Claude Code to build the feature.

---

## Requirements

| Requirement | Version |
|---|---|
| [Claude Code](https://claude.ai/code) | 1.0.0+ |
| [Python 3](https://python.org/downloads) | 3.8+ |
| [Node.js](https://nodejs.org) | 16+ |

---

## Install

```bash
/plugin marketplace add jameskwi/neo-agents-ai
/plugin install neo-agents-ai
```

---

## Quick Start

**1. Set up in your project (once)**
```bash
/neo:setup
```
Auto-detects your stack, creates `.ai-agents/` config and folder structure. Works on Next.js, React, Vue, Python, FastAPI, Django, Flutter, static sites, and generic projects.

**2. Run your first feature**
```bash
/neo:ba "add drag/drop reordering to the products list"
```
The BA agent reads your project context, interviews you with 3–7 targeted questions, then produces a full Business Requirements Document (BRD).

**3. Open the dashboard**
```bash
/neo:dashboard
```
Opens at `http://localhost:7842` — live task board, all agent docs, markdown viewer.

---

## Agents

### v1 — Active Now

| Agent | Command | What it does |
|---|---|---|
| **BA** — Business Analyst | `/neo:ba "idea"` | Interviews you → writes full BRD with user stories, process flows, edge cases |
| **SA** — Solution Architect | `/neo:sa` | Reads BRD → writes SSD: API endpoints, data model, technical risks |
| **Dashboard** | `/neo:dashboard` | Live board: task status, all agent docs, move tasks between columns |

### v2 — Coming Next

| Agent | Command | What it does |
|---|---|---|
| **DS** — Designer | `/neo:ds` | Reads BRD + SSD → writes a ready-to-run Claude Design prompt |
| **DEV** — Engineer | `/neo:dev` | Reads full context → writes Implementation File for Claude Code |
| **PM** — Project Manager | passive | Auto-tracks task board, sprint state, pipeline progress |

---

## How the BA Agent Works

```
/neo:ba "your feature idea"
         │
         ▼
  Reads config + scans project
         │
         ▼
  Asks 3–7 questions, one at a time
         │
         ▼
  You answer each question
         │
         ▼
  Writes full BRD
         │
         ▼
  Saves to .ai-agents/docs/BA/
  Appends to .ai-agents/docs/SPEC/
  Updates .ai-agents/tasks.json
         │
         ▼
  Dashboard updates automatically
```

**BRD includes:** Feature Overview · User Stories (Given/When/Then) · Process Flows · Edge Cases & Error States · Open Questions

---

## Dashboard

The dashboard runs locally on `localhost:7842`. No internet connection required.

**Tabs:**
- **Overview** — KPIs, agent activity, recent tasks, pipeline bar
- **Board** — Kanban: Backlog / In Progress / Review / Done — drag tasks between columns
- **Docs** — Browse and read all agent output files (formatted markdown)
- **Timeline** — Milestone tracker for v1 delivery phases

**Security:** Binds to `127.0.0.1` only. Never exposed externally.

---

## Project Structure

After `/neo:setup`, your project gets:

```
your-project/
└── .ai-agents/
    ├── config.json        ← auto-generated project config
    ├── tasks.json         ← task board state
    └── docs/
        ├── BA/            ← Business Analyst outputs
        ├── SA/            ← Solution Architect outputs  (v2)
        ├── DS/            ← Designer prompts            (v2)
        ├── SE/            ← Engineer implementation     (v2)
        ├── PL/            ← PM tracking docs            (v2)
        └── SPEC/          ← Shared spec per task
```

All output is plain markdown — readable in any editor, committable to git.

---

## Plugin Structure

```
neo-agents-ai/
├── .claude-plugin/
│   ├── plugin.json          ← plugin manifest
│   └── marketplace.json     ← marketplace listing
├── agents/
│   ├── business-analyst.md  ← BA agent definition
│   ├── solution-architect.md
│   ├── designer.md
│   ├── engineer.md
│   └── planner.md
├── skills/
│   ├── setup.md             ← /neo:setup
│   ├── ba.md                ← /neo:ba
│   ├── sa.md                ← /neo:sa
│   ├── ds.md                ← /neo:ds
│   ├── dev.md               ← /neo:dev
│   └── dashboard.md         ← /neo:dashboard
├── dashboard/
│   ├── index.html           ← React dashboard UI
│   └── server.js            ← local Node.js server
├── CLAUDE.md                ← global rules for all agents
└── README.md
```

---

## Supported Stacks

| Stack | Detection Signal |
|---|---|
| Next.js | `next.config.js` or `next.config.ts` |
| React | `package.json` + react dependency |
| Vue | `package.json` + vue dependency |
| Node.js | `package.json` (no framework match) |
| Python / Django | `manage.py` |
| Python / FastAPI | `main.py` + fastapi in requirements |
| Python (generic) | `requirements.txt` or `pyproject.toml` |
| Flutter | `pubspec.yaml` |
| Static HTML | `index.html` at root, no package.json |
| Generic | fallback — all agents still work |

---

## Commands Reference

| Command | Description |
|---|---|
| `/neo:setup` | Initialize project — auto-detect stack, create config + folder structure |
| `/neo:ba "idea"` | Run BA agent — interview + BRD |
| `/neo:sa` | Run SA agent — BRD → SSD *(v2)* |
| `/neo:ds` | Run DS agent — SSD → Design prompt *(v2)* |
| `/neo:dev` | Run DEV agent — full context → Implementation File *(v2)* |
| `/neo:dashboard` | Launch dashboard at localhost:7842 |

---

## FAQ

**Does this work on an existing project?**
Yes. `/neo:setup` reads your existing project — it never modifies your code.

**Can I commit `.ai-agents/` to git?**
Yes. All files are plain UTF-8 markdown and JSON. Recommended to commit.

**What if my stack isn't detected?**
Falls back to `Generic` type. All agents work — questions just aren't stack-specific.

**Does the dashboard need internet?**
The server and data are fully local — no data leaves your machine. The dashboard UI loads React and fonts from CDN (unpkg.com, fonts.googleapis.com), so an internet connection is needed for the first load. CDN assets are browser-cached after that.

**Can I re-run setup on an existing project?**
Yes. You'll be prompted: `Config exists. Update? [y/n]` — existing config is backed up before any change.

---

## Changelog

### v1.4.0 — May 2026
- Access token validation on all `/api/*` dashboard routes (token read from `config.json`, passed in URL by `/neo:dashboard`)
- Directory naming corrected: `SE` → `DEV`, `PL` → `PM` across all agents, skills, server, and dashboard
- Root `.claude-plugin/plugin.json` now complete with all commands, agents, runtime, and dashboard blocks
- `/neo:pm` skill stub added
- Dynamic timeline: milestone status derived from actual doc presence rather than hardcoded dates
- Dashboard CORS restricted from `*` to `localhost` only
- `.gitignore` extended with `node_modules/`, logs, OS artifacts

### v1.3.0 — May 2026
- Dashboard v1: task board, doc viewer, timeline, task detail modal
- `server.js` local Node.js server with full API (`/api/config`, `/api/tasks`, `/api/docs`, `/api/doc`, `/api/task/move`)
- Path traversal protection on `/api/doc`
- `plugin.json`: added `dashboard` block, `requires_nodejs` runtime flag
- `business-analyst.md`: fixed deprecated `datetime.utcnow()` → `datetime.now(datetime.UTC)`

### v1.2.0 — May 2026
- BA agent v1.2: interview loop (3–7 questions, one at a time), full BRD output
- BRD quality gates: 9 checks before save
- Python3 file save scripts: BRD, SPEC append, tasks.json update
- `/neo:ba` skill with pre-flight checks and handoff to BA agent

### v1.1.0 — May 2026
- `/neo:setup` with auto-detection for 10 stack types
- `config.json` generation with access token
- Full `.ai-agents/docs/` folder structure initialization

### v1.0.0 — May 2026
- Plugin scaffold: `.claude-plugin/`, `CLAUDE.md`, agent + skill folder structure
- M1 complete: plugin installs without errors

---

## License

MIT — [jameskwi](https://github.com/jameskwi)

---

*Neo Agents AI — v1.4.0 | [GitHub](https://github.com/jameskwi/Neo-Agents-AI)*