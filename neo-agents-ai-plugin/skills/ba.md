# /neo:ba — Business Analyst Agent

## Usage
```
/neo:ba "feature idea in plain language"
```

## What this does
Activates the Business Analyst agent. The BA interviews you with targeted, context-specific questions before producing a full Business Requirements Document (BRD).

---

## Pre-flight Checks

Run these checks before invoking the BA agent.

### Check 1 — Config exists

```python
import os, json, sys

config_path = ".ai-agents/config.json"

if not os.path.exists(config_path):
    print("Neo Agents is not set up. Run `/neo:setup` first.")
    sys.exit(1)

with open(config_path, "r", encoding="utf-8") as f:
    config = json.load(f)

print(f"Project: {config['project_name']} ({config['project_type']}, {config['language']})")
```

### Check 2 — Argument provided

If the user ran `/neo:ba` with no feature description → ask:
> "What feature do you want to build? Describe it in plain language."

Wait for their input before proceeding.

### Check 3 — Read active context

```python
import os, json

tasks_path = ".ai-agents/tasks.json"
spec_dir = ".ai-agents/docs/SPEC"

# Read active tasks
active_tasks = []
if os.path.exists(tasks_path):
    with open(tasks_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    active_tasks = [t for t in data.get("tasks", []) if t.get("status") != "✅ done"]
    if active_tasks:
        print(f"Active tasks: {[t['title'] for t in active_tasks]}")

# Check for existing spec
feature_input = "{USER_FEATURE_INPUT}"
slug_hint = feature_input.lower().replace(" ", "-")[:40]
existing_spec = None

if os.path.exists(spec_dir):
    for fname in os.listdir(spec_dir):
        if slug_hint[:15] in fname:
            existing_spec = os.path.join(spec_dir, fname)
            print(f"Existing spec found: {existing_spec}")
            break

if not existing_spec:
    print("No existing spec found. Starting fresh.")
```

---

## Handoff to BA Agent

Pass the following context to `agents/business-analyst.md`:

```
FEATURE_IDEA:   {user's input}
PROJECT_NAME:   {from config.json}
PROJECT_TYPE:   {from config.json}
LANGUAGE:       {from config.json}
ACTIVE_TASKS:   {list of active task titles from tasks.json}
EXISTING_SPEC:  {path if found, null if not}
```

The BA agent takes over and runs the full interview → BRD flow.

---

## On Completion

The BA agent will:
1. Save BRD to `.ai-agents/docs/BA/`
2. Create or append to SPEC file in `.ai-agents/docs/SPEC/`
3. Add task entry to `.ai-agents/tasks.json`

Final confirmation is shown by the BA agent directly.

---

## Error States

| Error | Message |
|---|---|
| `config.json` not found | "Neo Agents is not set up. Run `/neo:setup` first." |
| No feature argument given | Prompt user for input before continuing |
| Python3 not available | "Python3 is required. Install from https://python.org/downloads" |

---

*ba skill v1.1 — Neo Agents AI*