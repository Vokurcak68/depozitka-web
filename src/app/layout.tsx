import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://depozitka.eu"),
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
    url: "https://depozitka.eu",
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className="bg-white text-navy-900 antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
