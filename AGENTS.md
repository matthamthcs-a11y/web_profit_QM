# AGENTS.md

## Project Context

This project is a modern product catalog and brand website for Profitness, inspired by the structure of https://hammernutrition.com but without ecommerce checkout, cart, customer account, subscription, or payment flows.

The immediate goal is to build the frontend first, deploy it quickly to a free Vercel-generated domain, and give the client a polished preview they can review.

## Product Direction

- Build a catalog/display website, not an online store.
- Keep the layout similar in spirit to Hammer Nutrition: strong homepage, product categories, featured products, knowledge content, trust signals, reviews, dealer/contact paths, and a dense footer.
- Modernize the visual design with cleaner spacing, stronger product imagery, clearer typography, less ecommerce clutter, and mobile-first responsive behavior.
- Primary calls to action should be consultation-focused: view products, see new products, contact for advice, find dealers, download catalog/certificates.
- Avoid checkout, cart, payment, user account, coupon, and order-tracking features unless explicitly requested later.

## Recommended Stack

- Framework: Next.js with App Router.
- Language: TypeScript.
- Styling: Tailwind CSS.
- Icons: lucide-react.
- Hosting: Vercel.
- Free preview domain: use Vercel-generated `*.vercel.app` URLs until a paid/custom domain is needed.
- Backend later: Supabase for products, categories, brands, blog posts, documents, leads, newsletter signups, and admin data.

## Frontend-First Scope

For the first client preview, use local mock data instead of wiring Supabase immediately.

Required pages:

- Home
- Products listing
- Product detail
- Brands
- Knowledge/blog listing
- Blog detail
- Dealers
- About
- Contact

Required homepage sections:

- Header with category-oriented navigation
- Hero/banner with CTA buttons
- Featured categories
- Featured/best-selling products
- Why choose Profitness
- Brands distributed
- Certifications/documents preview
- Knowledge/blog preview
- Customer reviews
- Fast consultation CTA
- Footer with grouped links and contact channels

Required product detail content:

- Product name, image, category, brand, origin, size/flavor attributes
- Short summary
- Benefits/usage goals
- Ingredients and nutrition facts area
- Usage instructions
- Suitable audience
- FAQ
- Related products
- Contact/advice CTA instead of buy button

## Design Rules

- Design for a sports nutrition audience: energetic, credible, product-focused, and clean.
- Keep UI dense enough for product discovery, but avoid a cluttered ecommerce feel.
- Use real product/category visual placeholders only until client assets are available.
- Do not make a generic marketing landing page; make the first screen feel like the actual website experience.
- Use cards for repeated product/blog/review items only.
- Avoid nested cards and decorative gradient blobs.
- Ensure mobile layouts are fully usable and text never overlaps controls or images.
- Use accessible contrast, semantic headings, and visible focus states.

## Data Modeling Assumptions

Create frontend mock data in typed files before Supabase exists.

Suggested entities:

- Category
- Product
- Brand
- BlogPost
- Testimonial
- Dealer
- DocumentAsset

Keep data shape close to what Supabase tables will likely need later.

## Deployment Plan

- Initialize a Git repository before first deploy.
- Push to GitHub.
- Import the repository into Vercel.
- Use Vercel preview/production generated URLs for client review.
- Keep environment variables out of Git.
- Add Supabase only after the frontend structure and content model are approved.

## Verification

Before considering a frontend milestone complete:

- Run lint/build checks available in the project.
- Start the local dev server and verify the primary pages.
- Check desktop and mobile viewports.
- Check that navigation links resolve.
- Check that no ecommerce-only UI is present.
- Check basic SEO metadata for each route.

## Future Backend Scope

When the client approves the frontend direction, add Supabase in phases:

- Public read data for products, categories, brands, blogs, dealers, and documents.
- Storage for product images, nutrition facts, catalogs, certificates, COA, and ATTP documents.
- Admin authentication.
- CRUD admin screens.
- Contact form persistence and newsletter signups.

## Collaboration Rules For Codex

- Prefer implementation over long proposals once the user approves a direction.
- Keep changes scoped and avoid unrelated refactors.
- Ask before adding paid services, ecommerce features, or production dependencies with broad impact.
- Use existing project patterns once the project is scaffolded.
- If adding a new page or component, include responsive behavior from the start.
- If a command needs network access or writes outside the workspace, request approval.
