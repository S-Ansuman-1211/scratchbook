import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3, "Title is too short"),
  excerpt: z.string().optional(),
  body: z.string().min(20, "Please write a bit more"),
  coverUrl: z.string().url().optional().or(z.literal("")),
  linkUrl: z.string().url().optional().or(z.literal("")),
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

// Authors & customers submit a blog. It stays UNPUBLISHED until an admin approves it.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Please sign in to submit a blog" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;

  let slug = slugify(d.title) || "post";
  if (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  await prisma.blogPost.create({
    data: {
      title: d.title,
      slug,
      excerpt: d.excerpt || null,
      body: d.body,
      coverUrl: d.coverUrl ? d.coverUrl : null,
      linkUrl: d.linkUrl ? d.linkUrl : null,
      submittedByUserId: session.user.id,
      submittedByName: session.user.name ?? null,
      published: false, // pending admin approval
    },
  });

  return NextResponse.json({ ok: true });
}
