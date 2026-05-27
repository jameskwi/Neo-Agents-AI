# /neo:setup — Neo Agents AI Setup

## What this does
Initializes Neo Agents AI in the current project. Auto-detects stack, creates config, and builds the full docs folder structure.

---

## Execution Steps

### 1. Check if already configured
Look for `.ai-agents/config.json` in the project root.

If found → ask:
> "Neo Agents is already configured in this project.
> Detected: {project_name} ({project_type})
> Update config? [y/n]"

If user says `n` → stop.
If user says `y` → proceed (backup existing config first).

### 2. Auto-detect project stack

Run detection in this order (first match wins):

| Signal | Stack |
|---|---|
| `pubspec.yaml` exists | Flutter |
| `next.config.js` or `next.config.ts` exists | Next.js |
| `package.json` + `react` in dependencies | React |
| `package.json` + `vue` in dependencies | Vue |
| `manage.py` exists | Python/Django |
| `main.py` + `fastapi` in requirements | Python/FastAPI |
| `requirements.txt` or `pyproject.toml` exists | Python (generic) |
| `package.json` exists (no framework match) | Node.js |
| `index.html` at root, no package.json | Static HTML |
| None of the above | Generic |

Also detect:
- `project_name`: from `package.json` name, `pubspec.yaml` name, or folder name
- `project_root`: absolute path of current directory
- `package_manager`: yarn (if `yarn.lock`), pnpm (if `pnpm-lock.yaml`), npm (default for Node)
- `language`: TypeScript (if `tsconfig.json`), Dart (Flutter), Python, JavaScript, Unknown

### 3. Check Python3
Run: `python3 --version`
If not found → show error:
> "Python3 is required by Neo Agents AI for file operations.
> Install it: https://python.org/downloads
> Then re-run /neo:setup"
→ Stop.

### 4. Generate access token
Generate a random 32-character alphanumeric token for dashboard access.

### 5. Create config.json

Save to `.ai-agents/config.json`:

```json
{
  "project_name": "{detected name}",
  "project_type": "{detected type}",
  "language": "{detected language}",
  "package_manager": "{detected or null}",
  "project_root": "{absolute path}",
  "docs_path": ".ai-agents/docs",
  "tasks_file": ".ai-agents/tasks.json",
  "dashboard_port": 7842,
  "access_token": "{generated token}",
  "neo_agents_version": "1.0.0",
  "created_at": "{ISO timestamp}"
}
```

### 6. Create folder structure

```
.ai-agents/
├── config.json        ← already created
├── tasks.json         ← empty tasks array
└── docs/
    ├── BA/            ← Business Analyst outputs
    ├── SA/            ← Solution Architect outputs
    ├── DS/            ← Designer outputs
    ├── SE/            ← Engineer outputs
    ├── PL/            ← PM/Planner outputs
    └── SPEC/          ← Shared spec files (one per task)
```

Create `tasks.json`:
```json
{
  "tasks": []
}
```

### 7. Show setup summary

```
✅ Neo Agents AI is ready.

Project:   {project_name}
Stack:     {project_type} ({language})
Docs:      .ai-agents/docs/
Dashboard: localhost:{dashboard_port}

Next step: /neo:ba "describe your first feature"
```

---

## Error States

| Error | Message |
|---|---|
| Permission denied writing files | "Cannot write to project directory. Check folder permissions." |
| Python3 not found | Show install URL. Stop. |
| Disk full | "Not enough disk space. Free up space and retry." |

---

*setup skill v1.0 — Neo Agents AI*
