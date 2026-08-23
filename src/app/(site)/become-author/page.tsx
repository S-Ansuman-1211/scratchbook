import { getAuthorAppConfig } from "@/lib/settings";
import AuthorApplyForm from "@/components/AuthorApplyForm";

export const metadata = { title: "Become an Author | ScratchBook Publications" };

export default async function BecomeAuthorPage() {
  const cfg = await getAuthorAppConfig();

  return (
    <div className="container-x max-w-2xl py-14">
      <span className="eyebrow">Publish with us</span>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">Become an Author</h1>
      <p className="mt-3 text-ink/60">
        Apply to publish with ScratchBook. Share your details and a manuscript, and our team will
        review your application. Once approved, you get an Author Dashboard to manage your books,
        sales and promotions.
      </p>

      <AuthorApplyForm requireAadhaar={cfg.requireAadhaar} requireManuscript={cfg.requireManuscript} />
    </div>
  );
}
