# 🚀 Bolt.new Development & Sync Guide

## 📋 **Table of Contents**
1. [Development Workflow](#development-workflow)
2. [10x Faster Development Rules](#10x-faster-development-rules)
3. [Testing Protocol](#testing-protocol)
4. [Sync Back to Main Repo](#sync-back-to-main-repo)
5. [AI-Powered Improvement Process](#ai-powered-improvement-process)
6. [Troubleshooting](#troubleshooting)

---

## 🔄 **Development Workflow**

### **Phase 1: Setup & Start**
```bash
# 1. Open Bolt.new and import your repo
https://github.com/cabyz-admin/encuentra.ai/tree/bolt-standalone

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env.local
# Add your Supabase keys:
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# 4. Start development
npm run dev
```

### **Phase 2: Rapid Development**
- ✅ Use Bolt.new's AI chat for instant code generation
- ✅ Leverage the existing component library in `src/components/ui/`
- ✅ Follow the established patterns in `src/actions/` for server actions
- ✅ Use `src/lib/supabase/` for all database operations

---

## ⚡ **10x Faster Development Rules**

### **🎯 Rule 1: Leverage Existing Architecture**
```typescript
// ✅ DO: Use existing patterns
import { getUser } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/components/button";

// ❌ DON'T: Recreate from scratch
```

### **🎯 Rule 2: Component-First Development**
```bash
# Always start with UI components
src/components/ui/          # Basic UI elements
src/components/            # Feature-specific components
```

### **🎯 Rule 3: Action-Driven Features**
```typescript
// Pattern: Create action first, then UI
// 1. Define schema in src/actions/[feature]/schema.ts
// 2. Create action in src/actions/[feature]/[action-name].ts
// 3. Build UI component that uses the action
```

### **🎯 Rule 4: Database-First Design**
```typescript
// Always use existing Supabase utilities
import { createClient } from "@/lib/supabase/clients/client";
import { getUser } from "@/lib/supabase/queries";
```

### **🎯 Rule 5: Internationalization Ready**
```typescript
// Always use i18n from the start
import { getI18n } from "@/locales/server";
const t = await getI18n();
```

---

## 🧪 **Testing Protocol**

### **Level 1: Local Testing (Bolt.new)**
```bash
# 1. Development server
npm run dev

# 2. Test all features manually
- ✅ Authentication flow (Google OAuth)
- ✅ Protected routes
- ✅ Database operations
- ✅ UI responsiveness
- ✅ Internationalization (EN/FR)

# 3. Build test
npm run build
npm run start
```

### **Level 2: Feature Validation Checklist**
- [ ] **Authentication**: Login/logout works
- [ ] **Database**: CRUD operations function
- [ ] **UI/UX**: Responsive on mobile/desktop
- [ ] **Performance**: Page loads under 2s
- [ ] **Accessibility**: Keyboard navigation works
- [ ] **Internationalization**: Both EN/FR display correctly

### **Level 3: Pre-Sync Validation**
```bash
# 1. Clean build test
rm -rf .next node_modules
npm install
npm run build

# 2. Type checking
npx tsc --noEmit

# 3. Lint check
npm run lint
```

---

## 🔄 **Sync Back to Main Repo**

### **Method 1: Manual File Sync (Recommended)**

#### **Step 1: Identify Changed Files**
```bash
# In Bolt.new, note all files you modified
# Common locations:
- src/app/[locale]/           # New pages
- src/components/             # New components  
- src/actions/                # New server actions
- src/lib/                    # New utilities
- package.json                # New dependencies
```

#### **Step 2: Copy to Local Monorepo**
```bash
# 1. Clone/pull latest main repo
git clone https://github.com/cabyz-admin/encuentra.ai.git encuentra-sync
cd encuentra-sync
git checkout staging  # or create new feature branch

# 2. Copy files from Bolt.new to appropriate locations:
# Bolt.new: src/components/new-feature.tsx
# Monorepo: apps/app/src/components/new-feature.tsx

# 3. Update imports for monorepo structure
# Change: import { Button } from "@/components/ui/components/button"
# To:     import { Button } from "@v1/ui/button"
```

#### **Step 3: Update Package Dependencies**
```bash
# If you added new dependencies in Bolt.new:
# 1. Add to apps/app/package.json in monorepo
# 2. Run bun install (or npm install)
```

#### **Step 4: Test in Monorepo**
```bash
# 1. Start monorepo
bun dev  # or npm run dev

# 2. Test the same features you built in Bolt.new
# 3. Fix any import/dependency issues
```

### **Method 2: Git Patch Method (Advanced)**
```bash
# 1. In Bolt.new terminal (if available)
git diff > my-changes.patch

# 2. Download patch file
# 3. In local monorepo
git apply my-changes.patch
# Then manually fix file paths and imports
```

---

## 🤖 **AI-Powered Improvement Process**

### **Development Notes Template**
Create this file: `DEVELOPMENT_NOTES.md`

```markdown
# Development Session Notes

## Session Date: [DATE]
## Features Built: [LIST]

### ✅ What Worked Well
- [Note successful patterns]
- [Note efficient approaches]

### 🚧 Challenges Encountered  
- [Note problems and solutions]
- [Note import/sync issues]

### 🔄 Improvements Made
- [Note code optimizations]
- [Note UX improvements]

### 📝 Next Session Todos
- [ ] [Specific actionable items]
- [ ] [Performance optimizations]

### 🎯 Patterns to Reuse
- [Note reusable code patterns]
- [Note successful architectural decisions]

### ⚠️ Sync Warnings
- [Note files that need special attention when syncing]
- [Note import changes required]
```

### **AI Improvement Protocol**
1. **Session Start**: Review previous notes
2. **During Development**: Ask AI to explain complex patterns
3. **Session End**: Document learnings and improvements
4. **Sync Process**: Note any friction points for future optimization

### **Code Quality Rules**
```typescript
// Always add these comments for future AI context
/**
 * BOLT_DEV_NOTE: This component follows the established pattern
 * from src/components/posts/posts.server.tsx
 * 
 * SYNC_WARNING: When syncing to monorepo, change imports:
 * - @/lib/supabase -> @v1/supabase  
 * - @/components/ui -> @v1/ui
 */
```

---

## 🚨 **Troubleshooting**

### **Common Bolt.new Issues**
```bash
# Issue: Module not found errors
# Solution: Check src/lib/ folder structure matches imports

# Issue: Supabase auth not working  
# Solution: Verify .env.local has correct keys

# Issue: Build fails
# Solution: Check all imports use @/ prefix, not relative paths
```

### **Common Sync Issues**
```bash
# Issue: Import errors in monorepo
# Solution: Use this conversion table:
@/lib/supabase/clients/client → @v1/supabase/client
@/components/ui/components/button → @v1/ui/button
@/lib/analytics → @v1/analytics

# Issue: Dependencies missing
# Solution: Copy dependencies from Bolt package.json to apps/app/package.json
```

### **Emergency Fixes**
```bash
# If Bolt.new stops working:
1. Fork the bolt-standalone branch
2. Fix issues in your fork
3. Import the fork URL in Bolt.new

# If sync breaks monorepo:
1. Create new feature branch
2. Sync one file at a time
3. Test after each file
```

---

## 🎯 **Success Metrics**

### **Development Speed Targets**
- ⚡ **Simple Feature**: 30 minutes (vs 3 hours traditional)
- ⚡ **Complex Feature**: 2 hours (vs 1 day traditional)  
- ⚡ **Full Page**: 1 hour (vs 4 hours traditional)

### **Quality Gates**
- ✅ **Zero Build Errors**: Both Bolt.new and monorepo
- ✅ **Zero Type Errors**: TypeScript passes
- ✅ **Functional Tests**: All user flows work
- ✅ **Performance**: Page loads under 2s

---

## 📚 **Quick Reference**

### **File Structure Mapping**
```
Bolt.new Standalone → Monorepo Location
src/app/            → apps/app/src/app/
src/components/     → apps/app/src/components/  
src/lib/supabase/   → packages/supabase/src/
src/lib/analytics/  → packages/analytics/src/
```

### **Import Conversion Table**
```typescript
// Bolt.new → Monorepo
"@/lib/supabase/clients/client" → "@v1/supabase/client"
"@/components/ui/components/button" → "@v1/ui/button"  
"@/lib/analytics/server" → "@v1/analytics/server"
"@/lib/kv/ratelimit" → "@v1/kv/ratelimit"
```

---

**🚀 Happy Building! This setup gives you the speed of Bolt.new with the power of your production monorepo.**
