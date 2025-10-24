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

### Next.js 14 App Router Structure

QodeBench uses Next.js 14 with App Router. Key architectural patterns:

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
- Protected routes redirect to `/signin` if unauthenticated (middleware.ts:44-54)
- Auth pages redirect to `/dashboard` if authenticated (middleware.ts:56-61)

**State Management**:
- Client-side auth state: Zustand store (`store/auth-store.ts`)
- Auth operations: `useAuth` hook (`hooks/use-auth.ts`)
- Real-time sync via `onAuthStateChange` listener (use-auth.ts:20-24)

### Data Fetching

- **React Query**: Configured in `components/providers/query-provider.tsx`
- **Server Components**: Use `createClient()` from `lib/supabase/server.ts`
- **Client Components**: Use `createClient()` from `lib/supabase/client.ts`

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

### TypeScript Strict Mode

Project uses strict TypeScript (tsconfig.json:10). All code must pass type checking with strict mode enabled.

## Styling

- **Tailwind CSS** with custom config (tailwind.config.ts)
- **Primary brand color**: `#3B82F6` (QodeBench Blue)
- **shadcn/ui components** in `components/ui/`
- **CSS variables** defined in `app/globals.css` for theming

## Key Gotchas

1. **Server vs Client Supabase**: Always use correct client for environment
2. **Middleware matcher**: Update middleware.ts:9-18 when adding static file types
3. **Auth state sync**: useAuth hook must be called in client components wrapped in QueryProvider
4. **Protected routes**: Non-auth, non-home routes require authentication by default
5. **Cookies API**: Server components use `await cookies()` (Next.js 15 pattern)
