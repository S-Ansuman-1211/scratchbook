import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Fraunces — an expressive display serif for headings; gives the premium,
// editorial-yet-modern feel a bookstore storefront wants.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  // SEO from Website Flow doc
  title: "Publish your Book | ScratchBook Publications",
  description:
    "We are here to help you publish your book worldwide with outstanding mentorship. Workshops, publishing, branding and promotions for authors across India.",
  keywords: [
    "book publishing",
    "self publishing India",
    "author mentorship",
    "anthology",
    "ScratchBook",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
