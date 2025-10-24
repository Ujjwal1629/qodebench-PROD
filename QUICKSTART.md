# QodeBench - Quick Start

Get up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Get Supabase Credentials

1. Visit [supabase.com](https://supabase.com) and create a free account
2. Create a new project (takes ~2 minutes)
3. Go to **Settings → API**
4. Copy your **Project URL** and **anon public key**

## 3. Configure Environment

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Enable Email Auth

In Supabase dashboard:
- Go to **Authentication → Providers**
- Enable **Email** provider

## 5. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Test It Out

1. Click "Get Started" to sign up
2. Create an account with email/password
3. You'll be redirected to the dashboard!

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code quality
```

## Add More UI Components

```bash
npx shadcn@latest add [component-name]
```

Available: button, input, card, dialog, toast, form, select, dropdown, tabs, etc.

## File Structure Quick Reference

```
app/
  (auth)/signin     → Sign in page
  (auth)/signup     → Sign up page
  dashboard/        → Protected dashboard
  page.tsx          → Landing page

components/
  auth/             → Auth forms
  ui/               → shadcn components

lib/supabase/       → Database clients
hooks/use-auth.ts   → Auth hook
store/auth-store.ts → Auth state
```

## Need Help?

- Full setup guide: See `SETUP.md`
- Project details: See `PROJECT_SUMMARY.md`
- Issues: Check [Next.js Docs](https://nextjs.org/docs)

That's it! Happy coding! 🚀
