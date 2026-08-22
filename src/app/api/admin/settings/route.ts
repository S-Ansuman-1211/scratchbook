import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setShippingConfig } from "@/lib/settings";
import { z } from "zod";

// Admin updates the shipping configuration. Values arrive in rupees; stored as paise.
const schema = z.object({
  standardChargeRupees: z.number().nonnegative(),
  freeAboveRupees: z.number().nonnegative(),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await setShippingConfig({
    standardCharge: Math.round(parsed.data.standardChargeRupees * 100),
    freeAbove: Math.round(parsed.data.freeAboveRupees * 100),
  });

  return NextResponse.json({ ok: true });
}
