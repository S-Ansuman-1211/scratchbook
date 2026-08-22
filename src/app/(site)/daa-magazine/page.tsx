import Link from "next/link";

export const metadata = {
  title: "D'Artiste Artifex (DAA) Magazine | ScratchBook Publications",
  description:
    "D'Artiste Artifex - a celebrity & entertainment magazine series where literature and stardom collide. A ScratchBook extended service.",
};

const EDITIONS = [
  { title: "She & Her", desc: "A tribute to women - interviews with leading women in journalism, acting, entertainment and broadcasting.", accent: "#e11d63" },
  { title: "T Town Beauty Icon", desc: "The debut issue featuring film actress Hebah Patel, with legendary singers, anchors and directors of the South Indian film industry.", accent: "#7c3aed" },
  { title: "Young Era of Film Making", desc: "Three talented Tollywood directors on the cover - Trinadha Rao Nakkina, Vijay Kumar Kalivarapu & Vinod Anantoju.", accent: "#ea580c" },
  { title: "Dance Xpress", desc: "In collaboration with Pace Creators Dance Academy - launched at 'Dancing Super Star 6', Visakhapatnam.", accent: "#0891b2" },
  { title: "Docs Talk", desc: "A heartfelt tribute to doctors, published on Doctor's Day with interviews from esteemed doctors across fields.", accent: "#059669" },
];

const COVERS_WE_DO = [
  { t: "Personal Magazine", d: "Your career graph, hurdles and achievements - concreted into a magazine." },
  { t: "Movie Magazine", d: "Every detail of your film's journey, from the first idea to the cinema, bound into a magazine." },
  { t: "Diva / Group Magazine", d: "A group of achievers who share the same fame and zeal - success 'printed' together." },
];

const MEDIA = ["Indian Express", "Google News", "Web Story India", "Pixstory", "Medium", "Dailyhunt", "LiveJournal", "YKA"];

export default function DaaMagazinePage() {
  return (
    <>
      {/* Hero - DAA purple/orange branding */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3b1a78] via-[#4c1d95] to-[#7c3aed] text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-orange/30 blur-3xl" />
        <div className="container-x relative py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            A ScratchBook Extended Service
          </span>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight md:text-6xl">
            D&apos;Artiste Artifex
            <span className="mt-2 block bg-gradient-to-r from-orange to-orange-dark bg-clip-text text-transparent">
              Magazine Series
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            A platform where a unique blend of notable writers and celebrities live in one place -
            <span className="font-semibold text-white"> where literature and stardom collide.</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:dartisteartifex@gmail.com" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#4c1d95] transition hover:bg-white/90">
              Get featured
            </a>
            <Link href="/magazine" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold transition hover:bg-white/10">
              ScratchBook Magazines →
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <span className="eyebrow" style={{ color: "#7c3aed" }}>About DAA</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Recognition the artists deserve</h2>
          </div>
          <div className="space-y-4 text-ink/70">
            <p>
              We provide a space for talented artists - writers, photographers, dancers, painters and
              more - to share their skills, work and journey through interviews and articles, with a
              permanent section dedicated to writers.
            </p>
            <p>
              We leverage upcoming writers&apos; talent with the fame of celebrities, giving artists of
              all genres a global platform to be recognised - a class by itself.
            </p>
          </div>
        </div>
      </section>

      {/* Editions */}
      <section className="border-y border-line bg-cream py-16">
        <div className="container-x">
          <span className="eyebrow" style={{ color: "#ea580c" }}>The magazine series</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Editions we&apos;ve published</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EDITIONS.map((e) => (
              <article key={e.title} className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="flex aspect-[3/2] items-center justify-center p-6 text-center" style={{ background: `linear-gradient(135deg, ${e.accent}, #16151d)` }}>
                  <h3 className="font-serif text-2xl font-bold text-white">{e.title}</h3>
                </div>
                <p className="p-5 text-sm leading-relaxed text-ink/65">{e.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="container-x py-16">
        <span className="eyebrow" style={{ color: "#7c3aed" }}>What else we do</span>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Types of magazines</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {COVERS_WE_DO.map((c, i) => (
            <div key={c.t} className="card transition-all hover:-translate-y-1 hover:shadow-lift">
              <span className="font-serif text-3xl font-bold" style={{ color: ["#7c3aed", "#ea580c", "#e11d63"][i] }}>0{i + 1}</span>
              <h3 className="mt-3 font-serif text-xl font-bold text-ink">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Media featured */}
      <section className="border-t border-line bg-white py-16">
        <div className="container-x text-center">
          <span className="eyebrow" style={{ color: "#ea580c" }}>Media featurings</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Featured across leading platforms</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {MEDIA.map((m) => (
              <span key={m} className="rounded-full border border-line bg-cream px-4 py-2 text-sm font-semibold text-ink/70">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4c1d95] to-[#7c3aed] p-10 text-center text-white md:p-14">
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-orange/30 blur-3xl" />
          <h2 className="relative font-serif text-3xl font-semibold">Want to be featured alongside celebrities?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/80">
            Reach out to the D&apos;Artiste Artifex team to showcase your talent on a global platform.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <a href="mailto:dartisteartifex@gmail.com" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#4c1d95] hover:bg-white/90">
              dartisteartifex@gmail.com
            </a>
            <span className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold">@daa_magazine</span>
          </div>
        </div>
      </section>
    </>
  );
}
