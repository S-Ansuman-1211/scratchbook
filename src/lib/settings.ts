import { prisma } from "@/lib/prisma";
import { DEFAULT_SHIPPING, type ShippingConfig } from "@/lib/pricing";

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
