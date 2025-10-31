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
- `profiles`: User profiles with experience level, points, streaks
- `challenges`: Coding challenges with test cases and difficulty levels
- `submissions`: User code submissions with AI feedback
- `leaderboard_entries`: Rankings (global, weekly, monthly)
- `mock_interviews`: Interview sessions with AI evaluation
- `learning_modules`, `learning_lessons`: Structured learning content
- `chat_sessions`, `chat_messages`: Learning chat history

**Key Features**:
- Automatic profile creation via database trigger `handle_new_user()`
- Row Level Security (RLS) policies on all tables
- Support for weekly challenges and learning paths

### Environment Variables

Required variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY         # Service role (optional)
OPENAI_API_KEY                     # For AI features (optional)
NEXT_PUBLIC_APP_URL                # App URL for metadata
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

### Form Validation

Uses React Hook Form + Zod for type-safe validation. See `components/auth/signin-form.tsx` and `signup-form.tsx` for patterns.

### API Routes

All API routes follow Next.js 15 Route Handler pattern in `app/api/`:
- Always check auth first using `await createClient()` then `supabase.auth.getUser()`
- Return proper HTTP status codes
- Use TypeScript for type safety

**API Structure**:
- `api/ai/`: AI-powered features (hints, companion chat, feedback)
- `api/auth/`: Authentication endpoints
- `api/challenges/`: Challenge submission and validation
- `api/interview/`: Mock interview system with evaluation
- `api/learning/` & `api/learn/`: Learning module endpoints with chat sessions
- `api/debug/`: Debug utilities

**AI Integration**:
- OpenAI API calls in routes like `api/ai/hint`, `api/ai/companion`
- Challenge validation with test case execution in `api/challenges/submit`
- Interview evaluation in `api/interview/evaluate`

### TypeScript Strict Mode

Project uses strict TypeScript (tsconfig.json:10). All code must pass type checking with strict mode enabled.

### React 19 Compatibility

The project uses React 19, which includes:
- New `use()` hook for reading resources
- Automatic batching improvements
- Enhanced Server Components support
- Updated hooks behavior (ensure compatibility when adding new dependencies)

## Styling

- **Tailwind CSS** with custom config (tailwind.config.ts)
- **Primary brand color**: `#0ea5e9` (QodeBench Sky Blue - tailwind.config.ts:19)
- **Accent color**: `#a855f7` (Purple - tailwind.config.ts:32)
- **shadcn/ui components** in `components/ui/`
- **CSS variables** defined in `app/globals.css` for theming

## Key Gotchas

1. **Server vs Client Supabase**: Always use correct client for environment
2. **Middleware matcher**: Update middleware.ts:9-18 when adding static file types
3. **Auth state sync**: useAuth hook must be called in client components wrapped in QueryProvider
4. **Protected routes**: Non-auth, non-home routes require authentication by default
5. **Cookies API**: Server components use `await cookies()` (Next.js 15 pattern)
6. **Onboarding**: Users are redirected to `/onboarding/quiz` until profile completion
7. **Profile creation**: Automatic via database trigger - don't create manually in auth flow
8. **Cache control**: Middleware sets no-cache headers on protected routes to prevent back-button access after logout (middleware.ts:115-119)
9. **React 19**: When adding new dependencies, verify React 19 compatibility
