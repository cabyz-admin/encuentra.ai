---
description: Common troubleshooting steps for local development and deployment issues.
---

# Troubleshooting

## Local Development Issues
- **Dependency errors**: Run `bun install` again. Delete `node_modules` and retry if needed.
- **Port conflicts**: Make sure ports 3000, 3001, 54321, and 54323 are free.
- **Supabase not starting**: Ensure Docker is running and restart Supabase with `bunx supabase start`.
- **.env issues**: Double-check environment variable files are present and correct.

## Deployment Issues
- **Build failures**: Run `bun turbo run build` locally to catch errors before deploying.
- **Environment mismatch**: Ensure production `.env` files are set correctly.
- **API/database errors**: Check Supabase logs and connection strings.

If stuck, ask for help in the team chat or file an issue in the repo.
