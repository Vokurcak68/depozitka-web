import type { Metadata } from "next";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import {
  ShieldCheck,
  Lock,
  Scale,
  CheckCircle,
  Clock,
  ArrowRight,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Bezpečnost",
  description:
    "Jak Depozitka chrání vaše peníze i data. GDPR, auditovatelné logy, šifrovaná komunikace a nezávislá arbitráž.",
  alternates: {
    canonical: "/bezpecnost",
  },
  openGraph: {
    title: "Bezpečnost | Depozitka",
    description:
      "Bezpečnostní principy Depozitky: šifrování, ochrana dat a transparentní řešení sporů.",
    url: "https://depozitka.eu/bezpecnost",
    type: "website",
    images: ["/brand/logo-gold.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bezpečnost | Depozitka",
    description:
      "Jak chráníme peníze i data při online transakcích.",
    images: ["/brand/logo-gold.png"],
  },
};

const pillars = [
  {
    icon: Lock,
    title: "Šifrovaná komunikace",
    desc: "Všechna data proudí přes HTTPS s moderní TLS 1.3. API endpointy jsou zabezpečené Bearer tokeny, webhooky podepisujeme HMAC-SHA256, aby nikdo nemohl podstrčit falešné události.",
    points: [
      "TLS 1.3 na všech endpointech",
      "API klíče s možností rotace a scope restrikcí",
      "HMAC-SHA256 podpis webhooků",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Ochrana osobních údajů",
    desc: "Zpracováváme jen to, co je nezbytné pro provedení transakce. Data šifrujeme v klidu i při přenosu. Máme jmenovaného pověřence pro ochranu osobních údajů a jsme plně v souladu s GDPR.",
    points: [
      "Minimalizace dat — jen co je nutné pro transakci",
      "Právo na výmaz po uplynutí zákonné lhůty",
      "DPIA zpracována pro agendu úschovy prostředků",
    ],
  },
  {
    icon: Scale,
    title: "Nezávislé řešení sporů",
    desc: "Pokud se kupující a prodávající neshodnou, spor rozhoduje nezávislý arbitr podle jasných pravidel. Peníze po celou dobu zůstávají v úschově, žádná strana k nim nemá přístup.",
    points: [
      "Transparentní pravidla sporů dostupná veřejně",
      "Lhůta na doložení důkazů: 3 pracovní dny",
      "Odvolání možné u rozhodnutí nad 5 000 Kč",
    ],
  },
];

export default function BezpecnostPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              Bezpečnost
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Důvěra není slogan.<br />
              <span className="text-gold-400">Je to architektura.</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-100 leading-relaxed">
              Bezpečnost stavíme na třech pilířích: šifrované infrastruktuře,
              přísné ochraně osobních údajů a nezávislé arbitráži sporů.
            </p>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <Section bg="white">
        <div className="space-y-12 max-w-5xl mx-auto">
          {pillars.map((p, idx) => (
            <div
              key={p.title}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:col-span-4">
                <div className="h-16 w-16 rounded-2xl bg-gold-400 flex items-center justify-center mb-4 shadow-md">
                  <p.icon className="h-8 w-8 text-navy-900" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
                  {p.title}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="text-navy-600 leading-relaxed mb-5 text-lg">
                  {p.desc}
                </p>
                <ul className="space-y-2">
                  {p.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-navy-700"
                    >
                      <CheckCircle className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* AUDIT LOG */}
      <Section bg="gray">
        <SectionHeader
          eyebrow="Transparentnost"
          title="Každá akce je zalogována"
          subtitle="Od vytvoření transakce po výplatu. Audit log uchováváme 10 let podle zákona o účetnictví."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-navy-100">
            <Clock className="h-8 w-8 text-navy-700 mb-4" />
            <h3 className="text-lg font-bold text-navy-900 mb-2">
              Časové razítko
            </h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Každá událost má přesný čas, IP adresu a identifikátor
              uživatele, který ji provedl.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-navy-100">
            <Lock className="h-8 w-8 text-navy-700 mb-4" />
            <h3 className="text-lg font-bold text-navy-900 mb-2">
              Neměnný záznam
            </h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Audit log je append-only — žádný záznam nelze smazat ani
              upravit, jen přidat nový.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-navy-100">
            <ShieldCheck className="h-8 w-8 text-navy-700 mb-4" />
            <h3 className="text-lg font-bold text-navy-900 mb-2">
              Přístup účastníkům
            </h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Kupující i prodávající vidí kompletní historii své
              transakce ve svém rozhraní.
            </p>
          </div>
        </div>
      </Section>

      {/* COMPLIANCE */}
      <Section bg="white">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            eyebrow="Soulad s regulací"
            title="Právní rámec"
          />
          <div className="space-y-4">
            <div className="bg-navy-50 rounded-xl p-6 border border-navy-100">
              <h3 className="font-bold text-navy-900 mb-2">
                GDPR (EU 2016/679)
              </h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                Plný soulad s nařízením o ochraně osobních údajů.
                Zpracováváme jen údaje nezbytné pro plnění smlouvy a
                zákonných povinností.
              </p>
            </div>
            <div className="bg-navy-50 rounded-xl p-6 border border-navy-100">
              <h3 className="font-bold text-navy-900 mb-2">
                AML zákon (253/2008 Sb.)
              </h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                U transakcí nad zákonný limit provádíme identifikaci a
                kontrolu klienta dle platných pravidel proti praní
                špinavých peněz.
              </p>
            </div>
            <div className="bg-navy-50 rounded-xl p-6 border border-navy-100">
              <h3 className="font-bold text-navy-900 mb-2">
                Zákon o účetnictví (563/1991 Sb.)
              </h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                Všechny transakce a doklady archivujeme po dobu 10 let
                podle požadavků českého účetního zákona.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section bg="navy">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Máte konkrétní dotaz k bezpečnosti?
          </h2>
          <p className="text-lg text-navy-100 mb-8">
            Rádi vám poskytneme detaily o naší infrastruktuře, smluvních
            partnerech i interním security procesu.
          </p>
          <Button href="/kontakt" variant="primary" size="lg">
            Napsat nám <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </Section>
    </>
  );
}
