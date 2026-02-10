# Changelog

**English** | [中文](CHANGELOG_CN.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-02-10

### Added
- C++ code styleguide template (`templates/code-styleguides/cpp.md`) — Google C++ Style Guide summary
- Dart code styleguide template (`templates/code-styleguides/dart.md`) — Effective Dart conventions
- Development Commands section in workflow template (Setup, Daily Development, Before Committing)
- Testing Requirements section in workflow template (Unit, Integration, Mobile)
- Code Review Process section in workflow template (Self-Review Checklist with 6 categories)
- Emergency Procedures section in workflow template (Critical Bug, Data Loss, Security Breach)
- Deployment Workflow section in workflow template (Pre-Deployment, Steps, Post-Deployment)
- Continuous Improvement section in workflow template
- `conductor/index.md` generation during setup (project context index file)
- Smart Chunking in `/conductor:review` — iterative review for large diffs (>300 lines)
- Auto test suite execution in `/conductor:review` with proactive debugging
- Verification Checks table in review report output
- Ghost commit handling in `/conductor:revert` (rewritten history detection)
- Hierarchical selection menu in `/conductor:revert` grouped by track
- Merge commit and cherry-pick detection in `/conductor:revert`
- Date/time display in `/conductor:status` report
- Project status classification (On Track / Behind Schedule / Blocked / Complete)

### Changed
- **`commands/setup.md`** — Complete rewrite with Gemini Conductor parity:
  - Added welcome overview and step-by-step guided flow
  - Added interactive Q&A protocol with question classification (Additive vs Exclusive Choice)
  - Added max 5 questions per section with auto-generate option (Option E)
  - Added user confirmation loops for each generated document
  - Enhanced brownfield analysis with .gitignore respect, file size triage, large file handling
  - Added code styleguide selection with tech-stack-based recommendations
  - Added workflow customization (coverage target, commit strategy, git notes)
  - Added Phase Completion Task injection in plan generation
  - Added track index.md and metadata.json creation
- **`commands/new-track.md`** — Enhanced with interactive spec/plan generation:
  - Added sequential Q&A for spec.md (3-5 questions for features, 2-3 for bugs)
  - Added spec.md sections: Overview, Functional/Non-Functional Requirements, Acceptance Criteria, Out of Scope
  - Added user confirmation loops for both spec.md and plan.md
  - Added duplicate track name detection
  - Added Phase Completion Task injection in plan generation
  - Added track index.md creation
- **`commands/review.md`** — Enhanced review protocol:
  - Added Principal Software Engineer persona
  - Added Intent Verification and Correctness & Safety dimensions
  - Added C++ and Dart to file extension mapping
  - Added smart chunking strategy for large diffs
  - Added auto test execution with 2-attempt debugging limit
- **`commands/revert.md`** — Complete rewrite with advanced git handling:
  - Added hierarchical selection menu grouped by track
  - Added ghost commit detection for rewritten history
  - Added plan-update commit identification
  - Added track creation commit identification for track reverts
  - Added merge commit and cherry-pick detection
  - Added formatted revert plan and completion reports
- **`commands/status.md`** — Enhanced with date display, project status classification, formatted report
- **`templates/workflow.md`** — Added 6 missing sections from Gemini Conductor, C#/Dart coverage examples, perf/ci commit types
- Updated code-styleguides skill to include C++ and Dart
- Bumped version to 1.4.0

## [1.3.0] - 2026-02-10

### Added
- `/conductor:review` command — Code review against product guidelines, code styleguides, and spec compliance with severity-rated findings report, auto-fix option, and track cleanup (archive/delete/skip)
- C# code styleguide template (`templates/code-styleguides/csharp.md`) — Covers naming, formatting, records, nullable refs, pattern matching, async, DI, and testing
- General code styleguide template (`templates/code-styleguides/general.md`) — Universal standards for naming, file organization, functions, error handling, security, testing, and git commits

### Changed
- Enhanced Track Completion in `/conductor:implement` with document synchronization step (auto-detect and propose updates to product.md, tech-stack.md, product-guidelines.md)
- Enhanced Track Completion with 4-option cleanup: Review (recommended) / Archive / Delete / Skip
- Updated code-styleguides skill to include C# (`.cs`, `.csx`) and General language support
- Bumped version to 1.3.0

## [1.2.0] - 2025-12-29

### Changed
- Session resumption now relies solely on plan.md status markers instead of automatic context threshold tracking

### Removed
- Automatic context threshold tracking and handoff mechanism
- context-threshold.js hook and related Task hook configuration
- Handoff sections from implement command documentation

### Documentation
- Added session resumption documentation to README.md
- Simplified workflow documentation

## [1.1.1] - 2024-12-27

### Added
- Agents and commands now inherit model from parent context when not explicitly set

### Fixed
- Prevent CPU spikes from unbounded parallel file operations in hooks
- Optimize stdin reading in all hook scripts (array collection vs string concatenation)
- Add orphan worktree detection warning on session start
- Document resource limits for concurrent background agents

## [1.0.1] - 2024-12-24

### Fixed
- Agent type references in commands now use fully-qualified names (conductor:planner, conductor:implementer, conductor:reviewer)

## [1.0.0] - 2024-12-24

### Added
- Skills preloading, background agents, and worktree isolation
- Plugin marketplace support with marketplace.json
- Single-phase execution mode with interactive selection
- Context threshold auto-handoff feature
- Code styleguides moved to templates system
- Phase 5 templates and documentation
- Phase 4 hooks automation
- Phase 3 skills integration
- Graceful file existence checks before reading
- Context threshold notification when reached

### Performance
- Parallel tool call instructions across all commands and agents
- Optimized plugin for reduced token usage and faster execution

### Changed
- Updated command references to use kebab-case
- Renamed agents to remove conductor- prefix
- Set explicit models for agents and commands
- Updated model strings throughout

### Fixed
- Source path now uses ./ prefix in marketplace.json
- Improved error handling with graceful file checks

### Documentation
- Updated README title to Claude Conductor
- Enhanced installation instructions with GitHub marketplace
- Added specific Bash commands for pre-flight checks

## [0.1.0] - Initial Release

### Added
- Initial Context-Driven Development framework
- Basic planner, implementer, and reviewer agents
- Core command structure
