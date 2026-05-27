# Neo Agents AI

> **Your AI crew — drop it in and they're ready.**

Instead of hiring a BA, SA, Designer, or Engineer — Neo Agents AI embeds a crew of role-based AI agents directly inside your project. Each agent behaves like a real consultant: they **interview you first**, challenge assumptions, and only produce structured output when they truly understand the need.

Works on **any project, any stack, any size** — no configuration required beyond install.

---

## What It Does

```
You:    /neo:ba "add drag/drop reordering to the products list"

BA:     "Who triggers this — the end customer or an internal admin?"
You:    "End customer."

BA:     "Should the order persist after page refresh, or session-only?"
You:    "It needs to persist."

BA:     "Is there an existing drag/drop component in this project?"
You:    "No, nothing yet."

BA:     ✅ Writing BRD...
        Saved → .ai-agents/docs/BA/2026-05-27-drag-drop-products.md
        Next:   /neo:sa to get the technical blueprint.
```

The BA doesn't guess. It asks. Then it writes.

---

## Agents

| Agent | Role | Status |
|---|---|---|
| **BA** | Interviews you → writes a full Business Requirements Document | ✅ v1 |
| **SA** | Reads BRD → writes technical blueprint (SSD) + flags if design is needed | v2 |
| **DS** | Reads BRD + SSD → writes a ready-to-run Claude Design prompt | v2 |
| **DEV** | Reads full context → writes the Implementation File for Claude Code | v2 |
| **PM** | Passive tracker — manages task board and project history | v2 |

---

## Install

```bash
/plugin marketplace add jameskwi/neo-agents-ai
/plugin install neo-agents-ai
```

**Requires:** Claude Code · Python3 · Node.js (for dashboard)

---

## Quick Start

```bash
# 1. Set up in your project (run once)
/neo:setup

# 2. Run the BA agent on your feature idea
/neo:ba "describe your feature here"

# 3. Open the dashboard
/neo:dashboard
```

That's it. Setup auto-detects your stack — no manual config.

---

## Commands

| Command | What it does |
|---|---|
| `/neo:setup` | Initialize Neo Agents in your project |
| `/neo:ba "idea"` | Run Business Analyst — interview → BRD |
| `/neo:sa` | Run Solution Architect — BRD → SSD *(v2)* |
| `/neo:ds` | Run Designer — BRD + SSD → Design prompt *(v2)* |
| `/neo:dev` | Run Engineer — full context → Implementation File *(v2)* |
| `/neo:dashboard` | Launch the task board in your browser |

---

## What Gets Created

```
your-project/
└── .ai-agents/
    ├── config.json        ← auto-generated project config
    ├── tasks.json         ← task board state
    └── docs/
        ├── BA/            ← Business Requirements Documents
        ├── SA/            ← Solution Design Documents
        ├── DS/            ← Designer prompts
        ├── SE/            ← Implementation Files
        └── SPEC/          ← Shared spec per task (all agents append here)
```

All output is **plain markdown** — readable in any editor, committable to git.

---

## Dashboard

```bash
/neo:dashboard
# Opens → http://localhost:7842
```

Shows your full task board (Backlog / In Progress / Review / Done) with all agent documents per task. Reads directly from `.ai-agents/` — no database, no sync, works offline.

![Dashboard v1 — Task Board](docs/assets/dashboard-preview.png)

---

## Supported Stacks

Auto-detected on `/neo:setup` — no manual config needed:

`Next.js` · `React` · `Vue` · `Node.js` · `Python / Django` · `Python / FastAPI` · `Flutter` · `Static HTML` · `Generic`

If your stack isn't detected, it falls back to `generic` — all agents still work.

---

## Why Not Just Use Claude.ai?

| | Neo Agents AI | Claude.ai |
|---|---|---|
| Lives inside your project | ✅ | ❌ |
| Reads your actual codebase | ✅ | ❌ |
| Saves structured docs automatically | ✅ | ❌ |
| Task board + history | ✅ | ❌ |
| Role-specific agent behavior | ✅ | ❌ |
| Interviews before producing output | ✅ | ❌ |

---

## Roadmap

- **v1** — Plugin scaffold · `/neo:setup` · BA agent (interview mode) · Dashboard (read + manage)
- **v2** — SA agent · DS agent · DEV agent · PM tracker · Full pipeline · Dashboard triggers
- **v3** — Multi-project · Team sharing · Timeline view · Mobile/responsive review agent

---

## Contributing

Issues and PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT © [jameskwi](https://github.com/jameskwi/Neo-Agents-AI)

---

*Neo Agents AI v1.0 — Works on any project, any stack, any size.*
