# /neo:setup — Neo Agents AI Setup

## What this does
Initializes Neo Agents AI in the current project. Auto-detects stack, creates config, and builds the full docs folder structure. All operations run via `packages/core` — no Python required.

---

## Pre-flight Check

Before any other step, verify `packages/core` is built:

```bash
[ -f packages/core/dist/cli.js ] || (cd packages/core && npm run build)
```

If the build fails → stop and show the npm error output.

---

## Execution Steps

### 1. Check if already configured

```bash
[ -f .ai-agents/config.json ] && echo "__EXISTS__" || echo "__NEW__"
```

- `__EXISTS__` → tell the user:
  > "Neo Agents is already configured in this project.
  > Update config? [y/n]"
  - `n` → stop
  - `y` → back up existing config:
    ```bash
    cp .ai-agents/config.json .ai-agents/config.backup.json
    ```
    Set `FORCE_FLAG=--force`, then continue

- `__NEW__` → continue (no `FORCE_FLAG`)

---

### 2. Auto-detect project stack + metadata

```bash
node packages/core/dist/cli.js detect-stack --root=.
```

Parse the JSON output. Field mapping:

| JSON field | Used as |
|---|---|
| `framework` | Stack display + `--type` for write-config |
| `language` | `--language` for write-config |
| `package_manager` | `--pm` for write-config |
| `project_name` | `--name` for write-config |

Show the user what was detected:

```
Detected:
  Project:  {project_name}
  Stack:    {framework}
  Language: {language}
  Package:  {package_manager or "n/a"}

Is this correct? [y/n]
```

- `n` → ask user to correct any field manually, update the detected values before continuing
- `y` → continue

---

### 3. Write config

```bash
node packages/core/dist/cli.js write-config \
  --root=. \
  --name="{project_name}" \
  --type="{framework}" \
  --language="{language}" \
  [--pm="{package_manager}" if not null] \
  {FORCE_FLAG}
```

Omit `--pm` if no package manager was detected (null / n/a).

**Expected output:**
```
Config written: .ai-agents/config.json
```

If it exits with code 1 → stop and show the error output.

---

### 4. Create docs folder structure

```bash
mkdir -p .ai-agents/docs/BA .ai-agents/docs/SA .ai-agents/docs/DS \
         .ai-agents/docs/DEV .ai-agents/docs/PM .ai-agents/docs/SPEC
```

---

### 5. Initialize tasks.json

```bash
[ -f .ai-agents/tasks.json ] || printf '{"tasks":[]}\n' > .ai-agents/tasks.json
```

---

### 6. Handle .gitignore

```bash
if [ -f .gitignore ]; then
  grep -qF '.ai-agents/' .gitignore \
    || printf '\n# Neo Agents AI — local agent workspace\n.ai-agents/\n' >> .gitignore
fi
```

If `.gitignore` does not exist → show this warning once and continue:
> ⚠️  No `.gitignore` found.
> The `.ai-agents/` folder contains local agent state and access tokens — it should not be committed.
> Add `.ai-agents/` to your `.gitignore` when you initialise a git repository for this project.

---

### 7. Show setup summary

```
✅ Neo Agents AI is ready.

Project:   {project_name}
Stack:     {framework} ({language})
Docs:      .ai-agents/docs/
Dashboard: localhost:7842

Next step: /neo:ba "describe your first feature"
```

---

## Error States

| Error | Message |
|---|---|
| `packages/core/dist/cli.js` missing | Run `cd packages/core && npm run build`. Stop if build fails. |
| `write-config` exits code 1 | Show CLI error output. Stop. |
| Permission denied | "Cannot write to project directory. Check folder permissions." |
| Disk full | "Not enough disk space. Free up space and retry." |
| User rejects detected config | Prompt field-by-field correction before continuing |

---

*setup skill v1.4 — Neo Agents AI*
