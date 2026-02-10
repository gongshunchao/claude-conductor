---
description: Display current progress of Conductor-managed project
allowed-tools: Read, Glob, Bash
model: inherit
---

# Conductor Status

Display comprehensive project status overview.

## Pre-flight Check

1. Check `conductor/tracks.md` exists. If not: "Run `/conductor:setup` to initialize."
2. If empty: "No tracks. Create one with `/conductor:new-track`."

## Gather Data

### Step 1: Read Core Files (Parallel)

**Use parallel Read tool calls for:**
- `conductor/product.md` — Project name and context
- `conductor/tracks.md` — Track list and status

### Step 2: Get Current Date

```bash
date "+%Y-%m-%d %H:%M:%S %Z"
```

### Step 3: Read All Track Plans (Parallel)

After listing track directories with `ls conductor/tracks/`, **issue parallel Read calls for all track `plan.md` files:**
- `conductor/tracks/<track1>/plan.md`
- `conductor/tracks/<track2>/plan.md`
- (etc. for all tracks)

For each plan.md, count:
- `[ ]` pending tasks
- `[~]` in-progress tasks
- `[x]` completed tasks
- Identify current phase and task

> **Performance note:** Reading all track plans in parallel significantly speeds up status reporting for projects with multiple tracks.

## Generate Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONDUCTOR STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Project: <name from product.md>
  Date:    <current date/time>
  Status:  <On Track / Behind Schedule / Blocked>

CURRENT FOCUS
───────────────────────────────────────────────────
  Track: <current track description>
  Phase: <current phase> [~]
  Task:  <current task> [~]

PROGRESS
───────────────────────────────────────────────────
  [████████████░░░░░░░░] 60%  (12/20 tasks)

TRACKS
───────────────────────────────────────────────────
  ✅ Track: Setup Infrastructure          [x] 5/5
  🔄 Track: User Authentication           [~] 7/12
  ⏳ Track: Dashboard                     [ ] 0/8

NEXT ACTIONS
───────────────────────────────────────────────────
  1. Complete: Add JWT validation
  2. Next:     Add rate limiting
  3. Next:     Implement login endpoint
```

### Determine Project Status

- **On Track**: Active `[~]` items exist, no blockers
- **Behind Schedule**: No `[~]` items but incomplete tracks exist
- **Blocked**: BLOCKED markers found in plan.md
- **Complete**: All tracks `[x]`

### If Blockers

Show section with blocked tasks and reasons (from plan.md BLOCKED markers).

### If All Complete

```
  🎉 ALL TRACKS COMPLETE!

  Next: Create a new track with /conductor:new-track
        or run /conductor:review to review completed work.
```

### Summary Stats

- Total phases/tasks across all tracks
- Overall completion percentage
- Call to action: "Run `/conductor:implement` to continue"
