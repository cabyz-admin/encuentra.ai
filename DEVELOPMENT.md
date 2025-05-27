# Development Setup - Dual Compatibility

This monorepo supports both **Bun** (for Railway deployment) and **npm** (for Bolt.new/WebContainers) development environments.

## 🔧 Package Manager Compatibility

### For Railway Deployment (Bun) ✅
```bash
bun install
bun run build
bun run dev
```

### For Bolt.new / WebContainers (npm) ✅
```bash
npm install
npm run build
npm run dev
```

## 📦 Available Scripts

All scripts work with both package managers:

| Command | Description |
|---------|-------------|
| `dev` | Start development servers for all apps |
| `dev:web` | Start only the web app |
| `dev:app` | Start only the mobile app |
| `dev:jobs` | Start the jobs processor |
| `build` | Build all apps for production |
| `start:web` | Start web app in production mode |
| `start:app` | Start mobile app in production mode |
| `test` | Run tests across all packages |
| `lint` | Run linting |
| `typecheck` | Run TypeScript type checking |
| `format` | Format code with Biome |

## 🏗️ Workspace Structure

```
Encuentra/
├── apps/
│   ├── api/          # API server
│   ├── app/          # Mobile app (Next.js)
│   └── web/          # Web app (Next.js)
├── packages/         # Shared packages
├── tooling/          # Development tools
└── turbo.json        # Turbo configuration
```

## 🚀 Deployment

### Railway (Production)
- Uses Bun with `bun.lockb`
- Builds with: `bun turbo build --filter=@v1/web`
- No changes needed for existing deployment

### Bolt.new / Local Development
- Uses npm with `package-lock.json` (when generated)
- Builds with: `npm run build`
- Develops with: `npm run dev`

## 📝 Lock Files

Both lock files are maintained:
- `bun.lockb` - Used by Railway/Bun environments
- `package-lock.json` - Used by npm environments (generated when using npm)

Git will automatically use the appropriate lock file based on the package manager being used.

## ⚡ TurboRepo Integration

All scripts use Turbo directly (no package manager prefix), making them compatible across both environments:
- ✅ `turbo dev` (works with npm, bun)
- ✅ `turbo build` (works with npm, bun)
- ✅ `turbo lint` (works with npm, bun)

This ensures consistent behavior regardless of the package manager used.
