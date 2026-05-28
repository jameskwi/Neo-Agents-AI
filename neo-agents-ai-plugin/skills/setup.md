# /neo:setup — Neo Agents AI Setup

## What this does
Initializes Neo Agents AI in the current project. Auto-detects stack, creates config, and builds the full docs folder structure.

---

## Execution Steps

### 1. Check if already configured

Run this Python3 script:

```python
import os, json, sys

config_path = os.path.join(os.getcwd(), '.ai-agents', 'config.json')

if os.path.exists(config_path):
    with open(config_path) as f:
        cfg = json.load(f)
    print(f"__EXISTS__|{cfg.get('project_name','unknown')}|{cfg.get('project_type','unknown')}")
else:
    print("__NEW__")
```

- If output starts with `__EXISTS__` → tell the user:
  > "Neo Agents is already configured in this project.
  > Detected: {project_name} ({project_type})
  > Update config? [y/n]"
  - `n` → stop
  - `y` → backup existing config by renaming to `config.backup.json`, then continue

- If output is `__NEW__` → continue

---

### 2. Auto-detect project stack + metadata

Run this Python3 script:

```python
import os, json, sys, secrets, string
from datetime import datetime, timezone

cwd = os.getcwd()

def read_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return {}

def read_text(path):
    try:
        with open(path) as f:
            return f.read()
    except:
        return ""

# ── Stack detection ────────────────────────────────────────────
stack = "generic"
language = "unknown"
package_manager = None
project_name = os.path.basename(cwd)

pkg = read_json(os.path.join(cwd, "package.json"))
requirements = read_text(os.path.join(cwd, "requirements.txt"))
pyproject = read_text(os.path.join(cwd, "pyproject.toml"))

if os.path.exists(os.path.join(cwd, "pubspec.yaml")):
    stack = "Flutter"
    language = "Dart"
    import re
    pubspec = read_text(os.path.join(cwd, "pubspec.yaml"))
    m = re.search(r'^name:\s*(.+)', pubspec, re.MULTILINE)
    if m:
        project_name = m.group(1).strip()

elif os.path.exists(os.path.join(cwd, "next.config.js")) or os.path.exists(os.path.join(cwd, "next.config.ts")):
    stack = "Next.js"
    if pkg.get("name"):
        project_name = pkg["name"]

elif pkg and "react" in pkg.get("dependencies", {}):
    stack = "React"
    if pkg.get("name"):
        project_name = pkg["name"]

elif pkg and "vue" in pkg.get("dependencies", {}):
    stack = "Vue"
    if pkg.get("name"):
        project_name = pkg["name"]

elif os.path.exists(os.path.join(cwd, "manage.py")):
    stack = "Python/Django"
    language = "Python"

elif os.path.exists(os.path.join(cwd, "main.py")) and "fastapi" in requirements.lower():
    stack = "Python/FastAPI"
    language = "Python"

elif os.path.exists(os.path.join(cwd, "requirements.txt")) or os.path.exists(os.path.join(cwd, "pyproject.toml")):
    stack = "Python"
    language = "Python"

elif pkg:
    stack = "Node.js"
    if pkg.get("name"):
        project_name = pkg["name"]

elif os.path.exists(os.path.join(cwd, "index.html")) and not pkg:
    stack = "Static HTML"
    language = "HTML"

# ── Language refinement ────────────────────────────────────────
if language == "unknown":
    if os.path.exists(os.path.join(cwd, "tsconfig.json")):
        language = "TypeScript"
    elif pkg:
        language = "JavaScript"

# ── Package manager ────────────────────────────────────────────
if pkg:
    if os.path.exists(os.path.join(cwd, "yarn.lock")):
        package_manager = "yarn"
    elif os.path.exists(os.path.join(cwd, "pnpm-lock.yaml")):
        package_manager = "pnpm"
    else:
        package_manager = "npm"

# ── Access token ───────────────────────────────────────────────
alphabet = string.ascii_letters + string.digits
access_token = ''.join(secrets.choice(alphabet) for _ in range(32))

# ── Build config ───────────────────────────────────────────────
config = {
    "project_name": project_name,
    "project_type": stack,
    "language": language,
    "package_manager": package_manager,
    "project_root": cwd,
    "docs_path": ".ai-agents/docs",
    "tasks_file": ".ai-agents/tasks.json",
    "dashboard_port": 7842,
    "access_token": access_token,
    "neo_agents_version": "1.0.0",
    "created_at": datetime.now(timezone.utc).isoformat()
}

print(json.dumps(config))
```

Capture the JSON output as `DETECTED_CONFIG`.

Show the user what was detected:
```
Detected:
  Project:  {project_name}
  Stack:    {project_type}
  Language: {language}
  Package:  {package_manager or "n/a"}

Is this correct? [y/n]
```

- `n` → ask user to correct any field manually, then update `DETECTED_CONFIG` before continuing
- `y` → continue

---

### 3. Check Python3

Run: `python3 --version`

If it fails → stop:
> "Python3 is required by Neo Agents AI.
> Install: https://python.org/downloads
> Then re-run /neo:setup"

---

### 4. Write config + folder structure

Run this Python3 script (inject `DETECTED_CONFIG` as the config JSON):

```python
import os, json, sys

cwd = os.getcwd()
config = DETECTED_CONFIG  # injected from step 2

# ── Paths ─────────────────────────────────────────────────────
ai_root   = os.path.join(cwd, ".ai-agents")
docs_root = os.path.join(ai_root, "docs")
dirs = [
    os.path.join(docs_root, "BA"),
    os.path.join(docs_root, "SA"),
    os.path.join(docs_root, "DS"),
    os.path.join(docs_root, "DEV"),
    os.path.join(docs_root, "PM"),
    os.path.join(docs_root, "SPEC"),
]

# ── Create dirs ────────────────────────────────────────────────
for d in dirs:
    os.makedirs(d, exist_ok=True)

# ── Write config.json ──────────────────────────────────────────
config_path = os.path.join(ai_root, "config.json")
with open(config_path, "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2)

# ── Write tasks.json (only if missing) ────────────────────────
tasks_path = os.path.join(ai_root, "tasks.json")
if not os.path.exists(tasks_path):
    with open(tasks_path, "w", encoding="utf-8") as f:
        json.dump({"tasks": []}, f, indent=2)

print("__OK__")
```

If output is not `__OK__` → show the error and stop.

---

### 5. Show setup summary

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
| Permission denied | "Cannot write to project directory. Check folder permissions." |
| Python3 not found | Show install URL. Stop. |
| Disk full | "Not enough disk space. Free up space and retry." |
| User rejects detected config | Prompt field-by-field correction before continuing |

---

*setup skill v1.1 — Neo Agents AI*
