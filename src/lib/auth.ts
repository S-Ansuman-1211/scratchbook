import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const user = await prisma.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
      if (!user || !user.passwordHash) return null;
      const ok = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!ok) return null;
      return { id: user.id, name: user.name, email: user.email, role: user.role };
    },
  }),
];

// Google login is enabled only when its credentials are configured.
export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
if (googleEnabled) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  );
}

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

export const authOptions: NextAuthOptions = {
  // Sessions end when the browser closes (session cookie), with a 1-day JWT
  // cap as a safety net so a session can never linger.
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        // No maxAge/expires -> browser deletes the cookie when it closes.
      },
    },
  },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    // Ensure a Google sign-in has a matching row in our own User table.
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        if (!email) return false;
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: user.name ?? email.split("@")[0],
            role: "CUSTOMER",
            passwordHash: crypto.randomUUID(), // unusable placeholder (no password login)
          },
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({ where: { email: (user.email ?? "").toLowerCase() } });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } else {
          token.id = user.id;
          token.role = (user as { role: Role }).role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
