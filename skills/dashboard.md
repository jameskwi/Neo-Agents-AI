---
# /neo:dashboard — Launch Dashboard

## What this does
Starts the Neo Agents dashboard web server and opens it in the browser.

---

## Step 1 — Pre-flight
- Check `.ai-agents/config.json` exists → if not, stop: "Run `/neo:setup` first."
- Read `dashboard_port` from config (default: 7842)
- Read `access_token` from config

## Step 2 — Resolve plugin path
Find server.cjs location. Run this Python3 script:

```python
import os, glob, sys

home = os.path.expanduser("~")
pattern = os.path.join(home, ".claude", "**", "neo-agents-ai*", "packages", "dashboard", "server.cjs")
matches = glob.glob(pattern, recursive=True)
if not matches:
    pattern2 = os.path.join(home, "**", "neo-agents-ai*", "packages", "dashboard", "server.cjs")
    matches = glob.glob(pattern2, recursive=True)
if matches:
    print(matches[0])
else:
    print("NOT_FOUND")
```

If result is NOT_FOUND → stop: "Cannot locate Neo Agents AI plugin. Reinstall with /plugin marketplace add jameskwi/neo-agents-ai"

Save result as SERVER_PATH.

## Step 3 — Kill stale server if running

Read `.ai-agents/dashboard.pid` if it exists.
Run this Python3 script to check and kill stale process:

```python
import os, sys

pid_file = ".ai-agents/dashboard.pid"
port = {dashboard_port}

if os.path.exists(pid_file):
    try:
        with open(pid_file) as f:
            pid = int(f.read().strip())
        # Check if process is still alive
        if sys.platform == "win32":
            import subprocess
            result = subprocess.run(["tasklist", "/FI", f"PID eq {pid}", "/NH"], 
                                    capture_output=True, text=True)
            alive = str(pid) in result.stdout
        else:
            try:
                os.kill(pid, 0)
                alive = True
            except ProcessLookupError:
                alive = False
        
        if alive:
            # Kill it
            if sys.platform == "win32":
                subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True)
            else:
                os.kill(pid, 15)
            print(f"Killed stale server (PID {pid})")
        
        os.remove(pid_file)
    except Exception as e:
        try:
            os.remove(pid_file)
        except:
            pass
        print(f"PID file cleanup: {e}")
else:
    print("No stale server found")
```

## Step 4 — Check Node.js
Run: `node --version`
If not found → stop: "Node.js is required. Install from https://nodejs.org"

## Step 5 — Start server

Run this Python3 script to start the server as a detached background process:

```python
import subprocess, sys, os

server_path = r"{SERVER_PATH}"
port = "{dashboard_port}"
root = os.getcwd()

if sys.platform == "win32":
    proc = subprocess.Popen(
        ["node", server_path, f"--port={port}", f"--root={root}"],
        creationflags=subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        close_fds=True
    )
else:
    proc = subprocess.Popen(
        ["node", server_path, f"--port={port}", f"--root={root}"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True
    )

print(f"Server started with PID {proc.pid}")
```

Wait 2 seconds for the server to start.

## Step 6 — Open browser
Open: `http://localhost:{dashboard_port}?token={access_token}`

Show:
✅ Dashboard running at http://localhost:{dashboard_port}?token={access_token}
To stop the server run:
/neo:dashboard stop

## Step 7 — Handle "stop" argument
If user runs `/neo:dashboard stop`:
- Read `.ai-agents/dashboard.pid`
- Kill the process using the Python3 kill script from Step 3
- Show: "✅ Dashboard server stopped."

---

## Port Conflict Handling
If port is taken → auto-increment by 1 until free (max +10).
Show the actual port used.

---
*dashboard skill v1.5 — Neo Agents AI*
