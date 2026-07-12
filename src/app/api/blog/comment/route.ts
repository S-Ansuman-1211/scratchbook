import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  postId: z.string(),
  authorName: z.string().min(2, "Please enter your name"),
  body: z.string().min(2, "Comment is too short").max(2000),
});

// Adds a comment to a blog post. Works for guests (name required) and links
// the userId when signed in.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const { postId, authorName, body } = parsed.data;

  const comment = await prisma.blogComment.create({
    data: { postId, authorName, body, userId: session?.user?.id ?? null },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
