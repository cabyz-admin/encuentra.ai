---
description: Deployment best practices for multi-app SaaS monorepo with reliability, traceability, and zero-downtime focus.
---

# Deployment

## Environments
- **Staging**: Mirror production as closely as possible. Every PR should be tested here before merging.
- **Production**: Always deploy from `main` or a release branch. Use immutable builds.

## Deployment Strategies
- **Blue-Green Deployments**: Maintain two production environments (blue/green). Deploy to idle, switch traffic, and roll back instantly if needed.
- **Canary Releases**: Gradually shift traffic to new versions, monitoring for regressions.
- **Zero-downtime**: Use atomic swaps or load balancer updates to avoid user impact.

## Rollbacks
- Always have a one-command rollback (e.g., revert to previous build artifact or commit).
- Automate rollback triggers on failed health checks.

## Observability
- Instrument all apps with logging, tracing, and metrics (e.g., Datadog, Sentry, OpenTelemetry).
- Monitor deployments for error spikes and latency.
- Set up alerts for failed deploys, rollbacks, and critical errors.

## Anti-patterns
- Avoid manual deployments—use CI/CD pipelines.
- Never deploy unreviewed or untested code to production.
- Avoid mutable infrastructure; always use versioned, reproducible builds.

## Scaling & Future-proofing
- Automate environment provisioning (infrastructure as code).
- Document all environment variables and secrets management.
- For monorepos: deploy only affected apps/packages to minimize downtime and risk.

## Rationale
A rigorous deployment process reduces downtime, increases confidence, and enables fast recovery from incidents. Invest in automation, monitoring, and rollback strategies early.
