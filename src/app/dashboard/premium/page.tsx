// Premium Services - Digital, Promotional & Recognition packages (Author Dashboard doc).
const PACKAGES = [
  {
    title: "Digital Packages",
    items: [
      "One YouTube interview",
      "YouTube review",
      "FM session",
      "Article on Newspaper",
      "Local hoarding or posters in hometown",
    ],
  },
  {
    title: "Promotional Packages",
    items: [
      "Exclusive Book Reading session",
      "Digital Promotions on Publication's social pages",
      "Google Ads and SEO",
      "Analysis by a critic",
      "Reviews by known book/media houses",
    ],
  },
  {
    title: "Recognition Packages",
    items: [
      "Digital and Hardcopy certifications",
      "Medals and Trophies",
      "Push into Best-Selling authors",
      "Featuring Author and Book on Google",
      "Chance to apply for records",
    ],
  },
];

export default function PremiumPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold">Premium Services</h1>
        <p className="text-sm text-ink/60">Boost your reach, visibility and recognition.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <div key={pkg.title} className="card">
            <h2 className="font-serif text-lg font-bold text-brand">{pkg.title}</h2>
            <ul className="mt-4 space-y-2">
              {pkg.items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-sm text-ink/70">
                  <span className="mt-0.5 text-gold">◆</span>
                  {it}
                </li>
              ))}
            </ul>
            <button className="btn-outline mt-5 w-full py-2 text-sm">Enquire / Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}
