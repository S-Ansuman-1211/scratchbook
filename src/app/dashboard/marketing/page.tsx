// Marketing Tools — the post-release promotion toolkit (Author Dashboard + Website Flow docs).
const TOOLS = [
  "Giveaway",
  "Gift Voucher",
  "Promotional Posters",
  "Missing Letters of the title",
  "Short reviews and long reviews",
  "Only Rating",
  "Trailer",
  "YouTube Reviews",
  "Blog Reviews",
  "Live Interviews",
  "Author Interview Post",
  "Buyback",
];

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Marketing Tools</h1>
        <p className="text-sm text-ink/60">
          A toolkit of 12 customisable post-release promotions. Configure slots and budgets, then
          check out via PhonePe.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <div key={tool} className="card flex items-center justify-between">
            <span className="font-medium text-ink">{tool}</span>
            <button className="btn-outline px-3 py-1 text-xs">Configure</button>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink/50">
        Detailed slot pricing for each tool is listed on the public{" "}
        <a href="/services#post-release-promotions" className="text-brand underline">Services</a> page.
      </p>
    </div>
  );
}
