// Services catalog — transcribed from "Website Flow - 2026" doc.
// Prices that are explicitly listed in the doc are included (in rupees).
// Where the doc gives no price, the item is shown as "Enquire".

export type PriceTier = { label: string; rupees: number };

export type ServiceItem = {
  name: string;
  description?: string;
  tiers?: PriceTier[];
  note?: string;
};

export type ServiceGroup = {
  slug: string;
  title: string;
  blurb: string;
  items: ServiceItem[];
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    slug: "workshops-mentorship",
    title: "Workshops & Mentorship",
    blurb:
      "Not everything can be learned from school, the internet or the library. Sometimes the only way to advance is to learn directly from a mentor.",
    items: [
      { name: "Anthology writing workshop", description: "Learn to compile stories, prose, essays or poetry professionally and choose a strong book theme." },
      { name: "Solo book writing workshop", description: "Lectures and writing exercises covering everything needed to write a book to publishing standard." },
      { name: "Personal mentorship for anthologies", description: "Guidance on choosing co-authors, taking submissions and formatting the manuscript." },
      { name: "Personal mentorship for solo books", description: "A professional writer mentors you through the art of story-telling." },
    ],
  },
  {
    slug: "book-publishing",
    title: "Book Publishing",
    blurb: "Your Thoughts, Our Efforts. From manuscript to best-seller, we put in 100% effort.",
    items: [
      { name: "Publishing services" },
      { name: "Listing and Distribution" },
      { name: "Editing and Proofreading" },
      { name: "Format Setting" },
      { name: "Cover Design" },
      { name: "Anthology Compiler Packages" },
    ],
  },
  {
    slug: "solo-book-packages",
    title: "Solo Book Packages",
    blurb: "Tiered publishing packages to match every author's needs and budget.",
    items: [
      { name: "SB Basic" },
      { name: "SB Bronze" },
      { name: "SB Silver" },
      { name: "SB Gold" },
      { name: "SB Crystal" },
      { name: "SB Deluxe" },
      { name: "SB Diamond" },
      { name: "SB Platinum" },
      { name: "SB Radium" },
    ],
  },
  {
    slug: "special-services",
    title: "ScratchBook Special Services (SBSP)",
    blurb: "Bespoke service bundles for authors who want a tailored journey.",
    items: Array.from({ length: 10 }, (_, i) => ({ name: `SBSP - ${i + 1}` })),
  },
  {
    slug: "branding",
    title: "Branding",
    blurb:
      "The digital era is ruled by those with the most value. A brand is the new way of building trust — through consistency and genuineness.",
    items: [
      { name: "Personal Branding" },
      { name: "Page Branding" },
    ],
  },
  {
    slug: "digital-promotions",
    title: "Digital Promotions",
    blurb: "Target selected audiences, and choose when and where — unlike traditional promotions.",
    items: [
      { name: "One YouTube interview" },
      { name: "YouTube review" },
      { name: "FM session" },
      { name: "Article on Newspaper" },
      { name: "Local hoarding or posters in hometown" },
      { name: "Exclusive Book Reading session" },
      { name: "Digital Promotions on Publication's social pages" },
      { name: "Google Ads and SEO" },
      { name: "Analysis by a critic" },
      { name: "Reviews by known book/media houses" },
    ],
  },
  {
    slug: "recognition",
    title: "Recognition Packages",
    blurb: "Celebrate and certify the author's achievements.",
    items: [
      { name: "Digital and Hardcopy certifications" },
      { name: "Medals and Trophies" },
      { name: "Push into Best-Selling authors" },
      { name: "Featuring Author and Book on Google" },
      { name: "Chance to apply for records" },
    ],
  },
  {
    slug: "writing-services",
    title: "Writing Services",
    blurb: "What if a normal person can be a published author now? Through our writing services, we turn your idea into your desired book.",
    items: [
      { name: "Content writing" },
      { name: "Copywriting" },
      { name: "Conversion of story/script into a book" },
      { name: "Language translation of the book" },
      { name: "Development from idea to book" },
      { name: "Conversion into an Audio Book" },
    ],
  },
  {
    slug: "post-release-promotions",
    title: "Post-Release Promotions",
    blurb: "A set of 12 customisable services. Prices below are exactly as quoted by ScratchBook (book cost excluded where noted).",
    items: [
      { name: "Giveaway", description: "Host a giveaway to reach a wider audience.", tiers: [{ label: "3 slots", rupees: 300 }], note: "Per slot ₹100. 3 slots suggested." },
      { name: "Gift Voucher", description: "Hosted from your or a reviewer's account.", tiers: [{ label: "2 slots", rupees: 100 }] },
      { name: "Promotional Posters", tiers: [{ label: "30 slots", rupees: 450 }, { label: "50 slots", rupees: 750 }, { label: "100 slots", rupees: 1500 }] },
      { name: "Missing letters of the title", description: "Reviewers reshare your missing-letter posts to build curiosity.", tiers: [{ label: "10 slots", rupees: 300 }, { label: "20 slots", rupees: 600 }, { label: "30 slots", rupees: 900 }] },
      { name: "Short reviews", description: "8–10 line reviews on Amazon & Goodreads (excl. book cost).", tiers: [{ label: "30 slots", rupees: 2000 }, { label: "50 slots", rupees: 3000 }, { label: "100 slots", rupees: 6000 }] },
      { name: "Long reviews", description: "Reviews on Amazon, Instagram & Goodreads (excl. book cost).", tiers: [{ label: "30 slots", rupees: 4000 }, { label: "50 slots", rupees: 6000 }, { label: "100 slots", rupees: 9000 }] },
      { name: "Only Rating (Kindle)", tiers: [{ label: "30 slots", rupees: 300 }, { label: "50 slots", rupees: 1250 }, { label: "100 slots", rupees: 2500 }], note: "Kindle recommended; 30 slots suggested." },
      { name: "Only Rating (Paperback)", tiers: [{ label: "30 slots", rupees: 100 }, { label: "50 slots", rupees: 1500 }, { label: "100 slots", rupees: 3000 }], note: "Excludes book cost." },
      { name: "Trailer", description: "Reviewers (200+ followers) share your book trailer on Instagram.", tiers: [{ label: "30 slots", rupees: 600 }] },
      { name: "YouTube reviews", description: "A YouTuber posts a review; price depends on the reviewer.", note: "Typically 1 slot." },
      { name: "Blog reviews", tiers: [{ label: "10 slots", rupees: 400 }, { label: "20 slots", rupees: 500 }, { label: "30 slots", rupees: 600 }], note: "20 slots suggested." },
      { name: "Live Interviews", description: "One high-following reviewer hosts a 45-min live session.", tiers: [{ label: "1 reviewer", rupees: 300 }] },
      { name: "Author Interview Post", description: "Reviewer posts your Q&A on their feed.", tiers: [{ label: "2 slots", rupees: 400 }] },
      { name: "Buyback", description: "Reviewers buy the paperback and give a 5-star, 10–15 line review (excl. book cost).", tiers: [{ label: "30 slots", rupees: 2000 }, { label: "50 slots", rupees: 4000 }, { label: "100 slots", rupees: 8000 }] },
    ],
  },
  {
    slug: "gifts-dedications",
    title: "Gifts & Dedications",
    blurb: "Thoughtful add-ons to make every book personal.",
    items: [
      { name: "Customized Bookmarks" },
      { name: "Specialized Bookmarks" },
      { name: "Basic Illustrations" },
      { name: "Customized Illustrations" },
      { name: "Regular Author Note" },
      { name: "Customized Author Note" },
      { name: "Dedicated Memoirs" },
      { name: "Special quotes / ode to close people" },
      { name: "Dedicate books to loved ones" },
    ],
  },
];
