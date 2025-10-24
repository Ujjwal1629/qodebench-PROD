# QodeBench Setup Guide

This guide will help you get QodeBench up and running in under 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works great!)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to finish setting up (takes ~2 minutes)
3. Go to **Settings** → **API** in your Supabase dashboard
4. Copy your **Project URL** and **anon public** key

### 3. Configure Environment Variables

Your `.env.local` file already exists. Update it with your Supabase credentials:

```env
# Replace these with your actual values from Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional - for OpenAI features
OPENAI_API_KEY=your-openai-api-key

# Update if deploying
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Enable Email Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** authentication
3. Configure email templates (optional but recommended)

### 5. Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Visit the homepage** - You'll see the QodeBench landing page
2. **Create an account** - Click "Get Started" or go to `/signup`
3. **Sign in** - Use the credentials you just created
4. **Explore the dashboard** - You'll be redirected to `/dashboard`

## Project Structure Overview

```
qodebench/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (signin/signup)
│   ├── dashboard/         # Protected dashboard
│   └── page.tsx           # Landing page
├── components/
│   ├── auth/             # Auth forms and components
│   ├── providers/        # React Query provider
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── supabase/        # Supabase client utilities
│   └── utils.ts         # Helper functions
├── hooks/               # Custom React hooks (useAuth)
├── store/              # Zustand state management
└── types/              # TypeScript type definitions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

## Common Issues

### "Invalid Supabase URL" Error

Make sure you've replaced the placeholder values in `.env.local` with your actual Supabase credentials.

### Port Already in Use

If port 3000 is in use, Next.js will automatically use the next available port (e.g., 3001).

### Build Fails

Ensure all environment variables are set correctly. The build process requires valid Supabase URLs.

## Next Steps

Now that your app is running, you can:

1. **Customize the branding** - Update colors in `tailwind.config.ts`
2. **Add database tables** - Create tables in Supabase dashboard
3. **Update TypeScript types** - Modify `types/supabase.ts` to match your schema
4. **Install more UI components** - Run `npx shadcn@latest add [component]`
5. **Deploy to Vercel** - Connect your GitHub repo for automatic deployments

## Getting Help

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

Happy coding! 🚀
