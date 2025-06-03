---
description: Advanced git workflows for scalable, safe, and high-velocity SaaS monorepo development.
---

# Git Workflows

## Branching Strategy
- **Trunk-based development** is preferred for high-velocity teams: keep `main` always deployable.
- Use **short-lived feature branches** (`feature/xyz`, `fix/bug-123`). Merge or rebase frequently to avoid drift.
- For large features, use **feature flags** instead of long-lived branches.
- **Release branches** (`release/vX.Y.Z`) are only for preparing production releases, not for ongoing development.

## Pull Requests (PRs)
- Keep PRs small and focused. Large PRs slow down review and increase merge conflicts.
- Use **draft PRs** early for feedback.
- Require at least one review and all checks to pass before merging.
- Link PRs to issues for traceability.
- Use **conventional commit messages** for clarity and automation.

## Rebasing vs. Merging
- Prefer **rebase** over merge for feature branches to keep history linear and readable.
- Never rebase `main` or shared branches after pushing.

## Anti-patterns & Pitfalls
- Avoid **long-lived branches**: they cause painful merges and stale code.
- Avoid "merge commits" for every feature; use squash or rebase for a clean history.
- Never force-push to `main` or shared branches.

## Scaling Advice
- Automate branch protection rules (required reviews, CI checks, no force-push).
- Use CODEOWNERS for critical areas.
- Regularly prune stale branches.
- For large teams, consider monorepo tools like Nx or Turborepo’s affected commands to minimize CI scope.

## Rationale & Philosophy
A disciplined git workflow is the backbone of a healthy codebase. It enables fast iteration, safe releases, and a culture of accountability. Prioritize clarity, automation, and collaboration at every step.
