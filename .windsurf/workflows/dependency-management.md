---
description: Advanced dependency management for Bun/Turborepo monorepo: security, upgrades, linking, and scaling.
---

# Dependency Management

## Principles
- **Deterministic installs**: Always commit your lockfile (`bun.lockb`) to ensure reproducible builds.
- **Minimal, explicit dependencies**: Only add what you use. Avoid "just in case" dependencies.
- **Monorepo linking**: Use Turborepo’s and Bun’s workspace features to link local packages for dev and test.

## Upgrades & Versioning
- Schedule **regular dependency upgrades** (e.g., weekly). Use tools like Renovate or Dependabot for automation.
- Prefer **semver ranges** for libraries, but pin versions for apps/services.
- Test all upgrades in CI and staging before merging to main.

## Auditing & Security
- Run `bun audit` or equivalent regularly to check for vulnerabilities.
- Monitor security advisories for all core dependencies.
- Remove unused dependencies promptly.

## Anti-patterns
- Avoid duplicate dependencies across packages—deduplicate with Bun/Turborepo tools.
- Don’t blindly upgrade major versions; read changelogs and migration guides.
- Avoid "dependency bloat"—review the impact of each addition on bundle size and attack surface.

## Scaling & Automation
- Use monorepo tools to manage shared dependencies and avoid version drift.
- Automate dependency checks in CI/CD.
- Document rationale for non-obvious dependencies in code or PRs.

## Rationale
A disciplined approach to dependencies reduces security risk, build failures, and maintenance burden. Prioritize clarity, automation, and minimalism for long-term health.
