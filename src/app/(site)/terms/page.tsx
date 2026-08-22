import LegalShell, { LegalSection } from "@/components/LegalShell";

export const metadata = { title: "Terms & Conditions | ScratchBook Publications" };

export default function TermsPage() {
  return (
    <LegalShell title="Terms &amp; Conditions">
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the website and services of
        <strong> ScratchBook Publications</strong>
        (&quot;ScratchBook&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By accessing our website,
        creating an account, or purchasing books or services, you agree to these Terms. If you do not
        agree, please do not use our website.
      </p>

      <LegalSection heading="1. Eligibility & Accounts">
        <p>
          You must be at least 18 years old, or use the website under the supervision of a parent or
          guardian, to make a purchase. You are responsible for maintaining the confidentiality of
          your account credentials and for all activity under your account. Please provide accurate
          and complete information when registering.
        </p>
      </LegalSection>

      <LegalSection heading="2. Author Accounts">
        <p>
          Registering an author account creates a member account and submits an application to become
          a ScratchBook author. Author access, including the author dashboard and publishing tools, is
          granted only after review and approval by our team. We may approve, decline, or revoke
          author status at our discretion.
        </p>
      </LegalSection>

      <LegalSection heading="3. Services & Publishing">
        <p>
          We offer publishing packages, mentorship, editing, design, distribution, branding, marketing
          and related services (&quot;Services&quot;), as described on our website. Service inclusions,
          timelines and deliverables are as specified in the applicable package or a separate written
          agreement. Certain deliverables depend on information, manuscripts and approvals provided by
          you in a timely manner.
        </p>
      </LegalSection>

      <LegalSection heading="4. Orders, Pricing & Payments">
        <p>
          All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless
          stated otherwise. We may update prices, packages and availability at any time. Payments are
          processed securely through our payment partner, <strong>Razorpay</strong>, which supports
          UPI, cards, netbanking and wallets. We do not store your card, UPI or banking credentials.
        </p>
        <p>
          An order is confirmed only after successful payment and verification. We reserve the right to
          cancel or refuse any order in cases of suspected fraud, pricing errors, or unavailability.
        </p>
      </LegalSection>

      <LegalSection heading="5. Intellectual Property & Author Content">
        <p>
          Authors retain the copyright to their original work. By submitting content to us, you grant
          ScratchBook the licence necessary to edit, format, print, distribute, list and promote your
          book across the channels agreed in your package. You confirm that your content is original,
          does not infringe any third-party rights, and is not unlawful, defamatory or obscene.
        </p>
        <p>
          All website content, branding, logos and design belonging to ScratchBook may not be copied
          or reused without our written permission. See our <a href="/copyright" className="text-brand hover:underline">Copyright Notice</a>.
        </p>
      </LegalSection>

      <LegalSection heading="6. Royalties & Payouts">
        <p>
          Where applicable, author royalties and payout schedules are as defined in the chosen
          publishing package or agreement. Royalties are calculated on net receipts and paid to the
          author&apos;s registered account per the agreed schedule, subject to any minimum thresholds and
          statutory deductions.
        </p>
      </LegalSection>

      <LegalSection heading="7. Acceptable Use">
        <p>
          You agree not to misuse the website, attempt unauthorised access, upload malicious code, or
          use our Services for any unlawful purpose. We may suspend or terminate accounts that violate
          these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, ScratchBook shall not be liable for any indirect,
          incidental or consequential damages arising from the use of our website or Services. Our
          total liability for any claim shall not exceed the amount you paid for the specific product
          or service giving rise to the claim.
        </p>
      </LegalSection>

      <LegalSection heading="9. Governing Law & Jurisdiction">
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
          jurisdiction of the courts of Hyderabad, Telangana.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to These Terms">
        <p>
          We may update these Terms from time to time. The updated version will be posted on this page
          with a revised &quot;Last updated&quot; date. Continued use of the website constitutes acceptance
          of the updated Terms.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
