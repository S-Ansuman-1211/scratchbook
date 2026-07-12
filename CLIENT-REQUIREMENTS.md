# What we need from the client — ScratchBook Publications

This is the list of everything to collect from the client so we can finish, deploy and run
the website. Items are grouped by priority. Nothing here requires technical knowledge from the
client — they just need to create a few accounts and hand over the details.

---

## 1. Payments — PhonePe (REQUIRED for selling anything)

Prices in the documents are in INR, so we use the **PhonePe Payment Gateway** (Standard Checkout).

The client must:
1. Register as a merchant at <https://business.phonepe.com> (business/company account).
2. Complete **KYC / onboarding** (PAN, GST if applicable, bank account, business proof). This can take a few days.
3. From the **PhonePe Business Dashboard → Developer Settings**, generate API credentials and send us:
   - **Client ID**
   - **Client Secret**
   - **Client Version** (usually `1`)
4. Decide the **settlement bank account** (where the money lands).
5. In the dashboard, set a **Webhook** username + password (any values they choose) and share them with us — we use these to validate PhonePe's payment confirmations.

> We can build & demo everything against PhonePe's **Sandbox** environment before the client's
> onboarding is complete. Real credentials are only needed to take live money.

**Note on the buyer experience:** PhonePe uses a **redirect** checkout — the buyer is taken to a
PhonePe-hosted page (UPI / card / netbanking) and returned to our site afterwards. (This differs
from a popup-style gateway; it's fully implemented and working.)

---

## 2. Hosting & Domain

- **Domain name** (e.g. `scratchbookpublications.com`) — purchase from GoDaddy/Namecheap, or let us buy on their behalf and bill it.
- Access to the **domain DNS** settings (or give us the registrar login) so we can point it to the site.
- A **GitHub account** (free) to host the code, or permission to host it under ours.
- A **Vercel account** (free tier is enough to start) — can sign in with GitHub.

---

## 3. Branding assets

- **Logo** (PNG/SVG, transparent background) — and a smaller "favicon" version.
- **Brand colours** if they have a guideline (we currently use purple + gold + cream; easy to change).
- Any **fonts** they want (otherwise we use clean defaults).
- 3–6 **hero / banner images** for the homepage (or we use tasteful placeholders).

---

## 4. Content (can come in stages)

| Section | What we need |
|---|---|
| **Home** | Final tagline + intro paragraph (we drafted from their doc), testimonials (name + quote). |
| **About Us** | Confirm the text we transcribed; team photos if any. |
| **Services** | Confirm/replace prices. Packages **SB Basic → SB Radium** and **SBSP 1–10** currently have no prices — we need them. |
| **Books** | For each book: title, author, cover image, description, ISBN, language, genre, pages, size, and prices (paperback / hardcase / ebook). |
| **Magazine** | Cover images, PDFs, edition names, page counts. |
| **Blog** | Articles (title + body + image), or we set up a simple admin to add them later. |
| **Events** | Current competitions, banners, dates, rules. |
| **Contact** | Official **email**, **phone**, **address**, and **social media links** (Instagram, YouTube, etc.). |

---

## 5. Email (for notifications & contact form)

To send order confirmations, password resets and receive contact-form messages, we need ONE of:
- A **transactional email provider** account (Resend / SendGrid / Brevo — free tiers available), **or**
- The client's **business email** credentials (e.g. Google Workspace SMTP).

The client should also tell us **which email address** should receive contact-form enquiries.

---

## 6. Legal pages

Text (or approval to draft) for:
- Terms & Conditions
- Privacy Policy
- Copyright / Refund & Shipping policy (PhonePe requires a refund & shipping policy to be visible).

---

## 7. Author onboarding policy (business decision)

- Can **anyone** sign up as an Author, or do authors get **approved/invited** by the publication first?
  (Right now signup creates an author account immediately — easy to switch to "approval required".)
- Print cost per book and shipping charges for **Order Author Copies** (currently placeholder values).

---

## Summary — the 4 things that unblock launch
1. ✅ PhonePe **Client ID + Client Secret + Client Version** (sandbox to start) + webhook username/password.
2. ✅ **Domain** + DNS access.
3. ✅ **Logo** + contact details (email, phone, socials).
4. ✅ **Package prices** (SB tiers, SBSP) and **book details/covers**.

Everything else can be filled in progressively after the site is live.
