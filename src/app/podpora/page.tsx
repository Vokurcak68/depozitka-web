import type { Metadata } from "next";
import SupportForm from "@/components/SupportForm";

export const metadata: Metadata = {
  title: "Napsat nám",
  description: "Rychlý kontakt na tým Depozitky (včetně příloh).",
  alternates: { canonical: "/podpora" },
  openGraph: {
    title: "Napsat nám · Depozitka",
    description: "Rychlý kontakt na tým Depozitky (včetně příloh).",
    url: "https://www.depozitka.eu/podpora",
    type: "website",
    images: ["/brand/logo-gold.png"],
  },
};

export default function PodporaPage() {
  return (
    <section className="bg-navy-50 min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900">Napsat nám</h1>
        <p className="mt-3 text-navy-600">
          Napiš nám přes krátký formulář — dostaneš ID a můžeš přiložit screenshoty nebo logy.
        </p>
        <div className="mt-8">
          <SupportForm />
        </div>
      </div>
    </section>
  );
}
