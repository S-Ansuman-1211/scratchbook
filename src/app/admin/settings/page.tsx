import { getShippingConfig, getAuthorAppConfig } from "@/lib/settings";
import AdminShippingForm from "@/components/AdminShippingForm";
import AdminAuthorConfigForm from "@/components/AdminAuthorConfigForm";

export default async function AdminSettings() {
  const [cfg, authorCfg] = await Promise.all([getShippingConfig(), getAuthorAppConfig()]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-2xl font-bold text-ink">Settings</h2>
        <p className="mt-1 text-sm text-ink/55">Shipping charges and author-application requirements.</p>
      </div>

      <section>
        <h3 className="mb-3 font-serif text-lg font-bold text-ink">Shipping</h3>
        <AdminShippingForm
          standardChargeRupees={cfg.standardCharge / 100}
          freeAboveRupees={cfg.freeAbove / 100}
        />
        <p className="mt-3 max-w-md text-xs text-ink/45">
          GST is applied automatically: 0% on books, 18% on services.
        </p>
      </section>

      <section>
        <h3 className="mb-3 font-serif text-lg font-bold text-ink">Author application</h3>
        <p className="mb-3 max-w-md text-sm text-ink/55">Choose which details applicants must provide.</p>
        <AdminAuthorConfigForm requireAadhaar={authorCfg.requireAadhaar} requireManuscript={authorCfg.requireManuscript} />
      </section>
    </div>
  );
}
