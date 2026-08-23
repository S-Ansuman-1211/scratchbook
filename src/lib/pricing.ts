// Shared order-total math (pure - usable on client and server).
// All money in paise. GST: services 18%, books/magazines 0%.

export const GST_RATE = 0.18;

export type ShippingConfig = {
  standardCharge: number; // paise
  freeAbove: number; // paise - free shipping at/above this subtotal
};

export const DEFAULT_SHIPPING: ShippingConfig = {
  standardCharge: 6000, // ₹60
  freeAbove: 50000, // ₹500
};

export type PromoConfig = {
  enabled: boolean;
  threshold: number; // paise - order value at/above which the promo applies
  percent: number; // discount %
  stack: boolean; // true = combine discounts; false = apply only the single best
};

export const DEFAULT_PROMO: PromoConfig = {
  enabled: true,
  threshold: 100000, // ₹1000
  percent: 10,
  stack: false,
};

export type PricedItem = {
  kind: "BOOK" | "SERVICE" | "MAGAZINE";
  unitPrice: number; // FULL price (paise), before any discount
  quantity: number;
  meta?: { format?: string; bookDiscount?: number } | null;
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

  // Three discount sources (all amounts in paise):
  //  - per-book: each item's own discount %
  //  - promo:    auto order-value discount when subtotal >= threshold
  //  - user:     the customer's personal discount %
  const perBookDiscount = items.reduce(
    (s, i) => s + Math.round((i.unitPrice * i.quantity * Math.max(0, Math.min(100, i.meta?.bookDiscount ?? 0))) / 100),
    0
  );
  const promo = opts?.promo;
  const promoPct = promo?.enabled && subtotal >= promo.threshold ? promo.percent : 0;
  const userPct = Math.max(0, Math.min(100, opts?.userDiscountPercent ?? 0));
  const promoDiscount = Math.round(subtotal * (promoPct / 100));
  const userDiscount = Math.round(subtotal * (userPct / 100));

  // Stacking rule (admin-controlled): combine them, or apply only the single best.
  const stack = promo?.stack ?? false;
  let discount: number;
  if (stack) {
    // Per-book first, then the best order-level discount on the remainder.
    const afterBook = subtotal - perBookDiscount;
    const orderPct = Math.max(promoPct, userPct);
    discount = perBookDiscount + Math.round((afterBook * orderPct) / 100);
  } else {
    discount = Math.max(perBookDiscount, promoDiscount, userDiscount);
  }
  discount = Math.min(discount, subtotal);
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

  return { subtotal, discount, tax, shippingCost, total: discounted + tax + shippingCost };
}
