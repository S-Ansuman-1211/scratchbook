// Lightweight email helper. Uses Resend's REST API when RESEND_API_KEY is set;
// otherwise logs to the console so local/dev never breaks. Calls are best-effort:
// a failure here must never fail the underlying request (order, contact, etc.).

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

const FROM = process.env.EMAIL_FROM || "ScratchBook <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.log(`📧 [email disabled] would send "${subject}" to ${Array.isArray(to) ? to.join(", ") : to}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("📧 email send failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("📧 email send error:", err);
  }
}

// Minimal branded wrapper so all emails look consistent.
export function emailLayout(heading: string, bodyHtml: string): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#16151d">
    <div style="background:#16151d;padding:20px 24px;border-radius:12px 12px 0 0">
      <span style="color:#fff;font-size:18px;font-weight:700">Scratch<span style="color:#c7d2fe">Book</span></span>
    </div>
    <div style="border:1px solid #e8e7f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 24px">
      <h1 style="font-size:20px;margin:0 0 12px">${heading}</h1>
      ${bodyHtml}
      <p style="margin-top:28px;font-size:12px;color:#8b8a95">ScratchBook Publications</p>
    </div>
  </div>`;
}
