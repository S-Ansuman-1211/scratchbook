// Services catalog - transcribed from the SBSP packages doc.
// Prices that are explicitly listed are included (in rupees); otherwise the card
// shows an "Enquire pricing" button.

export type PriceTier = { label: string; rupees: number };

export type ServiceItem = {
  name: string;
  description?: string;
  price?: number; // single fixed price in rupees
  tiers?: PriceTier[];
  note?: string;
};

export type ServiceGroup = {
  slug: string;
  title: string;
  blurb: string;
  note?: string;
  items: ServiceItem[];
};

export const SERVICE_GROUPS: ServiceGroup[] = [
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
    ],
  },
  {
    slug: "solo-book-packages",
    title: "Solo Book Packages",
    blurb: "Complete publishing & distribution packages (inclusive of SBSP services). All packages include ISBN allocation, manuscript making, formatting, print-on-demand and India-wide listing. Author keeps the copyright.",
    items: [
      { name: "SB Basic", price: 999, description: "Publisher's Choice Publishing · up to 100 pages · basic editing · 1 cover round · 50% royalty." },
      { name: "SB Bronze", price: 2499, description: "Publisher's Choice Publishing · up to 100 pages · 1 proofreading round · 1 complimentary copy · 50% royalty." },
      { name: "SB Silver", price: 5499, description: "Publisher's Choice Publishing · up to 150 pages · podcasting & workshops · 2 copies · 50% royalty." },
      { name: "SB Gold", price: 14999, description: "Author-Publisher Partnership · unlimited pages · hardbound + worldwide listing · 4 copies · 70% royalty." },
      { name: "SB Crystal", price: 23999, description: "Author-Publisher Partnership · 5 editing rounds · inventory manager · 6 copies · 70% royalty." },
      { name: "SB Deluxe", price: 44999, description: "Author-Publisher Partnership · 8 editing rounds · 50 books local distribution · 8 copies · 70% royalty." },
      { name: "SB Diamond", price: 87999, description: "Self Publishing · 10 editing rounds · author website · 10 copies · negotiable royalty." },
      { name: "SB Platinum", price: 129999, description: "Self Publishing · 12 editing rounds · 75 books distribution · 12 copies · negotiable royalty." },
      { name: "SB Radium", price: 179999, description: "Self Publishing · 15 editing rounds · 100 books distribution · 15 copies · negotiable royalty." },
    ],
    note: "+ ₹449 for books exceeding the package's page limit. Illustrations and AI/customized covers are chargeable extra.",
  },

  // ── ScratchBook Special Services (SBSP 1-10) as detailed sections ──
  {
    slug: "workshops",
    title: "Workshops",
    blurb: "Learn the craft directly from professionals through hands-on writing workshops.",
    items: [
      { name: "Anthology writing workshop", description: "Learn to compile stories, prose, essays or poetry professionally and choose a strong book theme." },
      { name: "Solo book writing workshop", description: "Lectures and writing exercises covering everything needed to write a book to publishing standard." },
    ],
  },
  {
    slug: "mentorship",
    title: "Mentorship",
    blurb: "Personal, one-on-one mentorship to guide you from the first idea to a finished manuscript.",
    items: [
      { name: "Personal mentorship for anthologies", description: "Guidance on choosing co-authors, taking submissions and formatting the manuscript." },
      { name: "Personal mentorship for solo books", description: "A professional writer mentors you through the art of story-telling." },
    ],
  },
  {
    slug: "branding",
    title: "Branding Services",
    blurb: "A brand is the new way of building trust - through consistency and genuineness.",
    items: [
      { name: "Personal Branding", description: "Build your personal author brand over a period of 3 months." },
      { name: "Page Branding", description: "Copywriting for posters and social media posts." },
    ],
  },
  {
    slug: "writing-services",
    title: "Writing Services",
    blurb: "What if a normal person can be a published author now? Through our writing services, we turn your idea into your desired book.",
    items: [
      { name: "Content writing", description: "Professionally written content for your book or campaign." },
      { name: "Copywriting", description: "Persuasive copy for blurbs, posters and marketing." },
      { name: "Conversion of story/script into a book", description: "Turn your existing story or script into a publish-ready book." },
      { name: "Language translation of the book", description: "Translate your book into another language.", note: "Language translation of a book: ₹2,50,000." },
      { name: "Development from idea to book", description: "We develop your raw idea into a complete book, end to end." },
      { name: "Conversion into an Audio Book", description: "Convert your book into a professionally narrated audiobook." },
    ],
  },
  {
    slug: "digital-package",
    title: "Digital Package",
    blurb: "Reach selected audiences at the right time and place with targeted digital promotions.",
    items: [
      { name: "One YouTube interview", description: "A recorded author interview published on YouTube." },
      { name: "YouTube review", description: "A dedicated review of your book on YouTube." },
      { name: "FM session", description: "A radio (FM) feature promoting your book." },
      { name: "Article on Newspaper", description: "A featured article about your book in a newspaper." },
      { name: "Local hoarding or posters in hometown", description: "Physical hoardings/posters promoting your book in your hometown." },
    ],
  },
  {
    slug: "promotional-package",
    title: "Promotional Package",
    blurb: "Amplify your book's reach with promotions, SEO and expert reviews.",
    items: [
      { name: "Exclusive Book Reading session", description: "A curated live reading session for your book." },
      { name: "Digital Promotions on Publication's social pages", description: "Promoted across ScratchBook's official social media pages." },
      { name: "Google Ads and SEO", description: "Paid Google Ads plus search-engine optimisation for reach." },
      { name: "Analysis by a critic", description: "A professional critic reviews and analyses your book." },
      { name: "Reviews by known book/media houses", description: "Reviews from established book and media houses." },
    ],
  },
  {
    slug: "post-release-promotions",
    title: "Post-Release Promotions",
    blurb: "A set of customisable services. Prices below are exactly as quoted by ScratchBook (book cost excluded where noted).",
    items: [
      { name: "Giveaway", description: "Host a giveaway to reach a wider audience.", tiers: [{ label: "3 slots", rupees: 300 }], note: "Per slot ₹100. 3 slots suggested." },
      { name: "Gift Voucher", description: "Hosted from your or a reviewer's account.", tiers: [{ label: "2 slots", rupees: 100 }] },
      { name: "Promotional Posters", description: "Shareable promotional posters for your book.", tiers: [{ label: "30 slots", rupees: 450 }, { label: "50 slots", rupees: 750 }, { label: "100 slots", rupees: 1500 }] },
      { name: "Missing letters of the title", description: "Reviewers reshare your missing-letter posts to build curiosity.", tiers: [{ label: "10 slots", rupees: 300 }, { label: "20 slots", rupees: 600 }, { label: "30 slots", rupees: 900 }] },
      { name: "Short reviews", description: "8-10 line reviews on Amazon & Goodreads (excl. book cost).", tiers: [{ label: "30 slots", rupees: 2000 }, { label: "50 slots", rupees: 3000 }, { label: "100 slots", rupees: 6000 }] },
      { name: "Long reviews", description: "Reviews on Amazon, Instagram & Goodreads (excl. book cost).", tiers: [{ label: "30 slots", rupees: 4000 }, { label: "50 slots", rupees: 6000 }, { label: "100 slots", rupees: 9000 }] },
      { name: "Only Rating (Kindle)", description: "Reviewers leave a star rating on Kindle.", tiers: [{ label: "30 slots", rupees: 300 }, { label: "50 slots", rupees: 1250 }, { label: "100 slots", rupees: 2500 }], note: "Kindle recommended; 30 slots suggested." },
      { name: "Only Rating (Paperback)", description: "Reviewers leave a star rating on the paperback.", tiers: [{ label: "30 slots", rupees: 100 }, { label: "50 slots", rupees: 1500 }, { label: "100 slots", rupees: 3000 }], note: "Excludes book cost." },
      { name: "Trailer", description: "Reviewers (200+ followers) share your book trailer on Instagram.", tiers: [{ label: "30 slots", rupees: 600 }] },
      { name: "YouTube reviews", description: "A YouTuber posts a review; price depends on the reviewer.", note: "Typically 1 slot." },
      { name: "Blog reviews", description: "Written reviews of your book on popular blogs.", tiers: [{ label: "10 slots", rupees: 400 }, { label: "20 slots", rupees: 500 }, { label: "30 slots", rupees: 600 }], note: "20 slots suggested." },
      { name: "Live Interviews", description: "One high-following reviewer hosts a 45-min live session.", tiers: [{ label: "1 reviewer", rupees: 300 }] },
      { name: "Author Interview Post", description: "Reviewer posts your Q&A on their feed.", tiers: [{ label: "2 slots", rupees: 400 }] },
      { name: "Buyback", description: "Reviewers buy the paperback and give a 5-star, 10-15 line review (excl. book cost).", tiers: [{ label: "30 slots", rupees: 2000 }, { label: "50 slots", rupees: 4000 }, { label: "100 slots", rupees: 8000 }] },
    ],
  },
  {
    slug: "recognition",
    title: "Appreciative & Recognition Services",
    blurb: "Celebrate and certify the author's achievements.",
    items: [
      { name: "Digital and Hardcopy certifications", description: "Official certificates recognising your achievement - digital and printed." },
      { name: "Medals and Trophies", description: "Physical medals and trophies for your milestone." },
      { name: "Push into Best-Selling authors", description: "A boost to help you reach best-selling author status." },
      { name: "Featuring Author and Book on Google", description: "Get your author name and book featured on Google." },
      { name: "Chance to apply for records", description: "Apply for national and world records with our support." },
    ],
  },
  {
    slug: "podcasting-services",
    title: "Podcasting Services",
    blurb: "Get your book and story featured across major podcast platforms.",
    note: "Pack 1 starts at ₹999.",
    items: [
      { name: "Discord", description: "Your story featured in active Discord communities." },
      { name: "YouTube", description: "Podcast episode published on YouTube." },
      { name: "Spotify", description: "Podcast distributed on Spotify." },
      { name: "FM version", description: "An FM-radio version of your podcast." },
      { name: "Listen Notes", description: "Listed on the Listen Notes podcast directory." },
      { name: "Apple Podcast", description: "Published on Apple Podcasts." },
      { name: "Google Podcast", description: "Published on Google Podcasts." },
      { name: "Pocket Cast", description: "Distributed via Pocket Casts." },
      { name: "Podcast (iOS)", description: "Available across iOS podcast apps." },
    ],
  },
  {
    slug: "gifts-dedications",
    title: "Token of Love (Gifts & Dedications)",
    blurb: "Thoughtful add-ons to make every book personal.",
    items: [
      { name: "Customized Bookmarks", description: "Personalised bookmarks designed for your book." },
      { name: "Specialized Bookmarks", description: "Premium, specially-crafted collectible bookmarks." },
      { name: "Basic Illustrations", description: "Simple illustrations to complement your book." },
      { name: "Customized Illustrations", description: "Bespoke illustrations tailored to your story." },
      { name: "Regular Author Note", description: "A standard author's note included in your book." },
      { name: "Customized Author Note", description: "A personalised author's note in your own style." },
      { name: "Dedicated Memoirs", description: "A dedicated memoir section for your loved ones." },
      { name: "Special quotes / ode to close people", description: "Special quotes or an ode dedicated to people you love." },
      { name: "Dedicate books to loved ones", description: "Formally dedicate your book to your loved ones." },
    ],
  },
];
