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

export function computeTotals(items: PricedItem[], shipping: ShippingConfig) {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  // GST only on service line items.
  const serviceTotal = items
    .filter((i) => i.kind === "SERVICE")
    .reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const tax = Math.round(serviceTotal * GST_RATE);

  // Shipping only when there's a physical item; free above threshold.
  const hasPhysical = items.some(isPhysical);
  const shippingCost = !hasPhysical ? 0 : subtotal >= shipping.freeAbove ? 0 : shipping.standardCharge;

  return { subtotal, tax, shippingCost, total: subtotal + tax + shippingCost };
}
