import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Seeds demo data so the client can see the site populated.
async function main() {
  console.log("🌱 Seeding ScratchBook database…");

  // Demo author (login: author@scratchbook.test / password123)
  const authorPass = await bcrypt.hash("password123", 10);
  const author = await prisma.user.upsert({
    where: { email: "author@scratchbook.test" },
    update: {},
    create: {
      name: "Aarav Mehta",
      email: "author@scratchbook.test",
      mobile: "9000000001",
      passwordHash: authorPass,
      role: "AUTHOR",
      authorProfile: {
        create: {
          penName: "A. Mehta",
          bio: "Debut novelist with ScratchBook.",
          totalEarnings: 4520000, // ₹45,200
          walletBalance: 1200000, // ₹12,000
        },
      },
    },
    include: { authorProfile: true },
  });

  // Demo customer (login: customer@scratchbook.test / password123)
  await prisma.user.upsert({
    where: { email: "customer@scratchbook.test" },
    update: {},
    create: {
      name: "Riya Sharma",
      email: "customer@scratchbook.test",
      passwordHash: authorPass,
      role: "CUSTOMER",
    },
  });

  // Demo admin (login: admin@scratchbook.test / password123)
  await prisma.user.upsert({
    where: { email: "admin@scratchbook.test" },
    update: { role: "ADMIN" },
    create: {
      name: "ScratchBook Admin",
      email: "admin@scratchbook.test",
      passwordHash: authorPass,
      role: "ADMIN",
    },
  });

  const profileId = author.authorProfile!.id;

  // Books
  const books = [
    { title: "Whispers of the Monsoon", slug: "whispers-of-the-monsoon", type: "SOLO", status: "PUBLISHED", genre: "Literary Fiction", language: "English", pages: 248, isbn: "978-93-5000-001-1", sizeLabel: "5x8 in", paperbackPrice: 29900, ebookPrice: 14900, printCost: 12000 },
    { title: "Voices Unbound (Anthology)", slug: "voices-unbound", type: "ANTHOLOGY", status: "PUBLISHED", genre: "Poetry", language: "English", pages: 180, isbn: "978-93-5000-002-8", sizeLabel: "5x8 in", paperbackPrice: 24900, ebookPrice: 9900, printCost: 10000 },
    { title: "The Lighthouse Keeper", slug: "the-lighthouse-keeper", type: "SOLO", status: "UPCOMING", genre: "Mystery", language: "English", pages: 320, sizeLabel: "5.5x8.5 in", paperbackPrice: 34900, ebookPrice: 17900, printCost: 14000 },
    { title: "A Life in Ink", slug: "a-life-in-ink", type: "AUTOBIOGRAPHY", status: "PUBLISHED", genre: "Memoir", language: "English", pages: 290, isbn: "978-93-5000-003-5", sizeLabel: "6x9 in", paperbackPrice: 39900, ebookPrice: 19900, printCost: 15000 },
  ] as const;

  for (const b of books) {
    const book = await prisma.book.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        ...b,
        publishedAt: b.status === "PUBLISHED" ? new Date() : null,
        authorProfileId: profileId,
      },
    });

    if (b.status === "PUBLISHED") {
      // Seed some sales records across channels
      const channels = ["DIRECT", "AMAZON", "BOOKSTORE", "EBOOK_STORE"] as const;
      for (const channel of channels) {
        await prisma.saleRecord.create({
          data: {
            bookId: book.id,
            channel,
            copiesSold: Math.floor(Math.random() * 40) + 5,
            profitEarned: (Math.floor(Math.random() * 40) + 5) * 8000,
            periodMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        });
      }
    }
  }

  // Magazines
  await prisma.magazine.upsert({
    where: { slug: "scratchbook-june" },
    update: {},
    create: {
      title: "ScratchBook Monthly — June",
      slug: "scratchbook-june",
      type: "GROUP_DIVA",
      pages: 24,
      gsm: 190,
      pricePerPage: 800,
      edition: "June 2026",
      readOnline: true,
    },
  });

  // Blog
  await prisma.blogPost.upsert({
    where: { slug: "from-idea-to-bestseller" },
    update: {},
    create: {
      title: "From Idea to Best-seller: An Author's Journey",
      slug: "from-idea-to-bestseller",
      excerpt: "How mentorship and the right promotions turned a manuscript into a best-seller.",
      body: "Full article content goes here…",
      likes: 42,
    },
  });

  // Events
  for (const title of ["Photography Contest", "Painting Contest", "Story Contest"]) {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    await prisma.event.upsert({
      where: { slug },
      update: {},
      create: { title, slug, type: "COMPETITION", isOpen: true },
    });
  }

  console.log("✅ Seed complete.");
  console.log("   Author  → author@scratchbook.test / password123");
  console.log("   Customer→ customer@scratchbook.test / password123");
  console.log("   Admin   → admin@scratchbook.test / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
