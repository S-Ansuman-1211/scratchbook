import LegalShell, { LegalSection } from "@/components/LegalShell";

export const metadata = { title: "Copyright Notice | ScratchBook Publications" };

export default function CopyrightPage() {
  return (
    <LegalShell title="Copyright Notice">
      <p>
        © {new Date().getFullYear()} <strong>ScratchBook Publications</strong>, an independent unit under
        Inkzoid Publication. All rights reserved.
      </p>

      <LegalSection heading="1. Ownership of Website Content">
        <p>
          All content on this website — including text, graphics, logos, the ScratchBook name and
          branding, page design, and software — is the property of ScratchBook Publications or its
          licensors and is protected by Indian and international copyright and trademark laws. It may not
          be copied, reproduced, republished or distributed without our prior written permission.
        </p>
      </LegalSection>

      <LegalSection heading="2. Authors' Copyright">
        <p>
          Authors retain full copyright of their original literary works published through ScratchBook.
          Book covers, illustrations and other creative assets remain the property of their respective
          creators or of ScratchBook, as set out in the applicable publishing agreement. Book titles,
          descriptions and cover images are displayed with the permission of the respective authors and
          rights holders.
        </p>
      </LegalSection>

      <LegalSection heading="3. Trademarks">
        <p>
          &quot;ScratchBook&quot;, &quot;ScratchBook Publications&quot; and associated logos are trademarks
          of the publication. Other product and company names mentioned on this site may be the
          trademarks of their respective owners.
        </p>
      </LegalSection>

      <LegalSection heading="4. Reporting Infringement">
        <p>
          We respect the intellectual property of others. If you believe that any content on this website
          infringes your copyright, please contact us at{" "}
          <a href="mailto:scratchbookpublications@gmail.com" className="text-brand hover:underline">scratchbookpublications@gmail.com</a>{" "}
          with details of the work, the location of the material on our site, and proof of ownership. We
          will review and act on valid claims promptly.
        </p>
      </LegalSection>

      <LegalSection heading="5. Permitted Use">
        <p>
          You may view and print pages from this website for your own personal, non-commercial use. Any
          other use, including reproduction for commercial purposes, requires our written consent.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
