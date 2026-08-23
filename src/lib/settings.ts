import { prisma } from "@/lib/prisma";
import { DEFAULT_SHIPPING, DEFAULT_PROMO, type ShippingConfig, type PromoConfig } from "@/lib/pricing";

const SHIPPING_KEY = "shipping";

export async function getShippingConfig(): Promise<ShippingConfig> {
  const row = await prisma.setting.findUnique({ where: { key: SHIPPING_KEY } }).catch(() => null);
  if (!row) return DEFAULT_SHIPPING;
  const v = row.value as Partial<ShippingConfig>;
  return {
    standardCharge: typeof v.standardCharge === "number" ? v.standardCharge : DEFAULT_SHIPPING.standardCharge,
    freeAbove: typeof v.freeAbove === "number" ? v.freeAbove : DEFAULT_SHIPPING.freeAbove,
  };
}

export async function setShippingConfig(cfg: ShippingConfig): Promise<void> {
  await prisma.setting.upsert({
    where: { key: SHIPPING_KEY },
    update: { value: cfg },
    create: { key: SHIPPING_KEY, value: cfg },
  });
}

// ── Promo (auto order-value discount) ──
const PROMO_KEY = "promo";

export async function getPromoConfig(): Promise<PromoConfig> {
  const row = await prisma.setting.findUnique({ where: { key: PROMO_KEY } }).catch(() => null);
  if (!row) return DEFAULT_PROMO;
  const v = row.value as Partial<PromoConfig>;
  return {
    enabled: typeof v.enabled === "boolean" ? v.enabled : DEFAULT_PROMO.enabled,
    threshold: typeof v.threshold === "number" ? v.threshold : DEFAULT_PROMO.threshold,
    percent: typeof v.percent === "number" ? v.percent : DEFAULT_PROMO.percent,
    stack: typeof v.stack === "boolean" ? v.stack : DEFAULT_PROMO.stack,
  };
}

export async function setPromoConfig(cfg: PromoConfig): Promise<void> {
  await prisma.setting.upsert({
    where: { key: PROMO_KEY },
    update: { value: cfg },
    create: { key: PROMO_KEY, value: cfg },
  });
}

// ── Author application configuration (which fields the applicant must provide) ──
const AUTHOR_KEY = "authorApplication";

export type AuthorAppConfig = {
  requireAadhaar: boolean;
  requireManuscript: boolean;
};

export const DEFAULT_AUTHOR_APP: AuthorAppConfig = {
  requireAadhaar: false,
  requireManuscript: true,
};

export async function getAuthorAppConfig(): Promise<AuthorAppConfig> {
  const row = await prisma.setting.findUnique({ where: { key: AUTHOR_KEY } }).catch(() => null);
  if (!row) return DEFAULT_AUTHOR_APP;
  const v = row.value as Partial<AuthorAppConfig>;
  return {
    requireAadhaar: typeof v.requireAadhaar === "boolean" ? v.requireAadhaar : DEFAULT_AUTHOR_APP.requireAadhaar,
    requireManuscript: typeof v.requireManuscript === "boolean" ? v.requireManuscript : DEFAULT_AUTHOR_APP.requireManuscript,
  };
}

export async function setAuthorAppConfig(cfg: AuthorAppConfig): Promise<void> {
  await prisma.setting.upsert({
    where: { key: AUTHOR_KEY },
    update: { value: cfg },
    create: { key: AUTHOR_KEY, value: cfg },
  });
}
