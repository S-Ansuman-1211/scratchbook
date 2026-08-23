// All monetary values are stored in paise (INR * 100) to avoid float errors.

export function formatINR(paise: number | null | undefined): string {
  if (paise == null) return "-";
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

// Apply a per-book discount (%) to a price in paise.
export function applyDiscount(price: number | null | undefined, percent?: number | null): number | null {
  if (price == null) return price ?? null;
  const p = percent ?? 0;
  if (p <= 0) return price;
  return Math.round((price * (100 - p)) / 100);
}
