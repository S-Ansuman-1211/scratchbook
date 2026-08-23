import { SERVICE_GROUPS } from "@/data/services";
import ServiceEnquiry from "@/components/ServiceEnquiry";

// The 10 special-service sections shown under the "ScratchBook Special Services (SBSP)" heading.
const SBSP_SLUGS = new Set([
  "workshops",
  "mentorship",
  "branding",
  "writing-services",
  "digital-package",
  "promotional-package",
  "post-release-promotions",
  "recognition",
  "podcasting-services",
  "gifts-dedications",
]);

export const metadata = {
  title: "Services | ScratchBook Publications",
  description:
    "Workshops, mentorship, publishing packages, branding, digital promotions, writing services and post-release promotions for authors.",
};

export default function ServicesPage() {
  return (
    <div className="container-x py-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-gold">What we offer</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">Our Services</h1>
        <p className="mt-4 text-ink/70">
          From the first idea to becoming a best-seller - every kind of guidance and mentorship,
          as and when required.
        </p>
      </header>

      {/* Quick nav */}
      <nav className="mt-10 flex flex-wrap justify-center gap-2">
        {SERVICE_GROUPS.map((g) => (
          <a
            key={g.slug}
            href={`#${g.slug}`}
            className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm text-ink/70 transition hover:border-brand hover:text-brand"
          >
            {g.title}
          </a>
        ))}
      </nav>

      <div className="mt-14 space-y-16">
        {SERVICE_GROUPS.map((group, idx) => (
          <div key={group.slug}>
            {/* Parent heading before the first SBSP special service */}
            {SBSP_SLUGS.has(group.slug) && !SBSP_SLUGS.has(SERVICE_GROUPS[idx - 1]?.slug) && (
              <div className="mb-10 rounded-2xl border border-line bg-cream p-6 text-center">
                <span className="eyebrow justify-center">Add-ons for any package</span>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">ScratchBook Special Services (SBSP)</h2>
                <p className="mt-2 text-sm text-ink/60">Ten bespoke, customisable service bundles you can add to any book.</p>
              </div>
            )}
          <section id={group.slug} className="scroll-mt-24">
            <div className="mb-6 border-l-4 border-brand pl-4">
              <h2 className="font-serif text-2xl font-bold text-ink">{group.title}</h2>
              <p className="mt-1 max-w-3xl text-sm text-ink/60">{group.blurb}</p>
              {group.note && <p className="mt-2 max-w-3xl text-xs italic text-ink/50">{group.note}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                // Compact card = no description, no price, no tiers: heading + inline enquire button.
                const compact = !item.description && item.price == null && !item.tiers;
                if (compact) {
                  return (
                    <div key={item.name} className="card flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-ink">{item.name}</h3>
                      <ServiceEnquiry serviceName={item.name} inline />
                    </div>
                  );
                }
                return (
                  <div key={item.name} className="card flex flex-col">
                    <h3 className="font-semibold text-ink">{item.name}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-ink/60">{item.description}</p>
                    )}

                    {item.price != null ? (
                      <p className="mt-3 font-serif text-2xl font-bold text-gold">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    ) : item.tiers ? (
                      <ul className="mt-3 space-y-1">
                        {item.tiers.map((t) => (
                          <li key={t.label} className="flex justify-between text-sm">
                            <span className="text-ink/70">{t.label}</span>
                            <span className="font-semibold text-brand">₹{t.rupees.toLocaleString("en-IN")}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ServiceEnquiry serviceName={item.name} />
                    )}

                    {item.note && <p className="mt-2 text-xs italic text-ink/50">{item.note}</p>}
                  </div>
                );
              })}
            </div>
          </section>
          </div>
        ))}
      </div>
    </div>
  );
}
