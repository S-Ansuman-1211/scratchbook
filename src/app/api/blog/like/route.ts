import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ postId: z.string() });

// Increments a blog post's like count.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const post = await prisma.blogPost.update({
    where: { id: parsed.data.postId },
    data: { likes: { increment: 1 } },
    select: { likes: true },
  });

  return NextResponse.json({ likes: post.likes });
}
