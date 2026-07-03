# Deployment Plan

## Goal

Publish the frontend preview to a free Vercel-generated domain so the client can review the website before Supabase/admin work begins.

## Current Status

- Frontend stack: Next.js, TypeScript, Tailwind CSS.
- Data source: local mock data.
- Ecommerce features: intentionally excluded.
- Production build command: `npm run build`.

## Recommended Deployment Flow

1. Create a GitHub repository named `profitness-catalog`.
2. Push this local repository to GitHub.
3. In Vercel, choose **Add New Project**.
4. Import the GitHub repository.
5. Use Vercel's detected Next.js settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Development command: `npm run dev`
6. Deploy.
7. Share the generated `*.vercel.app` URL with the client.

## Commands If GitHub CLI Is Available

```bash
gh auth login
gh repo create profitness-catalog --private --source=. --remote=origin --push
```

## Commands If Creating The Repo Manually

Create an empty GitHub repository first, then run:

```bash
git remote add origin https://github.com/<your-user>/profitness-catalog.git
git branch -M main
git push -u origin main
```

## Vercel CLI Option

If the Vercel CLI is installed and authenticated:

```bash
vercel
vercel --prod
```

For the client preview, importing from GitHub in the Vercel dashboard is usually the cleanest option because future pushes will trigger deployments automatically.
