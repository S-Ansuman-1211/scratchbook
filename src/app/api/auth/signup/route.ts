import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobile: z.string().min(7).optional().or(z.literal("")),
  role: z.enum(["CUSTOMER", "AUTHOR"]).default("CUSTOMER"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = signupSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password, mobile, role } = parsed.data;
    const lowerEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: lowerEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: lowerEmail,
        mobile: mobile || null,
        passwordHash,
        role,
        // If registering as an author, create the linked author profile.
        ...(role === "AUTHOR"
          ? { authorProfile: { create: {} } }
          : {}),
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, role: user.role },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
