# /neo:pm — PM Agent (Project Manager)

> **Status: v2** — Not active in v1.
> The PM agent will be available once the Engineer agent (M5) is shipped.

---

## What this will do

The PM agent passively tracks pipeline state across all agents and produces a live sprint summary — tasks in flight, pipeline progress, blockers, and milestone status.

It does not ask interview questions. It reads existing `.ai-agents/` state and surfaces actionable status information.

---

## When available

Run after at least one full BA→SA→DS→DEV pipeline has completed:

```
/neo:pm
```

---

## For now

Use the dashboard to track task and pipeline state:

```
/neo:dashboard
```

The dashboard's Board tab shows all tasks and lets you move them between columns. The Timeline tab shows live milestone progress.

---

*PM skill — v2 stub | Neo Agents AI*
