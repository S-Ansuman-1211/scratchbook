import { NextResponse } from "next/server";
import { getPhonePeClient } from "@/lib/phonepe";
import { finalizeOrder } from "@/lib/finalizeOrder";

// PhonePe server-to-server webhook. Configure the URL + username/password in the
// PhonePe dashboard. This is the reliable confirmation path (fires even if the buyer
// closes the tab before being redirected back).
export async function POST(req: Request) {
  const authorization = req.headers.get("authorization") ?? "";
  const body = await req.text();

  const username = process.env.PHONEPE_CALLBACK_USERNAME ?? "";
  const password = process.env.PHONEPE_CALLBACK_PASSWORD ?? "";

  try {
    const client = getPhonePeClient();
    // Validates the auth header against the configured username/password.
    const callback = client.validateCallback(username, password, authorization, body);

    // The merchantOrderId we sent is echoed back in the payload.
    const merchantOrderId =
      callback.payload?.merchantOrderId ?? callback.payload?.orderId ?? null;

    if (merchantOrderId) {
      await finalizeOrder(merchantOrderId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PhonePe callback validation failed:", err);
    // Return 400 so PhonePe retries later.
    return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
  }
}
