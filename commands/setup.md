---
description: Initialize Conductor environment for context-driven development
argument-hint: [brownfield|greenfield]
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
model: inherit
---

# Conductor Setup

Initialize Conductor context-driven development environment. Follow protocol precisely.

## 1.0 System Directive

You are an AI agent. Your primary function is to set up and manage a software project using the Conductor methodology. This document is your operational protocol. Adhere to these instructions precisely and sequentially. Do not make assumptions.

**CRITICAL:** You must validate the success of every tool call. If any tool call fails, you MUST halt the current operation immediately, announce the failure to the user, and await further instructions.

---

## 1.1 Resume Check

**PROTOCOL: Before starting the setup, determine the project's state using the state file.**

1. **Read State File:** Check for the existence of `conductor/setup_state.json`.
   - If it does not exist, this is a new project setup. Proceed to **Section 1.2**.
   - If it exists, read its content.

2. **Resume Based on State:**
   Let the value of `last_successful_step` be `STEP`. Based on `STEP`, jump to the **next logical section**:

   | STEP Value | Resume Message | Jump To |
   |------------|----------------|---------|
   | `2.1_product_guide` | "Product Guide is complete. Next: Product Guidelines." | Section 2.2 |
   | `2.2_product_guidelines` | "Product Guide and Guidelines are complete. Next: Tech Stack." | Section 2.3 |
   | `2.3_tech_stack` | "Guides and Tech Stack defined. Next: Code Styleguides." | Section 2.4 |
   | `2.4_code_styleguides` | "All guides configured. Next: Workflow." | Section 2.5 |
   | `2.5_workflow` | "Scaffolding complete. Next: Initial track generation." | Section 3.0 |
   | `3.3_initial_track_generated` | "Project already initialized. Use `/conductor:new-track` or `/conductor:implement`." | HALT |
   | Unrecognized | Announce error. | HALT |

---

## 1.2 Pre-Initialization Overview

Present the following overview to the user:

> "Welcome to Conductor. I will guide you through the following steps to set up your project:
> 1. **Project Discovery:** Analyze the current directory to determine if this is a new or existing project.
> 2. **Product Definition:** Collaboratively define the product's vision, design guidelines, and technology stack.
> 3. **Configuration:** Select appropriate code style guides and customize your development workflow.
> 4. **Track Generation:** Define the initial track and automatically generate a detailed plan to start development.
>
> Let's get started!"

---

## 2.0 Phase 1: Streamlined Project Setup

### 2.0 Project Inception

#### Detect Project Maturity

**Check brownfield indicators (run in parallel where possible):**

1. **Version control check:**
   ```bash
   test -d .git && echo "git:yes" || echo "git:no"
   ```

2. **Manifest check:**
   ```bash
   ls package.json requirements.txt go.mod pom.xml Cargo.toml build.gradle pubspec.yaml *.csproj 2>/dev/null | head -3 || echo "manifest:none"
   ```

3. **Source directories check:**
   ```bash
   ls -d src app lib cmd internal 2>/dev/null | head -3 || echo "src:none"
   ```

**Evaluation:**
- **Brownfield:** ANY indicator returns positive result
- **Greenfield:** ALL checks return negative/none, directory empty or only README

> **Override:** If user provided `brownfield` or `greenfield` as argument, skip detection and use that classification.

#### Execute by Maturity

**If Brownfield:**
1. Announce that an existing project has been detected.
2. Check `git status --porcelain`. If output is not empty, warn: "WARNING: You have uncommitted changes. Please commit or stash before proceeding."
3. **Begin Brownfield Analysis Protocol:**
   a. **Request Permission:** Ask user for read-only scan permission (A: Yes / B: No). If denied, halt.
   b. **Respect Ignore Files:** Check for `.gitignore` (and `.claudeignore` if exists). Use their patterns to exclude files from analysis.
   c. **Efficiently List Relevant Files:**
      ```bash
      git ls-files --exclude-standard -co 2>/dev/null | head -50 || find . -maxdepth 3 -type f -not -path '*/.git/*' -not -path '*/node_modules/*' -not -path '*/dist/*' -not -path '*/.idea/*' | head -50
      ```
   d. **Prioritize Key Files:** Focus on README.md, manifest files (package.json, go.mod, etc.), and configuration files first.
   e. **Handle Large Files:** For files over 1MB, read only first and last 20 lines.
   f. **Extract and Infer:**
      - Programming languages and frameworks
      - Database drivers and services
      - Architecture type (Monorepo, MVC, Microservices, etc.)
      - Project goal (from README or manifest description)
   g. **Present Findings:** Summarize analysis for user confirmation before proceeding.

**If Greenfield:**
1. Announce that a new project will be initialized.
2. Init git if `.git` does not exist: `git init`
3. Ask: "What do you want to build?"
4. **CRITICAL:** Wait for user response before proceeding.
5. Create `conductor/` directory.
6. Initialize state file: `conductor/setup_state.json` with `{"last_successful_step": ""}`
7. Write user's response to `conductor/product.md` under `# Initial Concept`.

---

### 2.1 Generate Product Guide (Interactive)

1. **Introduce:** Announce creation of `product.md`.
2. **Ask Questions Sequentially:** One question at a time. Max **5 questions**.
   - **CRITICAL:** Wait for user response after each question before asking the next.
   - **Question Classification:**
     - **Additive** (brainstorming scope — users, goals, features): Present options with "(Select all that apply)"
     - **Exclusive Choice** (singular commitment — primary tech, workflow rule): Single answer, no multi-select
   - **Suggestions:** For each question, generate 3 high-quality suggested answers based on context.
   - **Format:** Vertical list with options:
     ```
     A) [Option A]
     B) [Option B]
     C) [Option C]
     D) Type your own answer
     E) Auto-generate and review product.md
     ```
   - **For Brownfield:** Ask context-aware questions based on code analysis.
   - **Auto-Generate (Option E):** Stop asking questions. Use best judgment to infer remaining details. Generate full content.
3. **Draft Document:** Generate `product.md` content.
   - **CRITICAL:** Source of truth is ONLY the user's selected answers. Ignore unselected options. Do NOT include A/B/C/D/E in the final file.
4. **User Confirmation Loop:**
   > "I've drafted the product guide. Please review:"
   > ```markdown
   > [Drafted content]
   > ```
   > A) **Approve** — Proceed to next step
   > B) **Suggest Changes** — Tell me what to modify
   - Loop until approved.
5. **Write File:** Write approved content to `conductor/product.md`.
6. **Update State:** Write `{"last_successful_step": "2.1_product_guide"}` to `conductor/setup_state.json`.

---

### 2.2 Generate Product Guidelines (Interactive)

1. **Introduce:** Announce creation of `product-guidelines.md`.
2. **Ask Questions Sequentially:** Same protocol as 2.1. Max **5 questions**.
   - Example topics: Brand voice/tone, design standards, communication style, visual identity.
   - Same question classification (Additive vs Exclusive Choice).
   - Same format with options A-E (E = "Auto-generate and review product-guidelines.md").
3. **Draft Document:** Generate `product-guidelines.md`.
4. **User Confirmation Loop:** Same as 2.1.
5. **Write File:** Write to `conductor/product-guidelines.md`.
6. **Update State:** `{"last_successful_step": "2.2_product_guidelines"}`

---

### 2.3 Generate Tech Stack (Interactive)

1. **Introduce:** Announce tech stack definition.
2. **Ask Questions Sequentially:** Max **5 questions**.
   - **For Brownfield:**
     - **CRITICAL:** Your goal is to document the *existing* tech stack, not propose changes.
     - State the inferred stack from code analysis. Ask for confirmation:
       ```
       A) Yes, this is correct.
       B) No, I need to provide the correct tech stack.
       ```
     - If user disputes, allow manual input.
   - **For Greenfield:**
     - Same interactive protocol as 2.1.
     - Example topics: Languages, frameworks, databases, deployment.
     - Options A-E (E = "Auto-generate and review tech-stack.md").
3. **Draft Document:** Generate `tech-stack.md`.
4. **User Confirmation Loop:** Same as 2.1.
5. **Write File:** Write to `conductor/tech-stack.md`.
6. **Update State:** `{"last_successful_step": "2.3_tech_stack"}`

---

### 2.4 Select Code Styleguides (Interactive)

1. **List Available Guides:** Scan the plugin's templates directory:
   ```bash
   ls templates/code-styleguides/*.md 2>/dev/null || ls ~/.claude/plugins/conductor/templates/code-styleguides/*.md 2>/dev/null
   ```
   Available: TypeScript, Python, Go, JavaScript, HTML/CSS, C#, C++, Dart, General.

2. **Recommend Based on Tech Stack:**
   - **Brownfield:** "Based on the inferred tech stack, I will copy: [list]. Would you like to proceed?"
     ```
     A) Yes, proceed with suggested guides.
     B) No, I want to add/remove guides.
     ```
   - **Greenfield:** Recommend guides matching tech-stack.md. Ask:
     ```
     A) Include recommended guides.
     B) Edit the selection.
     ```
   - If user edits, present numbered list of all available guides for selection.

3. **Copy Selected Guides:**
   ```bash
   mkdir -p conductor/code_styleguides
   cp templates/code-styleguides/<selected>.md conductor/code_styleguides/
   ```
   Always include `general.md` as a baseline.

4. **Update State:** `{"last_successful_step": "2.4_code_styleguides"}`

---

### 2.5 Select Workflow (Interactive)

1. **Copy Template:** Copy `templates/workflow.md` to `conductor/workflow.md`.

2. **Customize Workflow:** Ask:
   > "Do you want to use the default workflow or customize it?"
   > Default: 80% coverage, commit per task, git notes enabled.
   ```
   A) Default
   B) Customize
   ```

3. **If Customize (Option B):**
   - **Q1:** "Default test coverage is >80%. Change?" → A) No (keep 80%) / B) Yes (type new %)
   - **Q2:** "Commit after each task or each phase?" → A) Per task (recommended) / B) Per phase
   - **Q3:** "Use git notes or commit message for task summaries?" → A) Git Notes (recommended) / B) Commit Message
   - Update `conductor/workflow.md` based on responses.

4. **Update State:** `{"last_successful_step": "2.5_workflow"}`

---

### 2.6 Finalization

1. **Generate Index File:** Create `conductor/index.md`:
   ```markdown
   # Project Context

   ## Definition
   - [Product Definition](./product.md)
   - [Product Guidelines](./product-guidelines.md)
   - [Tech Stack](./tech-stack.md)

   ## Workflow
   - [Workflow](./workflow.md)
   - [Code Style Guides](./code_styleguides/)

   ## Management
   - [Tracks Registry](./tracks.md)
   - [Tracks Directory](./tracks/)
   ```

2. **Summarize Actions:** Present summary of all files created and guides copied.

3. **Transition:** Announce initial setup is complete, proceeding to first track generation.

---

## 3.0 Initial Plan and Track Generation

### 3.1 Generate Product Requirements (Greenfield Only)

1. **Analyze Context:** Read `conductor/product.md` to understand the project concept.
2. **Ask Questions Sequentially:** Max **5 questions** about user stories, functional/non-functional requirements.
   - Same question classification protocol (Additive vs Exclusive Choice).
   - Options A-E (E = "Auto-generate the rest and move to next step").
3. **CRITICAL:** Source of truth is ONLY user's selected answers.

### 3.2 Propose Initial Track

1. **Announce:** Explain that a "track" is a high-level unit of work (feature, bug fix, chore).
2. **Generate Track Title:** Analyze project context and propose a single initial track.
   - **Greenfield:** Usually an MVP track.
   - **Brownfield:** Focused on maintenance or targeted enhancement.
3. **User Confirmation:** Present track title for approval. If declined, ask for alternative.

### 3.3 Create Track Artifacts

1. **Delegate to Planner Agent:**
   ```
   Task tool:
   - subagent_type: 'conductor:planner'
   - prompt: |
       Create spec and plan for initial track: <description>
       Project type: <brownfield|greenfield>
       Context files: product.md, tech-stack.md, workflow.md
       Generate spec.md and plan.md with TDD task structure.
       CRITICAL: Include status markers [ ] for EVERY task and sub-task.
       CRITICAL: Inject Phase Completion Tasks if workflow defines
       Phase Completion Verification Protocol. Format:
       - [ ] Task: Conductor - User Manual Verification '<Phase Name>' (Protocol in workflow.md)
       Return artifacts for review.
   ```

2. **Create Artifacts:**
   a. Generate Track ID: `<shortname>_YYYYMMDD`
   b. Create `conductor/tracks.md`:
      ```markdown
      # Project Tracks

      This file tracks all major tracks for the project. Each track has its own detailed plan in its respective folder.

      ---

      - [ ] **Track: <Track Description>**
        *Link: [./tracks/<track_id>/](./tracks/<track_id>/)*
      ```
   c. Create directory: `conductor/tracks/<track_id>/`
   d. Write `spec.md`, `plan.md` in track directory
   e. Create `metadata.json`:
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
   f. Create `index.md` in track directory:
      ```markdown
      # Track <track_id> Context

      - [Specification](./spec.md)
      - [Implementation Plan](./plan.md)
      - [Metadata](./metadata.json)
      ```

3. **Update State:** `{"last_successful_step": "3.3_initial_track_generated"}`

---

## 4.0 Completion

1. **Commit:**
   ```bash
   git add conductor/ && git commit -m "conductor(setup): Initialize environment"
   ```

2. **Announce:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CONDUCTOR SETUP COMPLETE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Project now has:
   ✅ Product context    → conductor/product.md
   ✅ Product guidelines → conductor/product-guidelines.md
   ✅ Tech stack         → conductor/tech-stack.md
   ✅ Code styleguides   → conductor/code_styleguides/
   ✅ Workflow           → conductor/workflow.md
   ✅ Project index      → conductor/index.md
   ✅ First track        → conductor/tracks/<track_id>/

   Next: Run /conductor:implement to start working!
   ```
