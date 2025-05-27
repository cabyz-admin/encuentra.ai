# 🚀 Encuentra Monorepo - WebContainer Jumpstart Guide

## Quick Launch Instructions for Bolt.new / StackBlitz / WebContainers

This is a **Next.js monorepo** based on the Midday v1 starter kit, optimized for **npm compatibility** in webcontainer environments.

### 📦 Project Structure
```
Encuentra/
├── apps/
│   ├── app/          # Main application (port 3000)
│   ├── web/          # Marketing website (port 3001)
│   └── api/          # Supabase backend
├── packages/         # Shared packages (@v1/ui, @v1/analytics, etc.)
└── tooling/         # Shared configs
```

### ⚡ Quick Start for Bolt.new (Copy-Paste Ready)

```bash
# 1. Install Turbo globally first (required for Bolt.new)
npm install -g turbo

# 2. Set up Bolt.new compatibility (handles workspace: dependencies)
chmod +x setup-bolt.sh && ./setup-bolt.sh

# 3. Use Bolt.new compatible package files
cp apps/app/package-bolt.json apps/app/package.json
cp apps/web/package-bolt.json apps/web/package.json

# 4. Copy simplified next.config.mjs files (removes Sentry dependencies)
cp apps/app/next.config-bolt.mjs apps/app/next.config.mjs
cp apps/web/next.config-bolt.mjs apps/web/next.config.mjs

# 5. Install and run individual apps (fallback approach)
cd apps/app && npm install && npm run dev &
cd ../web && npm install && npm run dev &

# 6. Copy environment files (optional)
cp apps/app/.env.example apps/app/.env
cp apps/web/.env.example apps/web/.env
```

### 🚨 Bolt.new Specific Fixes

**If you get "workspace:*" errors (MAIN ISSUE):**
```bash
# Solution: Use individual app approach with compatible package.json files
cp apps/app/package-bolt.json apps/app/package.json
cp apps/web/package-bolt.json apps/web/package.json
cd apps/app && npm install
cd ../web && npm install
```

**Alternative: Manual setup without workspace deps:**
```bash
# Install each app individually (workspace dependencies removed)
cd apps/app && npm install
cd ../web && npm install
# Then run: npm run dev in each directory
```

### 🚨 Bolt.new Specific Fixes

**If you get "turbo command not found":**
```bash
# Solution: Install Turbo globally
npm install -g turbo

# Or run apps individually
cd apps/app && npm run dev  # Main app on port 3000
cd apps/web && npm run dev  # Web app on port 3001
```

### 🎯 Development URLs
- **Main App**: http://localhost:3000
- **Marketing Web**: http://localhost:3001
- **API**: Supabase-hosted (configure in .env)

### 🔧 Key Scripts (All npm compatible)
```bash
# From root (if Turbo works):
npm run dev           # Start all apps in parallel
npm run dev:app       # Start main app only (port 3000)
npm run dev:web       # Start web app only (port 3001)
npm run build         # Build all apps for production

# From individual apps (Bolt.new fallback):
cd apps/app && npm run dev    # Main app
cd apps/web && npm run dev    # Marketing site

# Other utilities:
npm run lint          # Run linting across monorepo
npm run typecheck     # TypeScript checking
npm run format        # Format code with Biome
```

### 🔑 Environment Variables (Required for full functionality)

**Minimal setup for basic development:**
```env
# apps/app/.env & apps/web/.env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Full production setup** (see .env.example files):
- Supabase (Database, Auth, Storage)
- Upstash Redis (Caching, Rate limiting)
- Resend (Email delivery)
- Sentry (Error monitoring)
- OpenPanel (Analytics)
- Trigger.dev (Background jobs)

### 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS
- **Monorepo**: TurboRepo + npm workspaces
- **Type Safety**: TypeScript + Zod validation

### ⚠️ Common WebContainer Issues & Solutions

**Issue: "Unsupported URL Type workspace:*"**
```bash
# Solution: Use individual app approach with compatible package.json files
cp apps/app/package-bolt.json apps/app/package.json
cp apps/web/package-bolt.json apps/web/package.json
cd apps/app && npm install
cd ../web && npm install
```

**Issue: "turbo command not found"**
```bash
# Solution: Install Turbo globally or run apps individually
npm install -g turbo
# OR fallback to individual apps:
cd apps/app && npm run dev
```

**Issue: "Module not found" errors**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Issue: Port already in use**
```bash
# Solution: Apps use different ports by default
# App: 3000, Web: 3001 - should not conflict
```

**Issue: Workspace dependencies not linking**
```bash
# Solution: Install from individual app directories
cd apps/app && npm install
cd apps/web && npm install
```

### 🎨 UI Components Available
This monorepo includes a complete **shadcn/ui** component library in `packages/ui/`:
- Buttons, Forms, Modals, Tables
- Dark/Light theme support
- Fully customizable with Tailwind

### 📚 Key Files to Understand
- `turbo.json` - Monorepo task configuration
- `packages/ui/` - Shared UI components
- `apps/app/` - Main application
- `apps/web/` - Marketing site
- `.env.example` files - Environment configuration templates

### 🔄 Bolt.new Recommended Workflow
1. **Install Turbo**: `npm install -g turbo`
2. **Install deps**: `npm install --legacy-peer-deps`
3. **Focus on one app**: `cd apps/app && npm run dev`
4. **Test**: Check http://localhost:3000
5. **Develop**: Most UI works without external services

### 💡 Pro Tips for Bolt.new
- **Start with individual apps** (`cd apps/app && npm run dev`) for best compatibility
- Use `--legacy-peer-deps` flag if you get workspace errors
- Install Turbo globally if you want to use the root scripts
- Check browser console for helpful error messages
- Environment variables can be left as placeholders for basic UI development

**Ready to code!** 🎉 Your Encuentra monorepo is now set up and ready for development in Bolt.new!
