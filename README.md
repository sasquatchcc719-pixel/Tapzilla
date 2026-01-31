# Tapzilla

**An AI Salesperson Behind Every QR Code**

Tapzilla is a full-stack SaaS platform that turns QR code scans into AI-powered conversations that capture qualified leads.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4o-mini
- **Payments**: Stripe (per-lead billing)
- **Deployment**: Vercel

## Features

### Marketing Website
- Homepage with interactive chat demo
- How it works page
- Pricing page (per-lead tiers)
- Channel pages (Vehicle, Job Site, Partner, Handout)
- Industry-specific landing pages
- About, Contact, Privacy, Terms pages

### Platform Features
- **Chatbot System** (`/c/[code]`) - The core product. AI conversations that capture leads.
- **Customer Dashboard** (`/dashboard`) - Leads, QR codes, settings
- **Admin Dashboard** (`/admin`) - Platform-wide stats, company management
- **Onboarding Wizard** - Multi-step new customer setup
- **Authentication** - Supabase Auth with email/password

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account
- OpenAI API key

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for chatbot)
OPENAI_API_KEY=your_key

# Stripe (for billing)
STRIPE_SECRET_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL in `database/schema.sql` in the Supabase SQL Editor
3. This creates all tables, RLS policies, and seed data

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

## Site Structure

```
/                      → Marketing homepage
/how-it-works          → Product explanation
/pricing               → Per-lead pricing
/channels/*            → Distribution methods
/industries/*          → Industry-specific pages
/about, /contact       → Company pages

/auth/login            → Sign in
/auth/signup           → Create account
/auth/forgot-password  → Password reset
/onboarding            → New customer setup wizard

/c/[code]              → THE CORE PRODUCT - AI chatbot page

/dashboard             → Customer dashboard
/dashboard/leads       → Lead management
/dashboard/qr-codes    → QR code management
/dashboard/settings    → Account settings

/admin                 → Platform admin overview
/admin/companies       → All companies
/admin/all-leads       → All leads (platform-wide)
```

## Multi-Tenant Architecture

- Every query is scoped by `company_id`
- Row Level Security (RLS) enforces data isolation
- Users are linked to companies via `company_users` table
- Platform admins can see all data

## Key Files

- `database/schema.sql` - Complete database schema
- `src/lib/supabase/` - Supabase client configuration
- `src/app/c/[code]/page.tsx` - Chatbot page (core product)
- `src/components/chat/ChatWindow.tsx` - Chat component
- `src/app/api/chat/route.ts` - AI chat API

## License

Proprietary - All rights reserved
