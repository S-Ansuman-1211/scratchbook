export const metadata = { title: "About Us | ScratchBook Publications" };

export default function AboutPage() {
  return (
    <div className="container-x max-w-3xl py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-gold">Who we are</p>
      <h1 className="mt-2 font-serif text-4xl font-bold">About ScratchBook</h1>

      <div className="prose mt-8 space-y-5 text-ink/80">
        <p>
          The very common thing we observe in the writing industry is a lack of guidance. So many
          young and enthusiastic writers are trying hard to confirm a position for themselves. We,
          ScratchBook Publications, decided to be the platform that provides the mentorship required
          to enhance the quality of writers by helping them choose their niche.
        </p>
        <p>
          ScratchBook Publications helps people find their niche in writing and master it by
          networking with other writers from the industry.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="card">
            <h3 className="font-serif font-bold text-brand">Motto</h3>
            <p className="mt-2 text-sm">Find, help and encourage budding and established writers all over India.</p>
          </div>
          <div className="card">
            <h3 className="font-serif font-bold text-brand">Goal</h3>
            <p className="mt-2 text-sm">Create a platform where writers can come, learn and earn through writing.</p>
          </div>
          <div className="card">
            <h3 className="font-serif font-bold text-brand">Mission</h3>
            <p className="mt-2 text-sm">Assist thousands in learning the technical and soft skills that create opportunities.</p>
          </div>
        </div>

        <blockquote className="border-l-4 border-gold pl-4 font-serif text-lg italic text-ink">
          “We love the way you smile with your childhood dream in your hand.”
        </blockquote>
      </div>
    </div>
  );
}
