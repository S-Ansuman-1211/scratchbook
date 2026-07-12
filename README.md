# ScratchBook Publications

Full-stack website for **ScratchBook Publications** (an independent unit under Inkzoid
Publication) — a book-publishing platform offering mentorship, publishing packages, branding,
promotions, an author dashboard, magazines, blog, events and e-commerce checkout.

Built from the three project documents: *Website Flow 2026*, *Author Dashboard*, and *Website.pdf*.

## Tech stack
Next.js 15 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Auth.js (NextAuth) · PhonePe · Vercel

## Quick start
```bash
npm install
cp .env.example .env     # fill in DATABASE_URL, NEXTAUTH_SECRET, PhonePe credentials
npm run db:push
npm run db:seed
npm run dev              # http://localhost:3000
```

Demo logins (after seeding):
- **Author:** `author@scratchbook.test` / `password123`
- **Customer:** `customer@scratchbook.test` / `password123`

## Documentation
- **[CLIENT-REQUIREMENTS.md](./CLIENT-REQUIREMENTS.md)** — everything to collect from the client.
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — how to deploy, set up the DB, and how auth works.

## Project structure
```
src/
  app/
    (site)/          Public pages (Home, Services, Books, Blog, Magazine, Events, About, Contact, Cart)
    dashboard/       Author dashboard (overview, books, sales, order-copies, premium, marketing)
    login/ signup/   Auth pages
    api/             auth, signup, cart, checkout, checkout/status, checkout/callback, contact
  components/        Navbar, Footer, Providers
  lib/               prisma, auth, phonepe, finalizeOrder, money
  data/              services catalog
prisma/
  schema.prisma      Database schema
  seed.ts            Demo data
```

## Key routes
| Route | Description |
|---|---|
| `/` | Home / banner / featured books |
| `/services` | Full services catalog with pricing tiers |
| `/books`, `/magazine`, `/blog`, `/events` | Catalog pages |
| `/login`, `/signup` | Authentication |
| `/cart` | Cart + PhonePe checkout (redirects to `/payment-status`) |
| `/dashboard` | Author dashboard (author-only) |
| `/api/*` | Backend endpoints |
