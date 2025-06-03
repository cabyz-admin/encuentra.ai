---
description: Code formatting standards and automation for a consistent, low-friction monorepo.
---

# Code Formatting

## Tools & Configuration
- Use a single formatter (e.g., Prettier) across all JS/TS/MD/JSON files. Configure in the repo root.
- For language-specific formatting (e.g., SQL, CSS), extend with plugins or dedicated tools.
- Enforce formatting via `.prettierrc`, `.editorconfig`, and VSCode settings in `.vscode/`.

## Automation
- Add `bun run format` and `bun run format:check` scripts in `package.json`.
- Integrate format checks into CI/CD to block unformatted code.
- Use pre-commit hooks (e.g., with Husky or simple Bun scripts) to auto-format staged files.

## Monorepo Considerations
- Share config files across all apps/packages; symlink or reference from root.
- Avoid per-package overrides unless absolutely necessary—consistency > preference.
- Document any exceptions and rationale in the repo.

## Format Churn & Anti-patterns
- Avoid large "format-only" PRs—they create noisy history and merge pain. Instead, format as you go.
- Never disable formatting for convenience; address root causes (e.g., config gaps).

## Rationale
Consistent formatting reduces cognitive load, merge conflicts, and subjective debates. Automate everything so developers can focus on logic, not whitespace.
