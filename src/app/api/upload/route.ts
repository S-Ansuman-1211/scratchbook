import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

// Image upload for any signed-in user (e.g. blog submissions).
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Image storage not configured." }, { status: 503 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const folder = String(form?.get("folder") ?? "user");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image is too large (max 8 MB)." }, { status: 400 });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const blob = await put(`${folder}/${safeName}`, file, { access: "public", addRandomSuffix: true });
  return NextResponse.json({ url: blob.url });
}
