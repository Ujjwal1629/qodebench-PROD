# QodeBench

**Master Real-World Coding Skills**

A modern SaaS application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication & Database:** Supabase
- **Data Fetching:** TanStack React Query
- **State Management:** Zustand
- **Deployment:** Vercel-ready

## Features

- ✅ Modern, responsive UI with Tailwind CSS and shadcn/ui
- ✅ Full authentication system (sign up, sign in, sign out)
- ✅ Protected routes with middleware
- ✅ Type-safe database queries with Supabase
- ✅ Optimistic UI updates with React Query
- ✅ Global state management with Zustand
- ✅ Dark mode support
- ✅ Professional branding with custom colors

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd qodebench
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Enable Email authentication in Authentication > Providers

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
qodebench/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth route group
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page
│   ├── dashboard/         # Protected dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase clients
│   └── utils.ts         # Helper functions
├── store/               # Zustand stores
├── types/               # TypeScript types
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. Users sign up/sign in via Supabase Auth
2. Session is managed with HTTP-only cookies
3. Middleware protects routes automatically
4. Auth state is synced with Zustand store
5. React Query manages server state

## Customization

### Brand Colors

The primary brand color is defined in `tailwind.config.ts`:
- Primary: `#3B82F6` (QodeBench Blue)
- Slate palette for neutrals

### Adding Components

Install additional shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables

Make sure to add all variables from `.env.example` to your deployment platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ using Next.js and Supabase
