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

  // Remove earlier placeholder demo books (safe: they were never ordered).
  await prisma.book.deleteMany({
    where: { slug: { in: ["whispers-of-the-monsoon", "voices-unbound", "the-lighthouse-keeper", "a-life-in-ink"] } },
  }).catch(() => {});

  // Real ScratchBook-published books (covers imported into /public/covers).
  // NOTE: prices are placeholders (MRP not provided) — client to confirm.
  const books = [
    { title: "Jayamma Panchayati", slug: "jayamma-panchayati", authorName: "Sai Bharath Manku", type: "SOLO", status: "PUBLISHED", genre: "Cinema / Memoir", language: "Telugu", coverUrl: "/covers/jayamma-panchayati.jpg", paperbackPrice: 29900, ebookPrice: 14900 },
    { title: "The Criminal", slug: "the-criminal", authorName: "Atharva Deshpande", type: "SOLO", status: "PUBLISHED", genre: "Thriller", language: "English", coverUrl: "/covers/the-criminal.jpg", paperbackPrice: 27900, ebookPrice: 12900 },
    { title: "Espoir", slug: "espoir", authorName: "Shreya Rathi", type: "SOLO", status: "PUBLISHED", genre: "Poetry", language: "English", coverUrl: "/covers/espoir.jpg", paperbackPrice: 24900, ebookPrice: 9900 },
    { title: "How does he Look?", slug: "how-does-he-look", authorName: "Sravani Dabilpura", type: "SOLO", status: "PUBLISHED", genre: "Fiction", language: "English", coverUrl: "/covers/how-does-he-look.jpg", paperbackPrice: 26900, ebookPrice: 11900 },
    { title: "Nene Rajithe", slug: "nene-rajithe", authorName: "Ramesh Devendla", type: "SOLO", status: "PUBLISHED", genre: "Fiction", language: "Telugu", coverUrl: "/covers/nene-rajithe.jpg", paperbackPrice: 29900, ebookPrice: 14900 },
    { title: "Zinda Rehti Hai Humesha Mohabbatein", slug: "zinda-rehti-hai", authorName: "Gurleen Kaur", type: "SOLO", status: "PUBLISHED", genre: "Romance", language: "Hindi", coverUrl: "/covers/zinda-rehti-hai.png", paperbackPrice: 27900, ebookPrice: 12900 },
    { title: "From Idly Seller to Startup Founder", slug: "idly-seller-to-startup-founder", authorName: "Palla Ganesh", type: "BIOGRAPHY", status: "PUBLISHED", genre: "Biography", language: "English", coverUrl: "/covers/idly-seller-to-startup-founder.jpg", paperbackPrice: 34900, ebookPrice: 17900 },
    { title: "RGV Virus", slug: "rgv-virus", authorName: "Mahesh Uppada", type: "SOLO", status: "PUBLISHED", genre: "Fiction", language: "Telugu", coverUrl: "/covers/rgv-virus.jpeg", paperbackPrice: 27900, ebookPrice: 12900 },
    { title: "Ninnu Chere Payanam", slug: "ninnu-chere-payanam", authorName: "Nagendra D Babu", type: "SOLO", status: "PUBLISHED", genre: "Fiction", language: "Telugu", coverUrl: "/covers/ninnu-chere-payanam.png", paperbackPrice: 26900, ebookPrice: 11900 },
    { title: "Navyanjali", slug: "navyanjali", authorName: "Tatapudi Raveendranath Tagore", type: "SOLO", status: "PUBLISHED", genre: "Poetry", language: "Telugu", coverUrl: "/covers/navyanjali.jpg", paperbackPrice: 24900, ebookPrice: 9900 },
    { title: "Naa Quora Rathalu", slug: "naa-quora-rathalu", authorName: "GLN Prasad", type: "SOLO", status: "PUBLISHED", genre: "Essays", language: "Telugu", coverUrl: "/covers/naa-quora-rathalu.jpg", paperbackPrice: 24900, ebookPrice: 9900 },
    { title: "Rasaleela", slug: "rasaleela", authorName: "Bhagya Vempati", type: "SOLO", status: "PUBLISHED", genre: "Romance", language: "English", coverUrl: "/covers/rasaleela.jpg", paperbackPrice: 27900, ebookPrice: 12900 },
    { title: "Tea Time Kathalu", slug: "tea-time-kathalu", authorName: "GLN Prasad", type: "SOLO", status: "PUBLISHED", genre: "Short Stories", language: "Telugu", coverUrl: "/covers/tea-time-kathalu.jpg", paperbackPrice: 24900, ebookPrice: 9900 },
    { title: "Flavours of Love", slug: "flavours-of-love", authorName: "Jwalapuram Srihari", type: "SOLO", status: "PUBLISHED", genre: "Romance", language: "English", coverUrl: "/covers/flavours-of-love.jpg", paperbackPrice: 26900, ebookPrice: 11900 },
    { title: "Anubhutiyon ka Sargam", slug: "anubhutiyon-ka-sargam", authorName: "ScratchBook Anthology", type: "ANTHOLOGY", status: "PUBLISHED", genre: "Poetry", language: "Hindi", coverUrl: "/covers/anubhutiyon-ka-sargam.webp", paperbackPrice: 24900, ebookPrice: 9900 },
    { title: "Madilo Maatalu", slug: "madilo-maatalu", authorName: "ScratchBook Anthology", type: "ANTHOLOGY", status: "PUBLISHED", genre: "Anthology", language: "Telugu", coverUrl: "/covers/madilo-maatalu.jpeg", paperbackPrice: 24900, ebookPrice: 9900 },
    { title: "RPM", slug: "rpm", authorName: "Vihang", type: "SOLO", status: "UPCOMING", genre: "Thriller", language: "Telugu", coverUrl: "/covers/rpm.jpg", paperbackPrice: 29900, ebookPrice: 14900 },
    { title: "Antarangam", slug: "antarangam", authorName: "ScratchBook Author", type: "SOLO", status: "UPCOMING", genre: "Fiction", language: "Telugu", coverUrl: "/covers/antarangam.jpg", paperbackPrice: 27900, ebookPrice: 12900 },
    { title: "Sivoham", slug: "sivoham", authorName: "ScratchBook Author", type: "SOLO", status: "PUBLISHED", genre: "Devotional", language: "Telugu", coverUrl: "/covers/sivoham.jpg", paperbackPrice: 26900, ebookPrice: 11900 },
    { title: "Vekuva", slug: "vekuva", authorName: "ScratchBook Author", type: "SOLO", status: "PUBLISHED", genre: "Poetry", language: "Telugu", coverUrl: "/covers/vekuva.jpg", paperbackPrice: 24900, ebookPrice: 9900 },
  ] as const;

  for (const b of books) {
    const book = await prisma.book.upsert({
      where: { slug: b.slug },
      update: {
        authorName: b.authorName,
        coverUrl: b.coverUrl,
        status: b.status,
        genre: b.genre,
        language: b.language,
        paperbackPrice: b.paperbackPrice,
        ebookPrice: b.ebookPrice,
      },
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
