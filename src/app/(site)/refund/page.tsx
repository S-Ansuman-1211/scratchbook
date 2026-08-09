import LegalShell, { LegalSection } from "@/components/LegalShell";

export const metadata = { title: "Refund & Cancellation Policy | ScratchBook Publications" };

export default function RefundPage() {
  return (
    <LegalShell title="Refund &amp; Cancellation Policy">
      <p>
        This policy explains cancellations, returns and refunds for purchases made from
        <strong> ScratchBook Publications</strong>. Because we deal in books (physical and digital) and
        creative services, please read the relevant section carefully.
      </p>

      <LegalSection heading="1. Physical Books">
        <p>
          <strong>Cancellations:</strong> You may cancel an order for a physical book before it has been
          dispatched or printed (many titles are print-on-demand). Once printing or dispatch has begun,
          the order cannot be cancelled.
        </p>
        <p>
          <strong>Damaged or defective items:</strong> If your book arrives damaged, defective or
          incorrect, please contact us within <strong>48 hours</strong> of delivery with your order ID
          and photographs. After verification, we will arrange a replacement or a full refund.
        </p>
        <p>
          <strong>Returns:</strong> As books are read-once products, we do not accept returns for
          reasons other than damage, defect or an incorrect item being shipped.
        </p>
      </LegalSection>

      <LegalSection heading="2. E-books & Digital Products">
        <p>
          Due to the nature of digital goods, e-books and downloadable products are{" "}
          <strong>non-refundable</strong> once access has been granted or the file has been delivered,
          except where the file is corrupted or inaccessible and we are unable to resolve the issue.
        </p>
      </LegalSection>

      <LegalSection heading="3. Publishing & Promotional Services">
        <p>
          For publishing packages and services, refunds depend on the stage of work completed:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Before any work has commenced — eligible for a refund, less any non-recoverable third-party costs (e.g. ISBN, government fees) already incurred.</li>
          <li>Once work has begun (editing, design, listing, promotions, etc.) — fees for completed milestones are non-refundable.</li>
          <li>Third-party and platform-driven services (e.g. celebrity features, paid promotions, printing) are non-refundable once initiated.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. How to Request a Refund or Cancellation">
        <p>
          Email <a href="mailto:scratchbookpublications@gmail.com" className="text-brand hover:underline">scratchbookpublications@gmail.com</a>{" "}
          or call <a href="tel:+918847816635" className="text-brand hover:underline">+91 88478 16635</a> with your
          order ID and reason. Our team will respond within 2–3 business days.
        </p>
      </LegalSection>

      <LegalSection heading="5. Refund Timelines">
        <p>
          Approved refunds are processed back to your original payment method through Razorpay. Once
          approved, refunds typically reflect in your account within <strong>5–7 business days</strong>,
          depending on your bank or payment provider.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
