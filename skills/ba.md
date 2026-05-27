# /neo:ba — Business Analyst Agent

## Usage
```
/neo:ba "feature idea in plain language"
```

## What this does
Activates the Business Analyst agent. The BA interviews you with targeted questions before producing a full Business Requirements Document (BRD).

---

## Pre-flight Checks

Before anything else:

1. **Check config exists**
   - Look for `.ai-agents/config.json`
   - If missing → stop:
     > "Neo Agents is not set up. Run `/neo:setup` first."

2. **Check argument provided**
   - If user ran `/neo:ba` with no argument → ask:
     > "What feature do you want to build? Describe it in plain language."

3. **Read project context**
   - Parse `config.json` → project_name, project_type, language
   - Read `tasks.json` → note active tasks (avoid duplicate work)
   - Scan `docs/SPEC/` → check if a spec for this feature already exists

---

## Handoff to BA Agent

Pass the following context to `agents/business-analyst.md`:

```
FEATURE_IDEA: {user's input}
PROJECT_NAME: {from config}
PROJECT_TYPE: {from config}
LANGUAGE: {from config}
ACTIVE_TASKS: {from tasks.json}
EXISTING_SPEC: {path if found, null if not}
```

The BA agent takes over from here and runs the full interview → BRD flow.

---

## On Completion

The BA agent will:
1. Save BRD to `.ai-agents/docs/BA/`
2. Append to SPEC file in `.ai-agents/docs/SPEC/`
3. Update `tasks.json`

After saving, display:
```
✅ BRD complete.

Feature:  {feature name}
Stories:  {count}
BRD:      .ai-agents/docs/BA/{filename}.md
Spec:     .ai-agents/docs/SPEC/{slug}-spec.md

Next: /neo:sa to get the technical blueprint.
```

---

*ba skill v1.0 — Neo Agents AI*
