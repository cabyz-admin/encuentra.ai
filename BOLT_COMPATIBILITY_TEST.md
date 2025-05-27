# 🧪 Bolt.new Compatibility Testing Guide

## Test Strategy Overview

This guide tests all scenarios a user might encounter in Bolt.new to ensure 100% compatibility.

## 🔍 Test 1: Primary Workflow (Global Turbo)

Simulate what happens when Turbo installs successfully:

```bash
# Clean slate
rm -rf node_modules package-lock.json

# Test 1a: Install Turbo globally (as per jumpstart guide)
npm install -g turbo

# Test 1b: Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Test 1c: Test root-level scripts
npm run dev:app    # Should work
npm run dev:web    # Should work
npm run build      # Should work
npm run lint       # Should work
```

## 🔍 Test 2: Fallback Workflow (Individual Apps)

Simulate when Turbo doesn't work or workspace issues occur:

```bash
# Clean slate
rm -rf node_modules package-lock.json

# Test 2a: Install in individual apps
cd apps/app && npm install
cd ../web && npm install
cd ../..

# Test 2b: Run individual apps
cd apps/app && npm run dev &    # Background process
cd ../web && npm run dev &      # Background process

# Test 2c: Check if both apps start
# App should be on http://localhost:3000
# Web should be on http://localhost:3001
```

## 🔍 Test 3: Workspace Dependency Resolution

Test if shared packages (`@v1/ui`, `@v1/analytics`, etc.) resolve correctly:

```bash
# Test 3a: Check workspace linking
npm ls @v1/ui
npm ls @v1/analytics

# Test 3b: Try building with workspace deps
cd apps/app && npm run build
cd ../web && npm run build
```

## 🔍 Test 4: Environment Variables

Test minimal setup for basic development:

```bash
# Test 4a: Copy env files
cp apps/app/.env.example apps/app/.env
cp apps/web/.env.example apps/web/.env

# Test 4b: Start with minimal env (should not crash)
cd apps/app && npm run dev
# Check browser console for missing env warnings (should be non-fatal)
```

## 🔍 Test 5: Bolt.new Specific Scenarios

### Scenario A: "workspace:*" Error
```bash
npm install
# If this fails with workspace error:
npm install --legacy-peer-deps
```

### Scenario B: "turbo command not found"
```bash
npm run dev
# If this fails:
cd apps/app && npm run dev
```

### Scenario C: Module Resolution Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
cd apps/app && rm -rf node_modules
cd ../web && rm -rf node_modules
cd ../..

# Try individual installs
cd apps/app && npm install
cd ../web && npm install
```

## 🔍 Test 6: Production Build Simulation

Test if apps can be built for production:

```bash
# Test 6a: Build individual apps
cd apps/app && npm run build
cd ../web && npm run build

# Test 6b: Check build outputs
ls apps/app/.next
ls apps/web/.next

# Test 6c: Try production start
cd apps/app && npm run start &
cd ../web && npm run start &
```

## 🎯 Success Criteria

### ✅ Must Pass:
- [ ] At least one of the main approaches works (global turbo OR individual apps)
- [ ] Both apps start on different ports without conflicts
- [ ] Apps can be built successfully
- [ ] No fatal errors in browser console
- [ ] UI components render correctly (from @v1/ui package)

### ⚠️ Acceptable Issues:
- [ ] Missing external service warnings (Supabase, etc.)
- [ ] Non-fatal console warnings about environment variables
- [ ] Some lint warnings

### 🚨 Failure Conditions:
- [ ] Cannot install dependencies at all
- [ ] Cannot start any app
- [ ] Build process completely fails
- [ ] Workspace dependencies not resolving
- [ ] Fatal module resolution errors

## 🚀 Automated Test Script

Save this as `test-bolt-compatibility.sh`:

```bash
#!/bin/bash
set -e

echo "🧪 Testing Bolt.new Compatibility..."

# Test 1: Primary workflow
echo "📋 Test 1: Primary workflow"
npm install -g turbo
npm install --legacy-peer-deps
timeout 30s npm run dev:app &
sleep 5
curl -f http://localhost:3000 > /dev/null && echo "✅ App started successfully" || echo "❌ App failed to start"
pkill -f "next dev"

# Test 2: Fallback workflow  
echo "📋 Test 2: Fallback workflow"
cd apps/app && npm install && timeout 30s npm run dev &
sleep 5
curl -f http://localhost:3000 > /dev/null && echo "✅ Fallback app started successfully" || echo "❌ Fallback app failed"
pkill -f "next dev"

echo "🎉 Compatibility tests completed!"
```

## 🔗 Real Bolt.new Testing

For ultimate validation, test in actual Bolt.new:

1. **Go to**: https://bolt.new
2. **Import**: Your agenticv1 branch GitHub URL
3. **Run**: The jumpstart commands from `WEBCONTAINER_JUMPSTART.md`
4. **Verify**: App loads and UI works

## 🛠️ Quick Debug Commands

If issues arise during testing:

```bash
# Check node/npm versions
node --version
npm --version

# Check workspace configuration
npm config list
cat .npmrc

# Check package resolution
npm ls --depth=0
npm list @v1/ui

# Check for missing dependencies
npm audit
npm outdated
```

This comprehensive testing ensures your monorepo works perfectly in Bolt.new! 🚀
