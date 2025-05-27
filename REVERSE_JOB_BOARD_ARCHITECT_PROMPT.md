# 🚀 Reverse Job Board MVP - AI Architect Prompt

## 📋 **Project Overview**

I need you to architect and build a **Reverse Job Board MVP** in 2 days using my existing Bolt.new setup with Tailark Blocks and Supabase integration. Unlike traditional job boards where companies post jobs, this platform allows **candidates to post their profiles and companies to find them**.

**Repository**: https://github.com/cabyz-admin/encuentra.ai/tree/bolt-standalone  
**Current Stack**: Next.js 14, TypeScript, Tailwind CSS, Supabase, 100+ Tailark marketing blocks

---

## 🎯 **Core Vision**

Build a **scalable, production-ready reverse job board** where:
- ✅ **Candidates** create compelling profiles showcasing skills, experience, and availability
- ✅ **Companies** browse, filter, and contact candidates directly
- ✅ **Seamless onboarding** for both user types with guided flows
- ✅ **Modern UX** leveraging our Tailark blocks for professional appearance
- ✅ **Scalable architecture** that can handle thousands of users from day one

---

## 🏗️ **Technical Requirements**

### **Database Architecture (Supabase)**
Design a complete PostgreSQL schema including:

```sql
-- USER MANAGEMENT
- users (extends Supabase auth.users)
- user_profiles (candidate/company distinction)
- user_onboarding_status

-- CANDIDATE SYSTEM  
- candidate_profiles
- candidate_skills
- candidate_experience  
- candidate_education
- candidate_portfolios
- candidate_availability
- candidate_preferences (salary, remote, etc.)

-- COMPANY SYSTEM
- company_profiles  
- company_team_members
- company_job_interests
- company_searches
- company_saved_candidates

-- INTERACTION SYSTEM
- candidate_views (tracking)
- company_inquiries  
- conversations/messages
- notifications

-- MATCHING SYSTEM
- skill_tags (standardized)
- industry_tags
- location_data
- matching_scores (future ML)
```

### **Authentication & User Types**
```typescript
// Implement role-based access with Supabase
enum UserType {
  CANDIDATE = 'candidate',
  COMPANY = 'company',
  ADMIN = 'admin'
}

// Multi-step onboarding flows
interface OnboardingFlow {
  step: number;
  completed: boolean;
  user_type: UserType;
  required_fields: string[];
}
```

---

## 📱 **Feature Requirements**

### **🔐 Phase 1: Core MVP (Day 1)**

#### **Authentication & Onboarding**
- [ ] **Google OAuth** (already implemented)
- [ ] **User type selection** (candidate vs company)
- [ ] **Guided onboarding flows**:
  - Candidates: Basic info → Skills → Experience → Preferences
  - Companies: Company info → Team details → Hiring interests
- [ ] **Profile completion indicators** (progress bars)

#### **Candidate Features**
- [ ] **Profile Creation**:
  - Personal info, bio, location
  - Skills with proficiency levels
  - Work experience timeline
  - Education background
  - Portfolio/project links
  - Availability status (active, passive, not looking)
  - Salary expectations & preferences
- [ ] **Profile Visibility Controls**
- [ ] **Basic Dashboard** with profile views/interest metrics

#### **Company Features** 
- [ ] **Company Profile Setup**:
  - Company info, culture, benefits
  - Team size, industry, stage
  - Current hiring needs
- [ ] **Candidate Discovery**:
  - Browse candidate profiles
  - Filter by skills, experience, location, availability
  - Save interesting candidates
- [ ] **Basic Contact System** (direct messages)

#### **Core Pages & Components**
```typescript
// Using Tailark blocks for rapid development
Pages Required:
- /onboarding/[step] (dynamic onboarding)
- /candidate/[id] (public profile view)  
- /company/[id] (company profile)
- /dashboard (role-based dashboard)
- /browse (company: browse candidates)
- /profile/edit (profile management)
- /messages (conversation system)
- /settings (account settings)

Key Components:
- ProfileCard (candidate preview)
- SkillTag (standardized skills)
- ExperienceTimeline 
- CompanyCard
- MessageThread
- FilterSidebar (search/filter)
- OnboardingSteps
```

### **🚀 Phase 2: Enhanced MVP (Day 2)**

#### **Advanced Matching**
- [ ] **Smart Recommendations** (basic algorithm)
- [ ] **Saved Searches** for companies
- [ ] **Profile Analytics** for candidates

#### **Communication System**
- [ ] **In-app Messaging** with thread management
- [ ] **Email Notifications** (Supabase Edge Functions)
- [ ] **Interest Expressions** (like/dislike system)

#### **Enhanced UX**
- [ ] **Advanced Search & Filters**
- [ ] **Profile Sharing** (public links)
- [ ] **Mobile Responsive** design
- [ ] **Dark/Light Mode** support

---

## 🎨 **UI/UX Requirements**

### **Design System**
Leverage existing Tailark blocks for:
- **Hero Sections**: Landing page, feature showcases
- **Forms**: Onboarding, profile editing (use `ContactOne`, `SignUpOne`)
- **Cards**: Profile cards, company cards (use `FeaturesOne`, `TestimonialsOne`)
- **Testimonials**: Social proof on landing page
- **Pricing**: Future subscription plans
- **Stats**: Platform metrics display

### **User Experience Priorities**
1. **Onboarding Speed**: Get users to complete profile in <5 minutes
2. **Discovery Efficiency**: Companies find relevant candidates in <30 seconds
3. **Mobile First**: 70% of users will be on mobile
4. **Loading Performance**: <2s page loads, optimistic UI updates

---

## 🔧 **Technical Architecture**

### **Next.js App Structure**
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── onboarding/[step]/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── browse/
│   │   ├── messages/
│   │   └── settings/
│   ├── candidate/[id]/
│   ├── company/[id]/
│   └── api/
│       ├── candidates/
│       ├── companies/
│       ├── messages/
│       └── matching/
├── components/
│   ├── blocks/ (Tailark components)
│   ├── forms/
│   ├── profiles/
│   ├── messaging/
│   └── onboarding/
├── lib/
│   ├── supabase/ (existing)
│   ├── matching/
│   ├── notifications/
│   └── validations/
└── types/
    ├── database.ts
    ├── user.ts
    └── matching.ts
```

### **Data Flow Architecture**
```typescript
// Implement real-time subscriptions
const useRealTimeNotifications = () => {
  // Supabase realtime for new messages, profile views
}

// Optimistic UI patterns
const useOptimisticMutations = () => {
  // Instant UI updates with rollback on error
}

// Caching strategy
const useCandidateProfiles = () => {
  // TanStack Query with proper caching
}
```

---

## 📊 **Success Metrics & KPIs**

### **Day 1 Goals**
- [ ] Complete user registration flow
- [ ] Candidate can create full profile
- [ ] Company can browse and contact candidates
- [ ] Basic messaging system works
- [ ] Mobile responsive

### **Day 2 Goals**  
- [ ] Advanced search/filtering
- [ ] Email notifications working
- [ ] Profile analytics dashboard
- [ ] Performance optimized (<2s loads)
- [ ] Production deployment ready

### **MVP Success Metrics**
- **User Onboarding**: >80% completion rate
- **Profile Quality**: >90% profiles have all required fields
- **Engagement**: Companies contact candidates within 24h of joining
- **Performance**: <2s page loads, 99% uptime

---

## 🎯 **Implementation Strategy**

### **Hour-by-Hour Breakdown**

#### **Day 1 (8 hours)**
```
Hour 1-2: Database schema + Supabase setup
Hour 3-4: Authentication + user type detection  
Hour 5-6: Onboarding flows (both user types)
Hour 7-8: Basic profile creation (candidates)

Day 1 Deliverable: Users can register, onboard, create profiles
```

#### **Day 2 (8 hours)**
```
Hour 1-2: Company features (browse, filter candidates)
Hour 3-4: Messaging system + notifications
Hour 5-6: Advanced search + matching algorithm
Hour 7-8: Polish, testing, deployment

Day 2 Deliverable: Full MVP ready for users
```

### **Code Quality Requirements**
- [ ] **TypeScript**: Strict mode, proper typing
- [ ] **Error Handling**: Graceful fallbacks, user feedback
- [ ] **Security**: Row Level Security (RLS) in Supabase
- [ ] **Performance**: Code splitting, lazy loading, image optimization
- [ ] **Testing**: Basic unit tests for critical paths

---

## 🚀 **Deployment & Scaling**

### **Infrastructure Setup**
- **Frontend**: Vercel/Netlify (seamless Next.js deployment)
- **Database**: Supabase (PostgreSQL with real-time)
- **File Storage**: Supabase Storage (profile photos, portfolios)
- **Email**: Supabase Edge Functions + SendGrid/Resend
- **Analytics**: Vercel Analytics + custom events

### **Scaling Considerations**
```typescript
// Future features to architect for:
- AI-powered matching algorithms
- Video profile intros  
- Skill assessments
- Company culture matching
- Salary negotiation tools
- Referral programs
- API for third-party integrations
```

---

## 🎁 **Bonus Features (If Time Allows)**

- [ ] **LinkedIn Profile Import** (auto-populate candidate data)
- [ ] **Company Verification** system
- [ ] **Candidate Portfolio** showcase
- [ ] **Saved Candidate Lists** for companies
- [ ] **Email Templates** for outreach
- [ ] **Basic Analytics Dashboard**

---

## 🔥 **AI Architect Instructions**

**Your Mission**: Build this entire reverse job board MVP using the existing Bolt.new setup in 2 days. Focus on:

1. **Speed**: Leverage Tailark blocks for instant professional UI
2. **Scalability**: Design database and architecture for 10,000+ users
3. **User Experience**: Smooth onboarding, fast discovery, seamless messaging
4. **Production Ready**: Proper error handling, security, performance

**Start with**: Database schema design and authentication flows
**Prioritize**: Core user journeys over edge cases
**Deliver**: Working MVP that can acquire real users immediately

**Key Success Factor**: Users should feel this is a polished, professional platform from day one, not a prototype.

---

**Ready to build the future of hiring? Let's make candidates the stars and companies the discoverers! 🚀**
