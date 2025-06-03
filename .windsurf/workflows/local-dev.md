---
description: How to run the Encuentra.ai apps locally for development.
---

# Local Development

1. **Start Supabase locally**
   - See [supabase-setup](supabase-setup.md) for instructions.
2. **Start the Apps**
   - Use Turborepo to run multiple apps:
     - `bun turbo run dev` (from the monorepo root)
   - Or run each app individually:
     - Main app: `cd apps/app && bun dev`
     - API: `cd apps/api && bun dev`
     - Marketing site: `cd apps/web && bun dev`
3. **Access Applications**
   - Main app: http://localhost:3000
   - API: http://localhost:54321 (Supabase default)
   - Marketing site: http://localhost:3001 (or as configured)
4. **Hot Reloading**
   - Changes will auto-reload in most cases.
5. **Debugging**
   - Use browser dev tools and console logs for troubleshooting.

See [troubleshooting](troubleshooting.md) if you encounter issues.
