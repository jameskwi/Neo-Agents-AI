# Changelog

All notable changes to Neo Agents AI are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [v1.4.0] — 2026-05-28

Full release notes: [RELEASES/v1.4.0.md](RELEASES/v1.4.0.md)

### Added
- **M3: SA agent live** — `/neo:sa` runs a 3–5 question technical interview then produces a full Solution Design Document (SSD): API endpoints, data model changes, dependencies, technical risks, design_required decision
- `skills/sa.md` — pre-flight (config, task selection, BRD read) + handoff to SA agent
- `skills/pm.md` — PM skill stub, points to `/neo:dashboard` until M5 ships
- Dashboard access token auth — all `/api/*` routes now require `?token=` from `config.json`
- Dashboard `withToken()` helper — token extracted from URL, persisted to `sessionStorage`
- Dashboard CORS restricted to `http://localhost:{port}` (was `*`)
- Dashboard timeline now data-driven — milestone statuses derived from actual doc presence
- `.gitignore` extended: `node_modules/`, `npm-debug.log*`, `yarn-error.log*`, `package-lock.json`, `*.log`, `.DS_Store`, `Thumbs.db`, `dist/`, `.cache/`, `.env`

### Fixed
- Root `.claude-plugin/plugin.json` was missing commands, agents, runtime, and dashboard blocks — plugin could not register any commands
- Inner `neo-agents-ai-plugin/.claude-plugin/plugin.json` had wrong relative paths — all skill/agent/dashboard refs broken
- Directory naming inconsistency: `SE` → `DEV`, `PL` → `PM` across `setup.md`, `engineer.md`, `CLAUDE.md`, `server.js`, `index.html`
- `datetime.UTC` (Python 3.11+) → `datetime.timezone.utc` (Python 3.8+) in BA agent Script 3
- `datetime.UTC` → `datetime.timezone.utc` in SA agent Script 3
- README falsely claimed dashboard requires no internet — CDN (React, Babel, fonts) needs internet on first load
- README listed SA as v2/Coming Next — moved to v1/Active Now

---

## [v1.3.0] — 2026-05-27

### Added
- Dashboard v1: task board (Kanban), doc viewer, timeline, task detail modal
- `dashboard/server.js` — local Node.js server with full API:
  - `GET /api/config`
  - `GET /api/tasks`
  - `GET /api/docs`
  - `GET /api/doc`
  - `POST /api/task/move`
- Path traversal protection on `/api/doc` (`abs.startsWith(DOCS_DIR)` guard)
- `plugin.json`: `dashboard` block, `requires_nodejs` runtime flag

### Fixed
- BA agent: `datetime.utcnow()` (deprecated) → `datetime.now(datetime.UTC)`

---

## [v1.2.0] — 2026-05-22

### Added
- BA agent v1.2: interview loop (3–7 questions, one at a time), full BRD output
- BRD quality gates: 9 checks enforced before any file write
- Python3 file save scripts in BA agent: BRD save, SPEC append, tasks.json update
- `/neo:ba` skill with pre-flight checks and handoff context to BA agent

---

## [v1.1.0] — 2026-05-18

### Added
- `/neo:setup` with auto-detection for 10 stack types (Next.js, React, Vue, Node.js, Django, FastAPI, Python, Flutter, Static HTML, Generic)
- `config.json` generation including `access_token` via `secrets.choice()`
- Full `.ai-agents/docs/` folder structure initialization (BA, SA, DS, DEV, PM, SPEC)

---

## [v1.0.0] — 2026-05-15

### Added
- Plugin scaffold: `.claude-plugin/`, `CLAUDE.md`, agent + skill folder structure
- M1 complete: plugin installs without errors in Claude Code

---

[v1.4.0]: https://github.com/jameskwi/Neo-Agents-AI/releases/tag/v1.4.0
[v1.3.0]: https://github.com/jameskwi/Neo-Agents-AI/releases/tag/v1.3.0
[v1.2.0]: https://github.com/jameskwi/Neo-Agents-AI/releases/tag/v1.2.0
[v1.1.0]: https://github.com/jameskwi/Neo-Agents-AI/releases/tag/v1.1.0
[v1.0.0]: https://github.com/jameskwi/Neo-Agents-AI/releases/tag/v1.0.0
