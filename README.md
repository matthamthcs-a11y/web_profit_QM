# Profitness Catalog Website

Frontend-first catalog website for Profitness, inspired by Hammer Nutrition's content structure but without ecommerce checkout.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Mock data first, Supabase later
- Vercel for preview deployment

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Current Scope

This first phase creates the frontend foundation: routes, shared layout, typed mock data, and reusable UI components. Supabase integration will come after the client approves the visual/content direction.

## Deploy Preview

Use Vercel for the first client preview. The expected free preview domain will be a generated `*.vercel.app` URL.

Recommended flow:

1. Push this repository to GitHub.
2. Import the GitHub repository into Vercel.
3. Keep the default Next.js build settings:
   - Framework preset: Next.js
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: managed by Next.js
4. Share the generated Vercel URL with the client.
