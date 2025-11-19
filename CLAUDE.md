# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm start            # Run production server
npm run lint         # Run ESLint

# Adding UI components
npx shadcn@latest add [component-name]
```

## Architecture Overview

### Next.js 15 App Router Structure

QodeBench uses Next.js 15 (with React 19) and App Router. Key architectural patterns:

**Route Groups**: Auth pages use `(auth)` route group for shared layouts without affecting URL structure.

**Path Aliases**: Use `@/` prefix for imports (configured in tsconfig.json:24-27).

### Authentication Architecture

**Three-tier Supabase client system**:

1. **Browser Client** (`lib/supabase/client.ts`): For client components
2. **Server Client** (`lib/supabase/server.ts`): For Server Components and Route Handlers
3. **Middleware Client** (`lib/supabase/middleware.ts`): For route protection

**Auth Flow**:
- Middleware intercepts all requests (middleware.ts:9-18 matcher pattern)
- Session validated via `updateSession()` in lib/supabase/middleware.ts:4
- Protected routes redirect to `/signin` if unauthenticated (middleware.ts:69-73)
- Auth pages redirect to `/dashboard` if authenticated (middleware.ts:76-80)
- Onboarding flow checks profile completion (middleware.ts:82-111)
- Public routes list includes marketing pages, docs, and auth callbacks (middleware.ts:44-62)

**State Management**:
- Client-side auth state: Zustand store (`store/auth-store.ts`)
- Auth operations: `useAuth` hook (`hooks/use-auth.ts`)
- Real-time sync via `onAuthStateChange` listener (use-auth.ts:22-26)

### Data Fetching

- **React Query**: Configured in `components/providers/query-provider.tsx`
- **Server Components**: Use `createClient()` from `lib/supabase/server.ts`
- **Client Components**: Use `createClient()` from `lib/supabase/client.ts`

### Database Schema

The app uses a comprehensive Supabase schema defined in `supabase/migrations/`:

**Core Tables**:
- `profiles`: User profiles with experience level, points, streaks, onboarding status, subscription tier/status
- `challenges`: Coding challenges with test cases, difficulty levels, and validation types
  - `challenge_type`: 'code' | 'document' | 'mixed' (for smart editor selection)
  - `response_format`: 'javascript' | 'typescript' | 'markdown' | 'text' | 'json'
  - `validation_type`: 'test_cases' | 'ai_only' | 'hybrid' (structure + AI quality)
- `submissions`: User code submissions with AI feedback
- `leaderboard_entries`: Rankings (global, weekly, monthly)
- `mock_interviews`: Interview sessions with AI evaluation
- `learning_modules`, `learning_lessons`, `learning_quizzes`: Structured learning content
- `chat_sessions`, `chat_messages`: Learning chat history
- `digital_badges`, `user_badges`: Badge system for achievements
- `subscriptions`: User subscription records (tier, status, dates, Razorpay IDs)
- `payment_transactions`: Payment history with Razorpay integration

**Key Features**:
- Automatic profile creation via database trigger `handle_new_user()`
- Row Level Security (RLS) policies on all tables
- Support for weekly challenges and learning paths
- Hybrid validation system for flexible challenge types

### Environment Variables

Required variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY         # Service role (optional)
OPENAI_API_KEY                     # For AI features (optional)
NEXT_PUBLIC_APP_URL                # App URL for metadata
RAZORPAY_KEY_ID                    # Razorpay API key for server-side (optional)
RAZORPAY_KEY_SECRET                # Razorpay secret key (optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID        # Razorpay key for client-side (optional)
RAZORPAY_WEBHOOK_SECRET            # Razorpay webhook secret (optional)
```

Placeholder values used in lib/supabase files allow builds without crashing (see client.ts:4-5).

## Important Patterns

### Supabase Client Usage

**Server Components**:
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data } = await supabase.from('table').select();
```

**Client Components**:
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
```

Never import the wrong client type - it will cause hydration errors.

### Middleware Critical Pattern

The space between `createServerClient` and `supabase.auth.getUser()` must remain empty (middleware.ts:35-37). This prevents random logout issues.

### Form Validation & Error Handling

Uses React Hook Form + Zod for type-safe validation.

**Authentication Forms Pattern**:
All auth forms (signin, signup, reset-password, update-password) use consistent inline error/success banners:
- Banners appear **above the Card component** (before heading), not as toast notifications
- Error messages: Red banner with AlertCircle icon
- Success messages: Green banner with CheckCircle icon
- Messages auto-clear when user starts typing
- State managed via `errorMessage` and `successMessage` useState hooks

**Password Input**:
Use `PasswordInput` component (`components/ui/password-input.tsx`) for all password fields - includes built-in visibility toggle (eye icon).

### API Routes

All API routes follow Next.js 15 Route Handler pattern in `app/api/`:
- Always check auth first using `await createClient()` then `supabase.auth.getUser()`
- Return proper HTTP status codes
- Use TypeScript for type safety

**API Structure**:
- `api/ai/`: AI-powered features (hints, companion chat, feedback, validation)
- `api/auth/`: Authentication endpoints
- `api/challenges/`: Challenge submission and validation
- `api/interview/`: Mock interview system with evaluation (text-to-speech, voice-to-text, evaluate, report generation)
- `api/learning/`: Learning module endpoints with chat sessions (quiz submission, chat history, messages)
- `api/payments/`: Razorpay payment integration (create-order, verify-payment, webhook, subscription-status, cancel-subscription)
- `api/debug/`: Debug utilities

**AI Integration**:
- OpenAI API calls in routes like `api/ai/hint`, `api/ai/companion`
- Challenge validation with test case execution in `api/challenges/submit`
- Hybrid validation in `api/ai/validate-hybrid` (structure checks + AI quality assessment)
- Interview evaluation in `api/interview/evaluate`

### TypeScript Strict Mode

Project uses strict TypeScript (tsconfig.json:10). All code must pass type checking with strict mode enabled.

### React 19 Compatibility

The project uses React 19, which includes:
- New `use()` hook for reading resources
- Automatic batching improvements
- Enhanced Server Components support
- Updated hooks behavior (ensure compatibility when adding new dependencies)

## Component Organization

**Component Structure**:
- `components/ui/`: shadcn/ui base components (Button, Card, Dialog, etc.)
- `components/auth/`: Authentication forms (signin, signup, reset-password, update-password)
- `components/challenges/`: Challenge-related components
  - Editor components: `code-editor.tsx`, `markdown-editor.tsx`, `text-editor.tsx`, `flexible-editor.tsx`
  - Challenge UI: `challenge-workspace.tsx`, `challenge-card.tsx`, `validation-result.tsx`
  - Learning: `ai-learning-companion.tsx`, `hint-section.tsx`
- `components/dashboard/`: Dashboard-specific components (sidebar, topbar)
- `components/interviews/`: Mock interview components
- `components/leaderboard/`: Leaderboard table and user profile modal
- `components/paywall/`: Subscription paywall components
- `components/settings/`: User settings (avatar-upload, settings-client, subscription-manager)
- `components/providers/`: Context providers (QueryProvider, theme provider)

**Component Patterns**:
- Use `"use client"` directive for client components with hooks/interactivity
- Server components by default for data fetching
- Separate business logic into custom hooks in `hooks/`
- Keep component files focused on presentation; extract logic to hooks

**Navigation Active State**:
Sidebar and mobile nav use smart active state matching (`components/dashboard/sidebar.tsx`, `mobile-nav.tsx`):
- Dashboard tab: Exact match only (`pathname === '/dashboard'`)
- All other tabs: Prefix match (`pathname.startsWith(item.href)`) to keep parent highlighted when on nested routes
- Example: `/dashboard/learning/html-css` keeps "Learning" tab highlighted

## Styling

- **Tailwind CSS** with custom config (tailwind.config.ts)
- **Primary brand color**: `#0ea5e9` (QodeBench Sky Blue - tailwind.config.ts:19)
- **Accent color**: `#a855f7` (Purple - tailwind.config.ts:32)
- **shadcn/ui components** in `components/ui/`
- **CSS variables** defined in `app/globals.css` for theming
- **Animation**: Uses `tailwindcss-animate` plugin and Framer Motion for complex animations

### Challenge Validation System

QodeBench supports multiple validation types for different challenge formats:

**Validation Types**:
1. **test_cases**: Traditional unit test validation for code challenges
2. **ai_only**: Pure AI-based quality assessment (0-100 score)
3. **hybrid**: Two-phase validation combining structure checks (50%) + AI quality (50%)

**Editor Components**:
- `code-editor.tsx`: Monaco-based editor for JavaScript/TypeScript/JSON
- `markdown-editor.tsx`: Write/Preview tabs for markdown content
- `text-editor.tsx`: Plain text editor for simple responses
- `merge-conflict-resolver.tsx`: Interactive VS Code-style UI for merge conflict resolution
- `flexible-editor.tsx`: Smart router that selects editor based on `challenge.response_format`

**Response Formats**:
- `javascript`, `typescript`, `json`: Code challenges using Monaco editor
- `markdown`, `text`: Document challenges using markdown/text editors
- `merge_conflict_interactive`: Interactive MCQ-style merge conflict resolution

**Challenge Workspace Pattern**:
```typescript
// Reads challenge metadata
const { challenge_type, response_format, validation_type } = challenge;

// Selects appropriate editor
<FlexibleEditor responseFormat={response_format} />

// Routes to correct validation endpoint
const endpoint = validationType === 'hybrid' || validationType === 'ai_only'
  ? '/api/ai/validate-hybrid'
  : '/api/challenges/submit';
```

**Hybrid Validation Flow** (`/api/ai/validate-hybrid`):
1. **Structure Phase (50 points)**: Objective checks for required sections, length, formatting
2. **Quality Phase (50 points)**: AI assessment of clarity, completeness, professionalism
3. **Final Score**: Always 0-100, with 70+ being passing

See `HYBRID_VALIDATION_IMPLEMENTATION.md` for detailed implementation guide.

**Interactive Merge Conflict Challenges**:

A special challenge type for teaching Git merge conflict resolution through interactive, step-by-step MCQ scenarios.

**Structure** (`response_format: 'merge_conflict_interactive'`):
- Challenge stores scenarios in `test_cases.scenarios[]`
- Each scenario has: `id`, `context`, `description`, `currentBranch`, `incomingBranch`, `currentCode`, `incomingCode`, `correctAnswer`, `explanation`
- User navigates through scenarios, selecting resolution strategies for each

**Resolution Options** (VS Code-style):
- `accept_current`: Keep changes from HEAD branch
- `accept_incoming`: Keep changes from merging branch
- `accept_both`: Include both sets of changes
- `compare_changes`: View side-by-side comparison (no selection)

**Component Flow**:
1. `FlexibleEditor` detects `merge_conflict_interactive` format
2. Renders `MergeConflictResolver` with scenarios from `test_cases.scenarios`
3. User progresses through scenarios step-by-step
4. On completion, submits JSON: `{ scenarios: [{ id, selected, timeSpent }] }`

**Validation** (`/api/ai/validate-hybrid`):
- **Phase 1 (50%)**: Binary check - correct answer = 12.5 points per scenario (4 scenarios)
- **Phase 2 (50%)**: Base score of 25 points (AI reasoning optional)
- **Passing**: Score >= 70
- **Result**: Per-scenario feedback with correct answers and explanations

**Database Migration**: `037_convert_merge_conflict_to_interactive.sql`
- Updates `office-merge-conflict` challenge
- Sets `response_format` to `merge_conflict_interactive`
- Defines 4 realistic merge conflict scenarios

### Learning Modules & Mock Interviews

**Learning System**:
- **Modules**: HTML/CSS, JavaScript, React/Next.js, Backend/APIs, Office Fundamentals
- **Structure**: Each module has lessons with content, quizzes, and chat-based learning
- **AI Companion**: Interactive chat feature for asking questions during lessons
- **Progress Tracking**: Quiz scores, lesson completion stored in database
- **Migration Files**: `011_html_css`, `012_javascript`, `013_react_nextjs`, `014_backend_apis`, `015_office_fundamentals`

**Mock Interview System**:
- **Voice Interaction**: Speech-to-text and text-to-speech for realistic interviews
- **AI Evaluation**: Real-time feedback on technical answers
- **Report Generation**: Comprehensive performance reports after interviews
- **Session Management**: Track interview progress, allow abandonment
- **API Endpoints**: `voice-to-text`, `text-to-speech`, `evaluate`, `generate-report`, `abandon`

**Badge & Rewards System**:
- Digital badges for achievements
- Leaderboard system (global, weekly, monthly)
- Merchandise rewards for top performers
- Points and streaks for engagement tracking

### Payment & Subscription System

**Payment Provider**: Razorpay integration for Indian market

**Subscription Tiers** (defined in `types/subscription.ts`):
- `free`: Beginner challenges only, 5 AI feedback uses per day, all learning modules free
- `beta`: 21-day trial at ₹199 (originally ₹999) - All tiers unlocked
- `quarterly`: ₹1999 for 3 months - Introductory offer
- `yearly`: ₹4999 for 6 months (duration: 180 days) - Best value

**Access Control Pattern**:
```typescript
// Server-side checks in API routes
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

// Check auth + subscription access
const { user, error } = await verifyInterviewAPIAccess();
if (error) return error;
```

**Subscription Utilities** (`lib/utils/subscription-check.ts`):
- `hasActiveSubscription()`: Check if user has paid tier
- `canAccessChallengeTier()`: Tier-based challenge access
- `canAccessInterviews()`: Interview prep access check
- `canMakeAttempt()`: Daily limit enforcement for free tier
- `canUseAIFeedback()`: AI feedback limit check
- `incrementDailyUsage()`: Track usage for free tier
- `getDailyLimits()`: Get remaining attempts/feedback

**Payment Utilities** (`lib/razorpay.ts`):
- `createRazorpayOrder()`: Create payment order
- `verifyRazorpaySignature()`: Server-side payment verification (critical for security)
- `verifyRazorpayWebhook()`: Validate webhook signatures
- `calculateSubscriptionEndDate()`: Compute end dates by tier
- `generateReceiptId()`: Create unique receipt IDs

**Paywall Components** (`components/paywall/`):
- `upgrade-required.tsx`: Feature locked message
- `locked-content-banner.tsx`: In-page upgrade prompts
- `daily-limit-reached.tsx`: Free tier limit notifications

**Important Security Patterns**:
1. Always verify payments server-side using `verifyRazorpaySignature()`
2. Never trust client-side payment completion
3. Use timing-safe comparison for signature verification
4. Validate all webhook requests with `verifyRazorpayWebhook()`
5. Check subscription status server-side before granting access
6. RLS policies protect payment data in database

**Database Functions**:
- `increment_daily_usage()`: Atomic counter for free tier tracking
- `reset_daily_limits()`: Scheduled job (cron) to reset at midnight
- `update_subscription_status()`: Auto-expire trials/subscriptions

**Setup**: See `PAYMENT_SETUP_GUIDE.md` for complete integration guide

## Key Gotchas

1. **Server vs Client Supabase**: Always use correct client for environment
2. **Middleware matcher**: Update middleware.ts:9-18 when adding static file types
3. **Auth state sync**: useAuth hook must be called in client components wrapped in QueryProvider
4. **Protected routes**: Non-auth, non-home routes require authentication by default
5. **Cookies API**: Server components use `await cookies()` (Next.js 15 pattern)
6. **Onboarding**: Users are redirected to `/onboarding/quiz` until profile completion
   - Quiz can only be taken once - middleware redirects away if `onboarding_completed` AND `quiz_score` is not null
   - Users who skipped quiz can retake it later (onboarding_completed but quiz_score is null)
7. **Profile creation**: Automatic via database trigger - don't create manually in auth flow
8. **Cache control**: Middleware sets no-cache headers on protected routes to prevent back-button access after logout (middleware.ts:115-119)
9. **React 19**: When adding new dependencies, verify React 19 compatibility
10. **Challenge editors**: Use `FlexibleEditor` component, not hardcoded `CodeEditor`, to support different response formats
11. **Validation scores**: Always enforce 0-100 range; hybrid validation uses 50/50 split for structure/quality
12. **Payment verification**: ALWAYS verify Razorpay signatures server-side; never trust client-side payment success
13. **Subscription checks**: Use `hasActiveSubscription()` or specific access check functions for feature gating
14. **Free tier limits**: Remember to call `incrementDailyUsage()` after free tier actions (attempts, AI feedback)
15. **Cancelled subscriptions**: Users with cancelled subscriptions retain access until end_date expires
16. **Auth error messages**: Never use toast notifications - use inline banners above form headings
17. **Password fields**: Always use PasswordInput component with visibility toggle, not raw Input with type="password"
18. **Pricing tiers**: Only 3 paid tiers (beta, quarterly, yearly) - no monthly tier. Beta shows originalPrice crossed out.
