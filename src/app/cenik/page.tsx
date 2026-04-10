import type { Metadata } from "next";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import { CheckCircle, ArrowRight, Sparkles } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Ceník",
  description:
    "Transparentní ceny Depozitky. Žádné měsíční poplatky, platíte jen z úspěšně dokončené transakce. 5 % z částky, minimálně 15 Kč.",
  alternates: {
    canonical: "/cenik",
  },
  openGraph: {
    title: "Ceník Depozitky",
    description:
      "Platíte jen za úspěšný obchod. Pro jednotlivce 5 % z transakce, pro marketplace individuálně.",
    url: "https://www.depozitka.eu/cenik",
    type: "website",
    images: ["/brand/logo-gold.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ceník Depozitky",
    description:
      "Transparentní ceny bez měsíčních poplatků.",
    images: ["/brand/logo-gold.png"],
  },
};

const included = [
  "Úschovní účet ve FIO bance",
  "Automatické párování plateb dle VS",
  "Napojení na 6 přepravců (ČP, Zásilkovna, PPL, DPD, GLS, Geis)",
  "Email notifikace oběma stranám",
  "Řešení sporů s nezávislým arbitrem",
  "Audit log každé akce (10 let)",
  "Automatické potvrzení doručení",
  "Daňové doklady k provizím",
  "Podpora v češtině",
];

const operatorIncluded = [
  "REST API s kompletní dokumentací",
  "Webhooky pro real-time události",
  "Sandbox prostředí pro testování",
  "SDK (plánováno: Node.js, PHP, Python)",
  "Onboarding support & integrace",
  "Vlastní branding v emailech transakcí",
  "Přednostní řešení sporů",
  "SLA 99,9 % dostupnost",
];

export default function CenikPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              Transparentní ceny
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Platíte jen<br />
              <span className="text-gold-400">za úspěšný obchod</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-100 leading-relaxed">
              Žádné měsíční poplatky, žádná vstupní investice. Provize se
              strhává jednorázově z dokončené transakce.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN PRICING */}
      <Section bg="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Individuální uživatelé */}
          <div className="bg-white rounded-2xl border-2 border-navy-100 p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy-600 mb-2">
                Pro jednotlivce
              </h2>
              <p className="text-navy-600">
                Pro nezávislé prodejce a jednorázové obchody
              </p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-navy-900">5 %</span>
                <span className="text-xl text-navy-600">z transakce</span>
              </div>
              <p className="text-sm text-navy-500 mt-2">
                Minimálně 15 Kč · Bez DPH
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <span className="text-navy-700">{item}</span>
                </li>
              ))}
            </ul>
            <Button
              href="/kontakt"
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Začít používat
            </Button>
          </div>

          {/* Marketplace */}
          <div className="bg-navy-gradient text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-6 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-400 text-navy-900 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              Individuální
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-2">
                Pro marketplace
              </h2>
              <p className="text-navy-100">
                API integrace pro bazary a platformy
              </p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">od 3 %</span>
              </div>
              <p className="text-sm text-navy-200 mt-2">
                Nižší provize podle objemu · Individuální smlouva
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {operatorIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <span className="text-navy-100">{item}</span>
                </li>
              ))}
            </ul>
            <Button
              href="/kontakt"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Domluvit konzultaci
            </Button>
          </div>
        </div>
      </Section>

      {/* EXAMPLES */}
      <Section bg="gray">
        <SectionHeader
          eyebrow="Příklady"
          title="Kolik zaplatíte?"
          subtitle="Provize se strhává z částky transakce — přesně a jednoduše."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { amount: 500, fee: 25 },
            { amount: 2500, fee: 125 },
            { amount: 10000, fee: 500 },
          ].map((ex) => (
            <div
              key={ex.amount}
              className="bg-white rounded-2xl p-6 border border-navy-100 text-center"
            >
              <p className="text-sm text-navy-600 mb-2">Transakce</p>
              <p className="text-3xl font-bold text-navy-900 mb-4">
                {ex.amount.toLocaleString("cs-CZ")} Kč
              </p>
              <div className="h-px bg-navy-100 my-4" />
              <p className="text-sm text-navy-600 mb-1">Provize Depozitky</p>
              <p className="text-2xl font-bold text-gold-600">
                {ex.fee} Kč
              </p>
              <p className="text-xs text-navy-500 mt-2">
                Prodávající dostane{" "}
                <strong className="text-navy-900">
                  {(ex.amount - ex.fee).toLocaleString("cs-CZ")} Kč
                </strong>
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-navy-600 mt-8 max-w-2xl mx-auto">
          Minimální provize je 15 Kč. Pro transakce pod 300 Kč se tak
          efektivní sazba mírně zvyšuje.
        </p>
      </Section>

      {/* FAQ TEASER */}
      <Section bg="white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-8 text-center">
            Často kladené otázky k cenám
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Platím něco předem?",
                a: "Ne. Depozitka funguje čistě na provizi. Žádné vstupní ani měsíční poplatky.",
              },
              {
                q: "Kdo platí provizi — kupující, nebo prodávající?",
                a: "Standardně prodávající (strhává se z výplaty). Marketplace si ale mohou nastavit jiný model v rámci API.",
              },
              {
                q: "Co když transakce selže?",
                a: "Pokud kupující nezaplatí, transakce se ruší a neplatí se nic. Pokud se otevře spor, provize se strhává až po rozhodnutí.",
              },
              {
                q: "Dostanu daňový doklad?",
                a: "Ano, ke každé provizi automaticky generujeme PDF fakturu. Najdete ji v admin rozhraní.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-navy-50 rounded-xl p-5 border border-navy-100"
              >
                <h3 className="font-bold text-navy-900 mb-2">{item.q}</h3>
                <p className="text-sm text-navy-700 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button href="/faq" variant="ghost">
              Všechny otázky <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
