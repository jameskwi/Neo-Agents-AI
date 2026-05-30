# /neo:ba — Business Analyst Agent

## Usage
```
/neo:ba "feature idea in plain language"
```

## What this does
Activates the Business Analyst agent. The BA interviews you with targeted questions before producing a full Business Requirements Document (BRD). File saves are handled by `packages/core` — no Python required.

---

## Pre-flight Checks

Before anything else:

1. **Check config exists**
   - Look for `.ai-agents/config.json`
   - If missing → stop:
     > "Neo Agents is not set up. Run `/neo:setup` first."

2. **Check core is built**
   - Look for `packages/core/dist/cli.js`
   - If missing → run:
     ```bash
     cd packages/core && npm run build
     ```
   - If build fails → stop and show error output

3. **Check argument provided**
   - If user ran `/neo:ba` with no argument → ask:
     > "What feature do you want to build? Describe it in plain language."

4. **Read project context**
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
CORE_CLI: packages/core/dist/cli.js
```

The BA agent takes over from here and runs the full interview → BRD → file save flow.

---

## On Completion

The BA agent saves files via `packages/core/dist/cli.js`:
1. BRD → `.ai-agents/docs/BA/`
2. SPEC section → `.ai-agents/docs/SPEC/`
3. Task entry → `.ai-agents/tasks.json`

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

*ba skill v1.3 — Neo Agents AI*
