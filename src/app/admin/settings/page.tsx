import { getShippingConfig } from "@/lib/settings";
import AdminShippingForm from "@/components/AdminShippingForm";

export default async function AdminSettings() {
  const cfg = await getShippingConfig();

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Settings</h2>
      <p className="mt-1 text-sm text-ink/55">Shipping charges applied at checkout for physical orders.</p>

      <div className="mt-6">
        <h3 className="mb-3 font-serif text-lg font-bold text-ink">Shipping</h3>
        <AdminShippingForm
          standardChargeRupees={cfg.standardCharge / 100}
          freeAboveRupees={cfg.freeAbove / 100}
        />
      </div>

      <p className="mt-6 max-w-md text-xs text-ink/45">
        GST is applied automatically: 0% on books, 18% on services. Distance/zone-based shipping and
        promotions can be added here later.
      </p>
    </div>
  );
}
