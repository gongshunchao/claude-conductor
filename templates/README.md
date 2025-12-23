# Conductor Templates

This directory contains default templates used during `/conductor:setup`.

## Available Templates

### `workflow.md`

The default development workflow template that defines:

- **Guiding Principles**: Core development philosophy (TDD, planning, coverage)
- **Task Workflow**: 11-step task lifecycle with TDD cycles
- **Phase Completion Protocol**: Verification and checkpointing process
- **Quality Gates**: Pre-commit checklist
- **Commit Guidelines**: Conventional commit format

## How Templates Are Used

During `/conductor:setup`:

1. **Workflow**: The `workflow.md` template is copied to `conductor/workflow.md`
2. **Customization**: User is prompted to customize settings (coverage target, commit strategy, etc.)
3. **Tech-specific**: Language-specific settings are added based on detected tech stack

## Customizing Templates

### Project-Level Overrides

After setup, you can edit `conductor/workflow.md` directly. Changes are tracked in git and apply only to your project.

### Plugin-Level Customization

To customize the default templates for all projects:

1. Fork/clone the conductor plugin
2. Edit files in the `templates/` directory
3. Use your customized plugin with `--plugin-dir`

## Template Variables

Templates support these placeholders that are replaced during setup:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{project_name}}` | Name from product.md | "My App" |
| `{{coverage_target}}` | User-selected coverage | "80%" |
| `{{commit_strategy}}` | Per-task or per-phase | "task" |

## Files NOT in Templates

The following files are **generated dynamically** during setup based on user Q&A, not copied from templates:

- `product.md` - Product vision, goals, users (from interactive questions)
- `product-guidelines.md` - Brand voice, design standards (from interactive questions)
- `tech-stack.md` - Technologies, frameworks (from project detection + user input)
- `tracks.md` - Master track list (created empty, populated by `/conductor:newTrack`)
