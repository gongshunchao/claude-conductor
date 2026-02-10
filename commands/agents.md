---
description: Manage background Conductor agents and worktrees
argument-hint: [status|results|worktrees|cleanup]
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
model: inherit
---

# Conductor Agents

Monitor and manage background Conductor agents and git worktrees.

## 1.0 System Directive

You are an AI agent managing background Conductor agents and their git worktree isolation. Your goal is to provide clear status information, retrieve results from completed agents, and safely clean up orphaned worktrees.

**CRITICAL:** You must validate the success of every tool call. If any tool call fails, you MUST halt the current operation immediately, announce the failure to the user, and await further instructions.

---

## 2.0 Default (no arguments): Check Background Agent Status

**Run in parallel (single response with multiple Bash calls):**

1. **List running tasks**:
   ```bash
   # Use /tasks command to see all background agents
   # Parse output to identify conductor agents (implementer, planner, reviewer)
   ```

2. **List worktrees**:
   ```bash
   git worktree list
   ```

### Status Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONDUCTOR AGENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Background Agents:
    [RUNNING]   implementer - Task: Add user validation
    [COMPLETED] planner     - Track: dashboard_20260210

  Worktrees:
    .worktrees/implementer-1735075200 → conductor/implementer-1735075200
```

- **If no background agents:** "No background agents currently running."
- **If worktrees exist but no agents:** Suggest `/conductor:agents cleanup` to remove orphaned worktrees.

---

## 3.0 `/conductor:agents results` — Retrieve Results

Use TaskOutput to retrieve results from completed background agents.

**For each completed agent:**

1. **Retrieve output**:
   ```
   TaskOutput tool:
   - task_id: <agent_task_id>
   - block: false
   ```

2. **Display summary**:
   - **Implementer**: Tasks completed, commits made, checkpoint SHA
   - **Planner**: Track ID, spec/plan paths created
   - **Reviewer**: Verification status, checkpoint SHA

3. **Worktree merge** (if applicable):
   - Check if agent used worktree isolation
   - Merge worktree branch back to main:
     ```bash
     git merge --no-ff conductor/<agent>-<id> -m "conductor(merge): Merge <agent> worktree"
     ```
   - Cleanup worktree after merge (see Section 5.0)

---

## 4.0 `/conductor:agents worktrees` — List Worktrees

Display detailed worktree information:

```bash
git worktree list
```

For each worktree:
- Path: `.worktrees/<agent>-<id>`
- Branch: `conductor/<agent>-<id>`
- Status: Check if branch has uncommitted changes

**Commands for manual management:**

```bash
# View worktree branch commits
git log conductor/<agent>-<id>

# Manually merge worktree
git merge --no-ff conductor/<agent>-<id> -m "conductor(merge): Manual merge of <agent> worktree"

# Remove worktree
git worktree remove .worktrees/<agent>-<id>
git branch -d conductor/<agent>-<id>
```

---

## 5.0 `/conductor:agents cleanup` — Clean Orphaned Worktrees

Remove worktrees that no longer have running agents.

### Safety Protocol

1. **List all worktrees**:
   ```bash
   git worktree list
   ```

2. **Check for running agents**: Compare worktrees against active background tasks. Identify orphaned worktrees (no associated running agent).

3. **For each orphaned worktree**, ask user:
   > "Worktree `.worktrees/<agent>-<id>` has no running agent. Merge and cleanup? (Yes/No)"

4. **If Yes**:
   ```bash
   # Check for uncommitted changes
   cd .worktrees/<agent>-<id>
   if [ -n "$(git status --porcelain)" ]; then
     echo "WARNING: Uncommitted changes in worktree"
     # Ask user to confirm or abort
   fi

   # Return to main and merge
   cd -
   git merge --no-ff conductor/<agent>-<id> -m "conductor(cleanup): Merge orphaned worktree <agent>-<id>"

   # Remove worktree and branch
   git worktree remove .worktrees/<agent>-<id>
   git branch -d conductor/<agent>-<id>
   ```

5. **If No**: Skip that worktree.

6. **Report**: "Cleaned up N worktrees."

---

## 6.0 Integration with /implement

After retrieving background implementer results:

1. **Verify plan.md reflects completed tasks**
2. **Check if phase is complete**
3. **Suggest next action**:
   - Continue implementation (more tasks)
   - Run phase verification (phase complete)
   - Check status (review progress)

---

## 7.0 Safety Notes

- Always check for uncommitted changes before removing worktrees
- Use `--no-ff` merge to preserve branch history for audit trail
- Confirm with user before destructive operations
- Background agents may fail — always check status before cleanup
