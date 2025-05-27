#!/bin/bash
# Bolt.new Compatibility Setup Script
# This script prepares the monorepo for WebContainer environments

echo "🚀 Setting up Encuentra for Bolt.new compatibility..."

# Step 1: Install Turbo globally
echo "📦 Installing Turbo globally..."
npm install -g turbo

# Step 2: Create Bolt.new compatible package.json files for individual apps
echo "🔧 Creating Bolt.new compatible configurations..."

# For apps/app
cat > apps/app/package-bolt.json << 'EOF'
{
  "name": "@v1/app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "clean": "git clean -xdf .next .turbo node_modules",
    "lint": "npx biome lint",
    "format": "npx biome format --write .",
    "start": "next start",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "dub": "^0.36.5",
    "geist": "^1.3.1",
    "next": "14.2.7",
    "next-international": "^1.2.4",
    "next-safe-action": "^7.9.0",
    "next-themes": "^0.3.0",
    "nuqs": "^1.18.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@biomejs/biome": "1.8.3",
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5.5.4"
  }
}
EOF

# For apps/web
cat > apps/web/package-bolt.json << 'EOF'
{
  "name": "@v1/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "clean": "git clean -xdf .next .turbo node_modules",
    "lint": "npx biome lint",
    "format": "npx biome format --write .",
    "start": "next start",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@calcom/embed-react": "^1.5.0",
    "geist": "^1.3.1",
    "next": "14.2.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "usehooks-ts": "^3.1.0"
  },
  "devDependencies": {
    "@biomejs/biome": "1.8.3",
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5.5.4"
  }
}
EOF

# Create simplified next.config.mjs for Bolt.new (removes Sentry dependency)
cat > apps/app/next.config-bolt.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
EOF

cat > apps/web/next.config-bolt.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
EOF

# Create simplified tsconfig.json for Bolt.new (removes workspace dependencies)
cat > apps/app/tsconfig-bolt.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > apps/web/tsconfig-bolt.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

echo "✅ Bolt.new setup complete!"
echo ""
echo "🎯 Next steps for Bolt.new:"
echo "1. Copy package-bolt.json to package.json in each app:"
echo "   cp apps/app/package-bolt.json apps/app/package.json"
echo "   cp apps/web/package-bolt.json apps/web/package.json"
echo ""
echo "2. Copy simplified next.config.mjs files:"
echo "   cp apps/app/next.config-bolt.mjs apps/app/next.config.mjs"
echo "   cp apps/web/next.config-bolt.mjs apps/web/next.config.mjs"
echo ""
echo "3. Copy simplified tsconfig.json files:"
echo "   cp apps/app/tsconfig-bolt.json apps/app/tsconfig.json"
echo "   cp apps/web/tsconfig-bolt.json apps/web/tsconfig.json"
echo ""
echo "4. Install and run individual apps:"
echo "   cd apps/app && npm install && npm run dev"
echo "   cd apps/web && npm install && npm run dev"
echo ""
echo "5. Access apps at:"
echo "   - Main App: http://localhost:3000"
echo "   - Marketing: http://localhost:3001"
