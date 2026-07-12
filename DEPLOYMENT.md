# Deployment & Authentication Guide — ScratchBook Publications

This explains the recommended way to deploy the site, set up the database, and how
authentication works. The whole stack runs comfortably on **free tiers** to start.

---

## The stack (and why)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Frontend + backend in one codebase. |
| Styling | **Tailwind CSS** | Fast, consistent, responsive. |
| Database | **PostgreSQL** | Reliable relational DB for orders, users, books. |
| ORM | **Prisma** | Type-safe DB access + easy migrations. |
| Auth | **Auth.js (NextAuth)** | Email/password login with Customer/Author roles. |
| Payments | **PhonePe** (Standard Checkout) | India-first, supports UPI/cards/netbanking, INR native. Redirect-based checkout. |
| Hosting | **Vercel** | One-click deploys for Next.js, free tier, auto HTTPS. |
| DB hosting | **Neon** (or Supabase) | Serverless Postgres, generous free tier. |

---

## Authentication — how it works

- Users register at `/signup` choosing a role: **Customer** or **Author**.
- Passwords are **hashed with bcrypt** — we never store plain passwords.
- Login is handled by **Auth.js Credentials provider**; sessions use **JWT** (no DB lookups per request).
- The user's **role** is embedded in the session. Pages check it:
  - `/dashboard/*` is **author-only** (middleware + server check redirect others).
  - `/cart` and `/checkout` require login.
- To add **Google / social login** later, it's a few lines in `src/lib/auth.ts` (Auth.js supports it out of the box) — we'd just need Google OAuth keys from the client.

> Want author accounts to be **approved** before they can log in? Add an `approved` flag to the
> `User`/`AuthorProfile` model and check it in `authorize()`. Easy change — flagged in CLIENT-REQUIREMENTS.md.

---

## Local setup (developer)

```bash
cd scratchbook-app
npm install
cp .env.example .env        # then fill in the values

# Push the schema to your database and seed demo data
npm run db:push
npm run db:seed

npm run dev                 # http://localhost:3000
```

Demo logins created by the seed:
- Author: `author@scratchbook.test` / `password123`
- Customer: `customer@scratchbook.test` / `password123`

---

## Production deployment (step by step)

### 1. Create the database (Neon)
1. Sign up at <https://neon.tech> → create a project.
2. Copy the **connection string** (starts with `postgresql://…`).

### 2. Push the code to GitHub
```bash
git init
git add .
git commit -m "ScratchBook Publications website"
git branch -M main
git remote add origin https://github.com/<account>/scratchbook.git
git push -u origin main
```

### 3. Deploy on Vercel
1. Go to <https://vercel.com> → **New Project** → import the GitHub repo.
2. Add **Environment Variables** (from `.env.example`):
   - `DATABASE_URL` → the Neon connection string
   - `NEXTAUTH_SECRET` → run `openssl rand -base64 32` to generate
   - `NEXTAUTH_URL` → your production URL (e.g. `https://scratchbookpublications.com`)
   - `APP_BASE_URL` → same production URL (used to build PhonePe redirect/callback URLs)
   - `PHONEPE_CLIENT_ID`, `PHONEPE_CLIENT_SECRET`, `PHONEPE_CLIENT_VERSION` → from client's PhonePe dashboard
   - `PHONEPE_ENV` → `PRODUCTION` (or `SANDBOX` while testing)
   - `PHONEPE_CALLBACK_USERNAME`, `PHONEPE_CALLBACK_PASSWORD` → the webhook credentials you set in PhonePe
3. Click **Deploy**.

### 4. Initialise the production database
From your machine, with the production `DATABASE_URL` in `.env`:
```bash
npm run db:push      # creates tables
npm run db:seed      # (optional) demo content — skip for a clean launch
```
*(For a team workflow, switch `db push` to proper `prisma migrate deploy` migrations.)*

### 5. Point the domain
- In Vercel → Project → **Settings → Domains**, add the client's domain.
- Update DNS at the registrar as Vercel instructs (usually a CNAME / A record).
- HTTPS is automatic.

### 6. PhonePe webhook (recommended)
For bulletproof payment confirmation (covers cases where the buyer closes the tab after paying):
1. PhonePe Business Dashboard → **Developer Settings → Webhooks** → add `https://<domain>/api/checkout/callback`.
2. Set the webhook **username + password** there and put the same values in `PHONEPE_CALLBACK_USERNAME` / `PHONEPE_CALLBACK_PASSWORD`.
   The handler at `/api/checkout/callback` validates every callback against these before trusting it.

---

## Going from Sandbox → Live payments
1. Client completes PhonePe merchant onboarding/KYC.
2. Swap the **sandbox** credentials for **production** ones and set `PHONEPE_ENV=PRODUCTION` in Vercel env vars.
3. Redeploy. That's it.

---

## What's built vs. what's next

**Built and working now**
- Full public site (Home, Services, Books, Blog, Magazine, Events, About, Contact)
- Customer + Author signup/login with roles
- Author Dashboard (overview, books, sales insight, order copies, premium, marketing)
- Cart + PhonePe checkout (redirect flow) + server-side status verification + webhook
- Contact form, database schema + seed data

**Recommended next phase**
- Admin panel to manage books/blog/magazines/events without code
- Email notifications (order confirmation, password reset)
- Order history page for customers
- Image uploads (e.g. Cloudinary/UploadThing) for covers
- Real prices for SB packages & SBSP services once client provides them
