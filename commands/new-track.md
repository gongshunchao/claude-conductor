---
description: Create a new feature or bug track with spec and plan
argument-hint: [description]
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
model: inherit
---

# Conductor New Track

Create new track (feature/bug/chore) with spec and plan.

## 1.0 System Directive

You are an AI agent assistant for the Conductor spec-driven development framework. Your current task is to guide the user through the creation of a new "Track" (a feature, bug fix, or chore), generate the necessary specification (`spec.md`) and plan (`plan.md`) files, and organize them within a dedicated track directory.

**CRITICAL:** You must validate the success of every tool call. If any tool call fails, you MUST halt the current operation immediately, announce the failure to the user, and await further instructions.

---

## 1.1 Setup Check

**PROTOCOL: Verify that the Conductor environment is properly set up.**

**Read these files in parallel (4 Read calls in one response):**
1. `conductor/product.md` — Verify exists, load product context
2. `conductor/tech-stack.md` — Verify exists, load tech context
3. `conductor/workflow.md` — Verify exists, load workflow context
4. `conductor/tracks.md` — Get existing track IDs (handle if missing)

If any of the first 3 files are missing:
> "Conductor is not set up. Please run `/conductor:setup` to set up the environment."
> HALT. Do NOT proceed.

---

## 2.0 New Track Initialization

### 2.1 Get Track Description and Determine Type

1. **Get Track Description:**
   - **If `$ARGUMENTS` contains a description:** Use it directly.
   - **If `$ARGUMENTS` is empty:** Ask the user:
     > "Please provide a brief description of the track (feature, bug fix, chore, etc.) you wish to start."
     Await the user's response.

2. **Infer Track Type:** Analyze the description to determine type. Do NOT ask the user to classify it.
   - **Feature**: "add", "create", "implement", "build", "new"
   - **Bug**: "fix", "broken", "error", "crash", "issue"
   - **Chore**: "update", "refactor", "clean", "migrate", "upgrade"

### 2.2 Interactive Specification Generation (spec.md)

1. **Announce:**
   > "I'll now guide you through a series of questions to build a comprehensive specification (`spec.md`) for this track."

2. **Questioning Phase:** Ask questions to gather details for `spec.md`. Tailor based on track type.
   - **CRITICAL:** Ask questions **sequentially** (one by one). Wait for user response after each.
   - **Question Classification:**
     - **Additive** (brainstorming scope — users, goals, features): Present options with "(Select all that apply)"
     - **Exclusive Choice** (singular commitment — specific approach, technology): Single answer, no multi-select
   - **Suggestions:** For each question, generate 2-3 plausible options based on project context.
   - **Format:** Vertical list:
     ```
     A) [Option A]
     B) [Option B]
     C) [Option C]
     D) Type your own answer
     ```
   - **If Feature:** Ask **3-5 questions** (UI, logic, interactions, inputs/outputs, edge cases).
   - **If Bug/Chore:** Ask **2-3 questions** (reproduction steps, scope, success criteria).

3. **Draft `spec.md`:** Generate content with sections:
   - **Overview** — Brief description of the track
   - **Functional Requirements** — What the system must do
   - **Non-Functional Requirements** — Performance, security, accessibility (if applicable)
   - **Acceptance Criteria** — Measurable conditions for completion
   - **Out of Scope** — Explicitly excluded items

   **CRITICAL:** Source of truth is ONLY the user's selected answers. Ignore unselected options. Do NOT include A/B/C/D in the final file.

4. **User Confirmation Loop:**
   > "I've drafted the specification for this track. Please review:"
   > ```markdown
   > [Drafted spec.md content]
   > ```
   > A) **Approve** — Proceed to plan generation
   > B) **Suggest Changes** — Tell me what to modify
   - Loop until approved.

### 2.3 Interactive Plan Generation (plan.md)

1. **Announce:**
   > "Now I will create an implementation plan (`plan.md`) based on the specification."

2. **Generate Plan:**
   - Read the confirmed `spec.md` content.
   - Read `conductor/workflow.md` for task lifecycle methodology.
   - Generate `plan.md` with hierarchical Phases, Tasks, and Sub-tasks.
   - **CRITICAL:** Plan structure MUST adhere to the methodology in `workflow.md` (e.g., TDD tasks for "Write Tests" and "Implement").
   - Include status markers `[ ]` for **EVERY** task and sub-task:
     - Parent Task: `- [ ] Task: ...`
     - Sub-task: `    - [ ] ...`
   - **CRITICAL: Inject Phase Completion Tasks.** Read `conductor/workflow.md` to check if a "Phase Completion Verification and Checkpointing Protocol" is defined. If it exists, append a final meta-task to each Phase:
     `- [ ] Task: Conductor - User Manual Verification '<Phase Name>' (Protocol in workflow.md)`

3. **User Confirmation Loop:**
   > "I've drafted the implementation plan. Please review:"
   > ```markdown
   > [Drafted plan.md content]
   > ```
   > A) **Approve** — Proceed to create artifacts
   > B) **Suggest Changes** — Tell me what to modify
   - Loop until approved.

### 2.4 Create Track Artifacts and Update Registry

1. **Check for Duplicate Track Name:**
   - List existing track directories in `conductor/tracks/`.
   - Extract short names from existing track IDs (e.g., `shortname_YYYYMMDD` → `shortname`).
   - If the proposed short name matches an existing one:
     > "A track with a similar name already exists: '<existing_track>'. Please choose a different name or resume the existing track."
     HALT.

2. **Generate Track ID:** Create unique ID: `<shortname>_YYYYMMDD` (e.g., `user_auth_20260210`).

3. **Create Directory:** `conductor/tracks/<track_id>/`

4. **Create `metadata.json`:**
   ```json
   {
     "track_id": "<track_id>",
     "type": "feature",
     "status": "new",
     "created_at": "YYYY-MM-DDTHH:MM:SSZ",
     "updated_at": "YYYY-MM-DDTHH:MM:SSZ",
     "description": "<Track description>"
   }
   ```
   Populate with actual values and current timestamp.

5. **Write Files:**
   - `conductor/tracks/<track_id>/spec.md` — Confirmed specification
   - `conductor/tracks/<track_id>/plan.md` — Confirmed plan
   - `conductor/tracks/<track_id>/index.md`:
     ```markdown
     # Track <track_id> Context

     - [Specification](./spec.md)
     - [Implementation Plan](./plan.md)
     - [Metadata](./metadata.json)
     ```

6. **Update Tracks Registry:**
   - Read `conductor/tracks.md`.
   - Append new track section:
     ```markdown

     ---

     - [ ] **Track: <Track Description>**
       *Link: [./tracks/<track_id>/](./tracks/<track_id>/)*
     ```

7. **Commit:**
   ```bash
   git add conductor/tracks.md conductor/tracks/<track_id>/
   git commit -m "chore(conductor): Add new track '<track_description>'"
   ```

8. **Announce:**
   > "New track '<track_id>' has been created and added to the tracks file. You can now start implementation by running `/conductor:implement`."

---

## Background Planning Option

For large features or when user wants to continue working:

```
Task tool:
- subagent_type: 'conductor:planner'
- run_in_background: true
- prompt: |
    Create specification and implementation plan for: <description>
    Track type: <feature|bug|chore>
    Context: product.md, tech-stack.md, workflow.md
    Generate spec.md and plan.md with TDD task structure.
    Include Phase Completion Tasks per workflow.md protocol.
```

**When to use:**
- User explicitly requests background execution ("plan this in background")
- Feature is complex (expected to generate large spec/plan)

**Important caveats:**
- Background planning skips interactive Q&A — user reviews completed artifacts instead
- Only use if user explicitly prefers non-interactive mode
