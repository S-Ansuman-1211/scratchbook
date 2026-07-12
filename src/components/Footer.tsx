import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/70">
      <div className="container-x grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-serif text-xl font-bold text-gold">ScratchBook</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            An independent unit under Inkzoid Publication. Helping budding and
            established writers across India find their niche, and earn through writing.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-gold">Services</Link></li>
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact Us</Link></li>
            <li><Link href="/signup?role=AUTHOR" className="hover:text-gold">Join the Team</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Publishing</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog" className="hover:text-gold">Blog</Link></li>
            <li><Link href="/magazine" className="hover:text-gold">Magazine</Link></li>
            <li><Link href="/events" className="hover:text-gold">Events</Link></li>
            <li><Link href="/dashboard" className="hover:text-gold">Author Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-gold">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link href="/copyright" className="hover:text-gold">Copyrights</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} ScratchBook Publications. All rights reserved.</p>
          <p>Your Thoughts, Our Efforts.</p>
        </div>
      </div>
    </footer>
  );
}
