---
name: context-awareness
description: Auto-load Conductor project context when conductor/ directory exists. Use for any development task in a Conductor-managed project to ensure alignment with product goals, tech stack, workflow methodology, and product guidelines.
allowed-tools: Read, Glob, Grep
---

# Conductor Context Awareness

Automatic context loading for Conductor-managed projects.

## When to Activate

When `conductor/` directory exists and user is: implementing tasks, working on features/bugs, reviewing code, or mentions "plan"/"tracks"/"spec".

## Context Files

| File | Contains | Use For |
|------|----------|---------|
| `product.md` | Vision, goals, users, features, metrics | The WHY |
| `tech-stack.md` | Languages, frameworks, DBs, libraries, architecture | The HOW |
| `workflow.md` | Methodology (TDD), coverage, commits, quality gates | The PROCESS |
| `product-guidelines.md` | Brand voice, design standards, UX patterns | The EXPERIENCE |
| `tracks.md` | All tracks (features/bugs), status, priorities | The WHAT |
| `index.md` | File resolution index, project structure map | The MAP |
| `code_styleguides/` | Language-specific standards, conventions, practices | The STYLE |

### Track-Level Files

| File | Contains | Use For |
|------|----------|---------|
| `tracks/<id>/spec.md` | Requirements, acceptance criteria | What to build |
| `tracks/<id>/plan.md` | Phased tasks with TDD structure | How to build |
| `tracks/<id>/index.md` | Track file index | Track navigation |
| `tracks/<id>/metadata.json` | Track metadata (created, status) | Track info |

## File Resolution

When locating a Conductor file:

1. **Check index:** Read `conductor/index.md` for file links
2. **Resolve path:** Links are relative to the index file's directory
3. **Fallback:** Use standard default paths (table above)
4. **Verify:** Confirm the resolved file exists on disk

> **Note:** `conductor/index.md` is generated during `/conductor:setup` and serves as the project's file resolution map.

## Workflow Reference

| Need | Read |
|------|------|
| Coverage target | workflow.md |
| Commit format | workflow.md |
| Test methodology | workflow.md |
| Quality gates | workflow.md |
| Technology choices | tech-stack.md |
| Coding style | code_styleguides/ |
| Design standards | product-guidelines.md |
| Current focus | tracks.md |

## Loading Sequence

**Before starting implementation:**
1. Check `tracks.md` for current track
2. Read track's `spec.md` for requirements
3. Read track's `plan.md` for tasks
4. Read `product-guidelines.md` for design standards (handle if missing)
5. Follow `workflow.md` methodology

**Full context load order (parallel reads recommended):**
1. `product.md` (why)
2. `tech-stack.md` (how)
3. `workflow.md` (process)
4. `product-guidelines.md` (experience — handle if missing)
5. `tracks.md` (what)
6. Track's `spec.md` and `plan.md`

## Quick Commands

```bash
# Find in-progress tasks across all tracks
grep -r "\[~\]" conductor/tracks/*/plan.md

# Find next available task in a specific track
grep -n "\[ \]" conductor/tracks/<track_id>/plan.md | head -5

# Count task status across all tracks
grep -rc "\[ \]" conductor/tracks/*/plan.md   # Pending
grep -rc "\[~\]" conductor/tracks/*/plan.md   # In progress
grep -rc "\[x\]" conductor/tracks/*/plan.md   # Complete

# Find phase checkpoints
grep -r "\[checkpoint:" conductor/tracks/*/plan.md

# List all tracks
ls conductor/tracks/
```

## Integration

Works with: **tdd-workflow** (TDD guidance), **code-styleguides** (language conventions)
