# /neo:sa — Solution Architect Agent

## Usage
```
/neo:sa
/neo:sa {task-id}
```

## What this does
Activates the Solution Architect agent. The SA reads your BRD, scans the project for technical context, then interviews you with 3–5 targeted technical questions before producing a full Solution Design Document (SSD).

The SSD defines API endpoints, data model changes, dependencies, technical risks, and whether design work is required before building.

---

## Pre-flight Checks

### Check 1 — Config exists

```python
import os, json, sys

config_path = ".ai-agents/config.json"

if not os.path.exists(config_path):
    print("__NO_CONFIG__")
    sys.exit(0)

with open(config_path, "r", encoding="utf-8") as f:
    config = json.load(f)

print(f"Project: {config['project_name']} ({config['project_type']}, {config['language']})")
```

If output is `__NO_CONFIG__` → stop:
> "Neo Agents is not set up. Run `/neo:setup` first."

---

### Check 2 — Find the active task to architect

```python
import os, json, sys

tasks_path = ".ai-agents/tasks.json"

if not os.path.exists(tasks_path):
    print("__NO_TASKS__")
    sys.exit(0)

with open(tasks_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Find tasks where BA is done and SA is not yet done
candidates = [
    t for t in data.get("tasks", [])
    if t.get("steps", {}).get("ba") == "✅ done"
    and t.get("steps", {}).get("sa") != "✅ done"
]

if not candidates:
    print("__NO_CANDIDATES__")
    sys.exit(0)

# Sort by updated_at descending — most recently touched first
candidates.sort(key=lambda t: t.get("updated_at", ""), reverse=True)

# If a specific task ID was provided as an argument, prefer it
requested_id = "{TASK_ID_ARG}"  # injected by skill — empty string if none given
if requested_id:
    match = next((t for t in candidates if t["id"] == requested_id), None)
    if match:
        selected = match
    else:
        print(f"__NOT_FOUND__|{requested_id}")
        sys.exit(0)
else:
    selected = candidates[0]

print(f"__TASK__|{selected['id']}|{selected['title']}|{selected['docs'].get('ba_doc','')}")
```

Interpret the output:
- `__NO_TASKS__` → stop: "No tasks found. Run `/neo:ba` first to create a BRD."
- `__NO_CANDIDATES__` → stop: "No tasks with a completed BRD and pending SA work were found. Either run `/neo:ba` to create a new BRD, or all tasks already have SAs."
- `__NOT_FOUND__|{id}` → stop: "Task `{id}` not found, or its BA step is not yet complete."
- `__TASK__|{id}|{title}|{ba_doc_path}` → proceed with this task

If more than one candidate exists, tell the user before proceeding:
> "Found {n} tasks pending SA. Proceeding with the most recent: **{title}** (`{id}`)
> To target a specific task, run `/neo:sa {task-id}`"

---

### Check 3 — Read the BRD

```python
import os, sys

brd_path = "{BRD_DOC_PATH}"  # injected from the task's docs.ba_doc

if not os.path.exists(brd_path):
    print(f"__NO_BRD__|{brd_path}")
    sys.exit(0)

with open(brd_path, "r", encoding="utf-8") as f:
    content = f.read()

print(content)
```

If output is `__NO_BRD__|{path}` → stop:
> "BRD file not found at `{path}`. The file may have been moved.
> Check `.ai-agents/docs/BA/` and update tasks.json if needed."

---

## Handoff to SA Agent

Pass the following context to `agents/solution-architect.md`:

```
TASK_ID:       {selected task id}
FEATURE_NAME:  {selected task title}
BRD_PATH:      {ba_doc path from the task}
BRD_CONTENT:   {full BRD markdown}
PROJECT_NAME:  {from config.json}
PROJECT_TYPE:  {from config.json}
LANGUAGE:      {from config.json}
```

The SA agent takes over and runs the full technical interview → SSD flow.

---

## On Completion

The SA agent will:
1. Save SSD to `.ai-agents/docs/SA/`
2. Append SA section to the SPEC file in `.ai-agents/docs/SPEC/`
3. Update the task entry in `.ai-agents/tasks.json` with `steps.sa = "✅ done"` and `docs.sa_doc`

Final confirmation is shown by the SA agent directly.

---

## Error States

| Error | Message |
|---|---|
| `config.json` not found | "Neo Agents is not set up. Run `/neo:setup` first." |
| No tasks with completed BRD | "Run `/neo:ba` to create a BRD before architecting." |
| Specific task ID not found | "Task `{id}` not found or BA not yet complete." |
| BRD file missing from disk | Show path. Tell user to check `.ai-agents/docs/BA/`. |
| Python3 not available | "Python3 is required. Install from https://python.org/downloads" |

---

*sa skill v1.0 — Neo Agents AI*
