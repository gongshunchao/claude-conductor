---
description: Review completed work against guidelines, styleguides, and the plan
argument-hint: [<track-name>]
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task
model: inherit
---

# Conductor Review

Review completed implementation against product guidelines, code styleguides, and the track plan.

## Pre-flight Checks

**Run these checks in parallel (single response with multiple Bash calls):**

1. **Verify Conductor Setup**:

   ```bash
   test -f conductor/product.md && test -f conductor/tech-stack.md && test -f conductor/workflow.md && echo "ready" || echo "missing"
   ```
   - If "missing": "Conductor is not set up. Please run `/conductor:setup` first."

2. **Check for tracks**:

   ```bash
   test -f conductor/tracks.md && echo "exists" || echo "not found"
   ```
   - If "not found": "No tracks found. Create one with `/conductor:new-track`."

3. **Check for product guidelines**:

   ```bash
   test -f conductor/product-guidelines.md && echo "exists" || echo "not found"
   ```
   - Note result; guidelines are optional but recommended.

## Scope Selection

### If track name provided ($ARGUMENTS)

1. Search `conductor/tracks.md` for matching track description
2. If found: Confirm with user
3. If not found: Suggest closest match

### If no track name provided

1. Check for in-progress track (`[~]` in `conductor/tracks.md`)
2. If one exists: "Do you want to review the in-progress track '<description>'?"
   - If Yes: Select that track
   - If No: Ask for track name or offer "current uncommitted changes" option
3. If no in-progress track: Use AskUserQuestion with list of completed tracks + "Current uncommitted changes" option

### Review Scope Confirmation

Announce: "Reviewing track '<description>' against project guidelines and styleguides."

## Load Review Context

**Read these files in parallel (multiple Read calls in one response):**

### Project Context
- `conductor/product-guidelines.md` (if exists) — Brand voice, design standards
- `conductor/tech-stack.md` — Technology choices and constraints
- `conductor/workflow.md` — Quality gates and methodology

### Code Styleguides
```bash
ls conductor/code_styleguides/ 2>/dev/null
```
- If directory exists: Read ALL `.md` files within it
- **CRITICAL**: Violations of code styleguides are **High severity** findings

### Track Context (if reviewing a track)
- `conductor/tracks/<track_id>/plan.md` — Implementation plan with commit SHAs
- `conductor/tracks/<track_id>/spec.md` — Original requirements

## Extract Changes for Review

### If reviewing a track

1. **Extract commit SHAs from plan.md**:
   ```bash
   grep -oP '\[[a-f0-9]{7,}\]' conductor/tracks/<track_id>/plan.md | tr -d '[]' | sort -u
   ```

2. **Get changed files across all track commits**:
   ```bash
   # Find the earliest track commit
   FIRST_SHA=$(grep -oP '\[[a-f0-9]{7,}\]' conductor/tracks/<track_id>/plan.md | tr -d '[]' | head -1)
   git diff --name-only ${FIRST_SHA}^..HEAD -- ':!conductor/'
   ```

3. **Get full diff for review**:
   ```bash
   git diff ${FIRST_SHA}^..HEAD -- ':!conductor/' ':!*.md'
   ```

### If reviewing current uncommitted changes

```bash
git diff --name-only HEAD
git diff HEAD
```

## Review Protocol

### 1. Code Styleguide Compliance (High Severity)

For each changed code file, verify against the matching styleguide:

| File Extension | Styleguide |
|---------------|------------|
| `.ts`, `.tsx` | `conductor/code_styleguides/typescript.md` |
| `.py`, `.pyi` | `conductor/code_styleguides/python.md` |
| `.go` | `conductor/code_styleguides/go.md` |
| `.js`, `.jsx` | `conductor/code_styleguides/javascript.md` |
| `.html`, `.css`, `.scss` | `conductor/code_styleguides/html-css.md` |
| `.cs` | `conductor/code_styleguides/csharp.md` |

Check for:
- Naming conventions
- Code structure and organization
- Error handling patterns
- Import/dependency ordering
- Documentation standards
- Language-specific idioms

### 2. Product Guidelines Compliance (Medium Severity)

If `product-guidelines.md` exists, verify:
- UI/UX follows brand guidelines
- Naming matches product terminology
- User-facing text follows voice/tone guidelines
- Accessibility requirements met

### 3. Spec Compliance (High Severity)

Compare implementation against `spec.md`:
- All requirements addressed
- Edge cases handled
- Acceptance criteria met
- No scope creep (unplanned additions)

### 4. Quality Gate Verification (High Severity)

Based on `workflow.md` requirements:

```bash
# Run tests
CI=true npm test 2>&1 || CI=true npx jest 2>&1 || go test ./... 2>&1 || python -m pytest 2>&1

# Check coverage (if configured)
CI=true npm test -- --coverage 2>&1 || true
```

Verify:
- Test coverage meets threshold (default >80%)
- All tests pass
- No linting errors
- Type safety enforced (if applicable)

### 5. Security Quick Scan (Critical Severity)

Check for common issues:
- Hardcoded secrets or API keys
- SQL injection vulnerabilities
- XSS vectors in user-facing code
- Missing input validation
- Exposed sensitive data in error messages

```bash
# Quick secret scan
grep -rn "password\s*=\s*['\"]" --include="*.ts" --include="*.js" --include="*.py" --include="*.go" . || true
grep -rn "api[_-]key\s*=\s*['\"]" --include="*.ts" --include="*.js" --include="*.py" --include="*.go" . || true
grep -rn "secret\s*=\s*['\"]" --include="*.ts" --include="*.js" --include="*.py" --include="*.go" . || true
```

## Generate Review Report

Present findings organized by severity:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONDUCTOR REVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Track: <description>
  Files Reviewed: <count>
  Commits Analyzed: <count>

FINDINGS
───────────────────────────────────────────────────

🔴 CRITICAL (<count>)
  1. [Security] <description>
     File: <path>:<line>
     Suggestion: <fix>

🟠 HIGH (<count>)
  1. [Styleguide] <description>
     File: <path>:<line>
     Rule: <styleguide rule violated>
     Suggestion: <fix>

  2. [Spec] <description>
     Requirement: <from spec.md>
     Status: Missing/Incomplete

🟡 MEDIUM (<count>)
  1. [Guidelines] <description>
     File: <path>:<line>
     Suggestion: <fix>

🟢 LOW (<count>)
  1. [Improvement] <description>
     Suggestion: <fix>

SUMMARY
───────────────────────────────────────────────────
  Critical: <n>  |  High: <n>  |  Medium: <n>  |  Low: <n>
  Quality Gate: PASS ✅ / FAIL ❌
  Coverage: <percent>%
  Tests: <pass>/<total> passing
```

## Resolution

### If findings exist

Use AskUserQuestion with options:

```
What would you like to do?

A) Apply Fixes (Recommended): Auto-apply suggested code fixes for High and Critical issues
B) Manual Fix: Pause review so you can fix issues manually
C) Accept & Continue: Accept findings as-is and proceed to track cleanup
```

**If "A" (Apply Fixes):**
1. Apply code modifications for each fixable finding
2. Run tests to verify fixes don't break anything
3. Commit fixes: `fix: address review findings for '<track description>'`
4. Re-run quick verification to confirm resolution
5. Proceed to Track Cleanup

**If "B" (Manual Fix):**
- Announce: "Review paused. Fix the issues and run `/conductor:review` again when ready."
- **STOP**

**If "C" (Accept & Continue):**
- Proceed to Track Cleanup

### If no findings

Announce: "✅ Review passed with no issues! Proceeding to track cleanup."

## Track Cleanup

**CRITICAL**: Only run this section if reviewing a specific track (not uncommitted changes).

Use AskUserQuestion:

```
Review complete. What would you like to do with track '<description>'?

A) Archive (Recommended): Move to conductor/archive/ and update tracks registry
B) Delete: Permanently remove track folder and registry entry
C) Skip: Leave track as-is in the tracks file
```

**If "A" (Archive):**
1. Create archive directory if needed:
   ```bash
   mkdir -p conductor/archive
   ```
2. Move track folder:
   ```bash
   mv conductor/tracks/<track_id> conductor/archive/<track_id>
   ```
3. Update `conductor/tracks.md`: Remove the track section
4. Commit:
   ```bash
   git add conductor/
   git commit -m "conductor(track): Archive completed track '<description>'"
   ```

**If "B" (Delete):**
1. Remove track folder:
   ```bash
   rm -rf conductor/tracks/<track_id>
   ```
2. Update `conductor/tracks.md`: Remove the track section
3. Commit:
   ```bash
   git add conductor/
   git commit -m "conductor(track): Delete completed track '<description>'"
   ```

**If "C" (Skip):**
- Announce: "Track left as-is. You can archive or delete later."

## Completion

Announce:
- Review summary (findings count by severity)
- Action taken (fixes applied / manual / accepted)
- Track disposition (archived / deleted / kept)
- Next steps: `/conductor:status` for overview, `/conductor:new-track` for next feature