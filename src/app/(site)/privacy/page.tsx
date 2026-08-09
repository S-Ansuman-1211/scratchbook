import LegalShell, { LegalSection } from "@/components/LegalShell";

export const metadata = { title: "Privacy Policy | ScratchBook Publications" };

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p>
        This Privacy Policy explains how <strong>ScratchBook Publications</strong> (&quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;) collects, uses and protects your personal information when you
        use our website and services. We are committed to safeguarding your privacy.
      </p>

      <LegalSection heading="1. Information We Collect">
        <p>We may collect the following information:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Account details:</strong> name, email address and mobile number.</li>
          <li><strong>Order &amp; delivery details:</strong> shipping name, phone number and address.</li>
          <li><strong>Author submissions:</strong> manuscripts, bios and related content you provide.</li>
          <li><strong>Transaction details:</strong> order history and payment status (not card/UPI data).</li>
          <li><strong>Usage data:</strong> basic technical information such as browser type and pages visited.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. How We Use Your Information">
        <ul className="list-disc space-y-1 pl-6">
          <li>To create and manage your account.</li>
          <li>To process orders, payments, publishing and deliveries.</li>
          <li>To provide the services and support you request.</li>
          <li>To send order confirmations, updates and important notices.</li>
          <li>To improve our website, services and customer experience.</li>
          <li>To comply with legal and regulatory obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Payment Information">
        <p>
          Payments are processed by our payment gateway partner, <strong>Razorpay</strong>. Your card,
          UPI and banking details are entered directly with Razorpay and are <strong>never stored on our
          servers</strong>. We only receive confirmation of a payment&apos;s success or failure and a
          reference ID. Razorpay&apos;s handling of your data is subject to their own privacy policy.
        </p>
      </LegalSection>

      <LegalSection heading="4. Sharing of Information">
        <p>
          We do not sell your personal information. We share it only with trusted service providers who
          help us operate — including our payment gateway (Razorpay), hosting provider, email service,
          and distribution/printing partners — strictly to the extent needed to deliver our services, or
          where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="5. Cookies">
        <p>
          We use essential cookies to keep you signed in and to make the website function correctly. You
          can control cookies through your browser settings, though disabling them may affect
          functionality such as login and checkout.
        </p>
      </LegalSection>

      <LegalSection heading="6. Data Retention & Security">
        <p>
          We retain your information for as long as your account is active or as needed to provide
          services and meet legal obligations. Passwords are stored in encrypted (hashed) form, and we
          apply reasonable technical and organisational measures to protect your data. No method of
          transmission over the internet is completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="7. Your Rights">
        <p>
          You may request access to, correction of, or deletion of your personal information by
          contacting us. We will respond in accordance with applicable law. You may also unsubscribe
          from non-essential communications at any time.
        </p>
      </LegalSection>

      <LegalSection heading="8. Children's Privacy">
        <p>
          Our services are not directed at children under 18, and we do not knowingly collect their
          personal information without parental consent.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. The latest version will always be
          available on this page with a revised &quot;Last updated&quot; date.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
