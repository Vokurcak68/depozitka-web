import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.depozitka.eu"),
  title: {
    default: "Depozitka — Bezpečná platba pro každý online obchod",
    template: "%s · Depozitka",
  },
  description:
    "Depozitka drží peníze kupujícího v úschově, dokud prodávající neodešle zboží a kupující ho nepřevezme. Ochrana proti podvodům pro bazary, marketplace i nezávislé prodejce.",
  keywords: [
    "escrow",
    "bezpečná platba",
    "úschova peněz",
    "ochrana při nákupu",
    "online platba",
    "bazar",
    "marketplace",
    "platební brána",
  ],
  authors: [{ name: "Depozitka" }],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://www.depozitka.eu",
    siteName: "Depozitka",
    title: "Depozitka — Bezpečná platba pro každý online obchod",
    description:
      "Peníze držíme my, dokud nedostaneš zboží. Ochrana proti podvodům pro bazary, marketplace i nezávislé prodejce.",
    images: [
      {
        url: "/brand/logo.jpg",
        width: 800,
        height: 800,
        alt: "Depozitka logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Depozitka — Bezpečná platba pro každý online obchod",
    description:
      "Peníze držíme my, dokud nedostaneš zboží. Ochrana proti podvodům.",
    images: ["/brand/logo.jpg"],
  },
  icons: {
    icon: "/brand/logo.jpg",
    apple: "/brand/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const host = (h.get("host") || "").toLowerCase();
  const isStatusHost = host === "status.depozitka.eu" || host.startsWith("status.depozitka.eu:") || host === "www.status.depozitka.eu";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Depozitka",
    url: "https://www.depozitka.eu",
    logo: "https://www.depozitka.eu/brand/logo.jpg",
    email: "info@depozitka.eu",
    sameAs: [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Depozitka",
    url: "https://www.depozitka.eu",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.depozitka.eu/faq?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    inLanguage: "cs-CZ",
  };

  return (
    <html lang="cs">
      <body className="bg-white text-navy-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {!isStatusHost && <Navbar />}
        <main className="min-h-screen">{children}</main>
        {!isStatusHost && <Footer />}
      </body>
    </html>
  );
}
