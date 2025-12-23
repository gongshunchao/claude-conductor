---
name: code-styleguides
description: Language-specific code style guidelines. Use when writing TypeScript, Python, Go, JavaScript, or HTML/CSS code to ensure consistent, idiomatic, and maintainable code following best practices.
allowed-tools: Read, Glob
---

# Code Styleguides

This skill provides language-specific coding standards and best practices.

## Available Styleguides

| Language | File Extension | Styleguide |
|----------|----------------|------------|
| TypeScript | `.ts`, `.tsx` | [references/typescript.md](references/typescript.md) |
| Python | `.py` | [references/python.md](references/python.md) |
| Go | `.go` | [references/go.md](references/go.md) |
| JavaScript | `.js`, `.jsx` | [references/javascript.md](references/javascript.md) |
| HTML/CSS | `.html`, `.css`, `.scss` | [references/html-css.md](references/html-css.md) |

## When to Activate

Activate this skill when:
- Writing new code in any supported language
- Reviewing code for style compliance
- Refactoring existing code
- Setting up new files or modules

## Language Detection

Automatically apply the relevant styleguide based on file extension:
- **TypeScript**: `.ts`, `.tsx`, `.mts`, `.cts`
- **Python**: `.py`, `.pyi`
- **Go**: `.go`
- **JavaScript**: `.js`, `.jsx`, `.mjs`, `.cjs`
- **HTML/CSS**: `.html`, `.htm`, `.css`, `.scss`, `.sass`, `.less`

## Project-Level Overrides

If the project has custom styleguides at `conductor/code_styleguides/`, those take precedence over these defaults.

Check for project overrides:
```bash
ls conductor/code_styleguides/
```

## Common Principles

These principles apply across all languages:

### Naming
- Use descriptive, meaningful names
- Prefer clarity over brevity
- Be consistent within the codebase

### Structure
- Keep functions/methods focused (single responsibility)
- Limit nesting depth (max 3-4 levels)
- Group related code together

### Documentation
- Document the "why", not the "what"
- Keep comments up-to-date with code
- Use docstrings for public APIs

### Error Handling
- Handle errors explicitly
- Fail fast with clear messages
- Never silently swallow errors

### Testing
- Write tests alongside code (TDD)
- Test behavior, not implementation
- Aim for high coverage on critical paths

## Integration

This skill works with:
- **conductor-context**: For project-specific style overrides
- **tdd-workflow**: For language-specific test patterns

## Quick Reference

| Aspect | Recommendation |
|--------|----------------|
| Line length | 80-120 characters |
| Indentation | 2 spaces (JS/TS), 4 spaces (Python), tabs (Go) |
| Naming | Language-specific conventions |
| Imports | Organized and grouped |
| Comments | Minimal, meaningful |
