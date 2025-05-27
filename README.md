# Encuentra App - Standalone Next.js Application

A modern Next.js application extracted from the Encuentra monorepo for easy deployment in Bolt.new and other platforms.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Modern UI components
- Internationalization support

## Environment Variables

Copy `.env.example` to `.env.local` and add your environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

This app is optimized for deployment on:
- Bolt.new
- Vercel
- Netlify
- Other static hosting platforms

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting
