---
description: Steps for deploying Encuentra.ai to production.
---

# Production Deployment

1. **Ensure All Tests Pass**
   - Run `bun turbo run test` or see [run-tests-and-fix](run-tests-and-fix.md).
2. **Build the Apps**
   - `bun turbo run build`
3. **Prepare Environment Variables**
   - Confirm `.env` files are correctly set for production.
4. **Deploy Web/Marketing Site**
   - Deploy `apps/web` to your static hosting (e.g., Vercel, Netlify).
5. **Deploy Main App**
   - Deploy `apps/app` to your hosting provider (e.g., Vercel, AWS, etc.).
6. **Deploy API/Supabase**
   - Deploy `apps/api` or ensure Supabase is running in production mode.
7. **Verify Deployment**
   - Check all endpoints and UIs are working as expected.

For CI/CD integration, see [ci-cd](ci-cd.md).
