import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { profile, siteUrl } from "@/lib/content";
import { BatSymbol } from "@/components/atmosphere/BatMark";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  keywords: [
    profile.name,
    "portfolio",
    "designer",
    "developer",
    "creative developer",
    "interaction design",
    "Next.js",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    url: siteUrl,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    url: siteUrl,
    sameAs: profile.socials.map((s) => s.href),
  };

  return (
    <html
      lang="en"
      className={`${anton.variable} ${grotesk.variable} ${jbmono.variable}`}
    >
      <body>
        <BatSymbol />
        {/* No-JS safety net: entrance animations SSR with opacity 0 — force
            everything visible when JavaScript is unavailable. */}
        <noscript>
          <style>{`[style*="opacity"]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // escape "<" so owner-edited content can never break out of the tag
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
