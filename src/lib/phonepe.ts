import { StandardCheckoutClient, Env } from "pg-sdk-node";

// Singleton PhonePe Standard Checkout client.
// Credentials come from the client's PhonePe Business dashboard.
//
// PhonePe uses a REDIRECT flow (not a popup):
//   1. We create an order and call client.pay() -> get a redirectUrl.
//   2. We send the buyer to that PhonePe-hosted page.
//   3. After paying, PhonePe redirects them back to our /payment-status page
//      AND sends a server-to-server webhook to /api/checkout/callback.
//   4. We confirm the final state with client.getOrderStatus().

const globalForPhonePe = globalThis as unknown as {
  phonepe?: StandardCheckoutClient;
};

function createClient(): StandardCheckoutClient {
  const clientId = process.env.PHONEPE_CLIENT_ID ?? "";
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET ?? "";
  const clientVersion = Number(process.env.PHONEPE_CLIENT_VERSION ?? "1");
  const env = process.env.PHONEPE_ENV === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;

  return StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
}

export function getPhonePeClient(): StandardCheckoutClient {
  if (!globalForPhonePe.phonepe) {
    globalForPhonePe.phonepe = createClient();
  }
  return globalForPhonePe.phonepe;
}

export function isPhonePeConfigured(): boolean {
  return Boolean(process.env.PHONEPE_CLIENT_ID && process.env.PHONEPE_CLIENT_SECRET);
}
