import LegalShell, { LegalSection } from "@/components/LegalShell";

export const metadata = { title: "Shipping & Delivery Policy | ScratchBook Publications" };

export default function ShippingPage() {
  return (
    <LegalShell title="Shipping &amp; Delivery Policy">
      <p>
        This policy explains how <strong>ScratchBook Publications</strong> delivers physical books and
        digital products to you.
      </p>

      <LegalSection heading="1. Digital Delivery (E-books)">
        <p>
          E-books and downloadable products are delivered electronically. Access details or download
          links are provided on your account and/or by email immediately after your payment is
          confirmed. No physical shipping is involved.
        </p>
      </LegalSection>

      <LegalSection heading="2. Physical Books — Processing Time">
        <p>
          Many of our titles are <strong>print-on-demand</strong>, which means each copy is printed after
          your order is placed. Orders are typically processed and dispatched within{" "}
          <strong>3–7 business days</strong>. Pre-orders and author copies may take longer, as indicated
          on the product page.
        </p>
      </LegalSection>

      <LegalSection heading="3. Delivery Timelines">
        <p>
          After dispatch, delivery within India usually takes <strong>4–10 business days</strong>,
          depending on your location and the courier partner. Remote areas may take additional time.
          Delivery estimates are indicative and not guaranteed.
        </p>
      </LegalSection>

      <LegalSection heading="4. Shipping Charges">
        <p>
          Shipping charges, where applicable, are calculated based on the weight of the package and the
          delivery location, and are shown before you complete payment. Some promotions may include free
          shipping.
        </p>
      </LegalSection>

      <LegalSection heading="5. Order Tracking">
        <p>
          Where a courier provides tracking, we will share the tracking details with you by email or on
          your account once your order is dispatched.
        </p>
      </LegalSection>

      <LegalSection heading="6. Delays">
        <p>
          We are not responsible for delays caused by couriers, incorrect or incomplete addresses,
          natural events, or other circumstances beyond our control. Please ensure your delivery address
          and phone number are accurate at checkout.
        </p>
      </LegalSection>

      <LegalSection heading="7. International Shipping">
        <p>
          Selected titles may be available for international delivery. Where offered, international
          timelines, charges and any applicable customs duties will be communicated before dispatch.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
