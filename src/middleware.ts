export { default } from "next-auth/middleware";

// Protect the author dashboard and account/checkout routes.
// Unauthenticated users are redirected to /login (configured in authOptions.pages).
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
