# /neo:ds — Designer Agent

## Usage
```
/neo:ds
/neo:ds {task-id}
```

## What this does
Activates the Designer agent. The DS agent reads your BRD and SSD, scans the project for design context, then interviews you with 2–4 targeted questions before producing a fully structured Claude Design Prompt.

The prompt is self-contained and ready to paste directly into Claude Design (or equivalent) to generate UI components. Only runs when the SA determined `design_required: YES`.

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

### Check 2 — Find the active task requiring design work

```python
import os, json, sys

tasks_path = ".ai-agents/tasks.json"

if not os.path.exists(tasks_path):
    print("__NO_TASKS__")
    sys.exit(0)

with open(tasks_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Find tasks where SA is done, design_required is True, and DS is not yet done
candidates = [
    t for t in data.get("tasks", [])
    if t.get("steps", {}).get("sa") == "✅ done"
    and t.get("docs", {}).get("design_required") is True
    and t.get("steps", {}).get("ds") != "✅ done"
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

print(f"__TASK__|{selected['id']}|{selected['title']}|{selected['docs'].get('ba_doc','')}|{selected['docs'].get('sa_doc','')}")
```

Interpret the output:
- `__NO_TASKS__` → stop: "No tasks found. Run `/neo:ba` to start."
- `__NO_CANDIDATES__` → stop: "No tasks are ready for design work. Either run `/neo:sa` first, or the SA determined no design is needed (`design_required: NO`) — in that case run `/neo:dev` instead."
- `__NOT_FOUND__|{id}` → stop: "Task `{id}` not found, or it is not ready for design (SA not complete or design not required)."
- `__TASK__|{id}|{title}|{ba_doc}|{sa_doc}` → proceed with this task

If more than one candidate exists, tell the user before proceeding:
> "Found {n} tasks pending design. Proceeding with the most recent: **{title}** (`{id}`)
> To target a specific task, run `/neo:ds {task-id}`"

---

### Check 3 — Read the BRD and SSD

```python
import os, sys

brd_path = "{BRD_DOC_PATH}"  # injected from task's docs.ba_doc
ssd_path = "{SSD_DOC_PATH}"  # injected from task's docs.sa_doc

missing = []
if not os.path.exists(brd_path):
    missing.append(f"BRD: {brd_path}")
if not os.path.exists(ssd_path):
    missing.append(f"SSD: {ssd_path}")

if missing:
    for m in missing:
        print(f"__MISSING__|{m}")
    sys.exit(0)

with open(brd_path, "r", encoding="utf-8") as f:
    brd = f.read()

with open(ssd_path, "r", encoding="utf-8") as f:
    ssd = f.read()

print("__BRD_START__")
print(brd)
print("__BRD_END__")
print("__SSD_START__")
print(ssd)
print("__SSD_END__")
```

If any output starts with `__MISSING__` → stop for each missing file:
> "File not found at `{path}`. The file may have been moved.
> Check `.ai-agents/docs/BA/` and `.ai-agents/docs/SA/` and update tasks.json if needed."

---

## Handoff to Designer Agent

Pass the following context to `agents/designer.md`:

```
TASK_ID:       {selected task id}
FEATURE_NAME:  {selected task title}
BRD_PATH:      {docs.ba_doc from task}
SSD_PATH:      {docs.sa_doc from task}
BRD_CONTENT:   {full BRD markdown}
SSD_CONTENT:   {full SSD markdown}
PROJECT_NAME:  {from config.json}
PROJECT_TYPE:  {from config.json}
LANGUAGE:      {from config.json}
```

The DS agent takes over and runs the full design interview → Claude Design Prompt flow.

---

## On Completion

The DS agent will:
1. Save the Claude Design Prompt to `.ai-agents/docs/DS/`
2. Append DS section to the SPEC file in `.ai-agents/docs/SPEC/`
3. Update the task entry in `.ai-agents/tasks.json` with `steps.ds = "✅ done"` and `docs.ds_doc`

Final confirmation is shown by the DS agent directly.

---

## Error States

| Error | Message |
|---|---|
| `config.json` not found | "Neo Agents is not set up. Run `/neo:setup` first." |
| No tasks with SA done + design_required | "Run `/neo:sa` first, or if design is not required skip to `/neo:dev`." |
| Specific task ID not found or not ready | "Task `{id}` not found or not ready for design." |
| BRD or SSD file missing from disk | Show path. Tell user to check `.ai-agents/docs/BA/` or `.ai-agents/docs/SA/`. |
| Python3 not available | "Python3 is required. Install from https://python.org/downloads" |

---

*ds skill v1.0 — Neo Agents AI*
