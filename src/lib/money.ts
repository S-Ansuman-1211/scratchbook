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
