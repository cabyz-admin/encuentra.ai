---
description: How to set up and run local Supabase for Encuentra.ai development.
---

# Supabase Setup

1. **Install Docker**
   - Required for running Supabase locally. [Docker installation guide](https://docs.docker.com/get-docker/)
2. **Start Supabase**
   - From the repo root, run:
     - `bunx supabase start`
   - This will spin up the local Supabase stack (Postgres, Auth, Studio, etc.).
3. **Check Supabase Status**
   - Visit http://localhost:54323 for Supabase Studio.
   - Default API port: 54321
4. **Seed or Migrate Database (if needed)**
   - Follow project-specific instructions if migrations or seed scripts are present.
5. **Stop Supabase**
   - `bunx supabase stop`

For more, see [Supabase docs](https://supabase.com/docs/guides/local-development).
