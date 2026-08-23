import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// NextAuth always stamps an Expires/Max-Age on the session cookie. We strip it
// for the session-token cookie so it becomes a *session cookie* — the browser
// deletes it when fully closed (logout on browser close). The JWT still carries
// its own 1-day expiry as a safety cap.
function toSessionCookies(res: Response): Response {
  const setCookies: string[] =
    typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  if (setCookies.length === 0) return res;

  const rewritten = setCookies.map((c) =>
    /session-token/.test(c)
      ? c.replace(/;\s*Expires=[^;]+/i, "").replace(/;\s*Max-Age=[^;]+/i, "")
      : c
  );

  // Rebuild headers, replacing the Set-Cookie entries.
  const headers = new Headers(res.headers);
  headers.delete("set-cookie");
  for (const c of rewritten) headers.append("set-cookie", c);

  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

async function wrapped(req: Request, ctx: unknown): Promise<Response> {
  const run = handler as unknown as (req: Request, ctx: unknown) => Promise<Response>;
  const res = await run(req, ctx);
  return toSessionCookies(res);
}

export { wrapped as GET, wrapped as POST };
