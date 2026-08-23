import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setShippingConfig, setAuthorAppConfig, setPromoConfig } from "@/lib/settings";
import { z } from "zod";

// Admin updates site settings. Body may include shipping, author and/or promo.
const schema = z.object({
  shipping: z
    .object({
      standardChargeRupees: z.number().nonnegative(),
      freeAboveRupees: z.number().nonnegative(),
    })
    .optional(),
  author: z
    .object({
      requireAadhaar: z.boolean(),
      requireManuscript: z.boolean(),
    })
    .optional(),
  promo: z
    .object({
      enabled: z.boolean(),
      thresholdRupees: z.number().nonnegative(),
      percent: z.number().min(0).max(100),
    })
    .optional(),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (parsed.data.shipping) {
    await setShippingConfig({
      standardCharge: Math.round(parsed.data.shipping.standardChargeRupees * 100),
      freeAbove: Math.round(parsed.data.shipping.freeAboveRupees * 100),
    });
  }
  if (parsed.data.author) {
    await setAuthorAppConfig(parsed.data.author);
  }
  if (parsed.data.promo) {
    await setPromoConfig({
      enabled: parsed.data.promo.enabled,
      threshold: Math.round(parsed.data.promo.thresholdRupees * 100),
      percent: parsed.data.promo.percent,
    });
  }

  return NextResponse.json({ ok: true });
}
