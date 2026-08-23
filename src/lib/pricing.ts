// Shared order-total math (pure — usable on client and server).
// All money in paise. GST: services 18%, books/magazines 0%.

export const GST_RATE = 0.18;

export type ShippingConfig = {
  standardCharge: number; // paise
  freeAbove: number; // paise — free shipping at/above this subtotal
};

export const DEFAULT_SHIPPING: ShippingConfig = {
  standardCharge: 6000, // ₹60
  freeAbove: 50000, // ₹500
};

export type PromoConfig = {
  enabled: boolean;
  threshold: number; // paise — order value at/above which the promo applies
  percent: number; // discount %
};

export const DEFAULT_PROMO: PromoConfig = {
  enabled: true,
  threshold: 100000, // ₹1000
  percent: 10,
};

export type PricedItem = {
  kind: "BOOK" | "SERVICE" | "MAGAZINE";
  unitPrice: number; // paise
  quantity: number;
  meta?: { format?: string } | null;
};

// A physical item needs shipping. Services and ebooks are digital.
function isPhysical(item: PricedItem): boolean {
  if (item.kind === "SERVICE") return false;
  if (item.kind === "BOOK" && item.meta?.format === "ebook") return false;
  return true;
}

export function computeTotals(
  items: PricedItem[],
  shipping: ShippingConfig,
  opts?: { promo?: PromoConfig; userDiscountPercent?: number }
) {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  // Discount = the better of the auto order-value promo and the user's personal
  // discount (they don't stack).
  const promo = opts?.promo;
  const promoPct = promo?.enabled && subtotal >= promo.threshold ? promo.percent : 0;
  const userPct = Math.max(0, Math.min(100, opts?.userDiscountPercent ?? 0));
  const discountPct = Math.max(promoPct, userPct);
  const discount = Math.round(subtotal * (discountPct / 100));
  const discounted = subtotal - discount;

  // GST only on service line items (computed on the discounted service portion).
  const serviceTotal = items
    .filter((i) => i.kind === "SERVICE")
    .reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const serviceAfterDiscount = subtotal > 0 ? Math.round(serviceTotal * (discounted / subtotal)) : 0;
  const tax = Math.round(serviceAfterDiscount * GST_RATE);

  // Shipping only when there's a physical item; free above threshold (by subtotal).
  const hasPhysical = items.some(isPhysical);
  const shippingCost = !hasPhysical ? 0 : subtotal >= shipping.freeAbove ? 0 : shipping.standardCharge;

  return { subtotal, discount, discountPct, tax, shippingCost, total: discounted + tax + shippingCost };
}
