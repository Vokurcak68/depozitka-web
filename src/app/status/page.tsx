import type { Metadata } from "next";
import StatusBoard from "@/components/StatusBoard";
import CloseTabButton from "@/components/CloseTabButton";

export const metadata: Metadata = {
  title: "Status služeb",
  description: "Veřejný status služeb Depozitka a historie incidentů.",
  alternates: {
    canonical: "/status",
  },
  openGraph: {
    title: "Status služeb · Depozitka",
    description: "Veřejný status služeb Depozitka a historie incidentů.",
    url: "https://www.depozitka.eu/status",
    type: "website",
    images: ["/brand/logo-gold.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Status služeb · Depozitka",
    description: "Veřejný status služeb Depozitka a historie incidentů.",
    images: ["/brand/logo-gold.png"],
  },
};

export default function StatusPage() {
  return (
    <section className="bg-navy-50 min-h-[70vh] relative">
      <CloseTabButton fallbackUrl="https://www.depozitka.eu" />
      <StatusBoard />
    </section>
  );
}
