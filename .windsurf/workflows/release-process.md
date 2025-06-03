---
description: Steps for preparing and publishing a new release of Encuentra.ai.
---

# Release Process

1. **Ensure Main Branch is Stable**
   - All tests should pass and code should be reviewed.
2. **Update Version Numbers**
   - Update `package.json`/`bun.lockb` as needed.
3. **Generate Changelog**
   - Summarize changes since the last release.
4. **Tag the Release**
   - `git tag vX.Y.Z && git push --tags`
5. **Deploy to Production**
   - Follow the [production-deploy](production-deploy.md) workflow.
6. **Announce Release**
   - Notify the team and update documentation if needed.
