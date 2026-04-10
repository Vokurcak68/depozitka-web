import type { Metadata } from "next";
import Link from "next/link";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Časté otázky",
  description:
    "Odpovědi na nejčastější dotazy ke službě Depozitka — jak platba funguje, co se děje při sporu, kolik to stojí a jak chráníme vaše peníze.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ | Depozitka",
    description:
      "Nejčastější dotazy k bezpečné platbě přes Depozitku: platby, spory, provize i integrace.",
    url: "https://www.depozitka.eu/faq",
    type: "article",
    images: ["/brand/logo-gold.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Depozitka",
    description:
      "Odpovědi na nejčastější dotazy ke službě Depozitka.",
    images: ["/brand/logo-gold.png"],
  },
};

const faqs = [
  {
    category: "Základy",
    items: [
      {
        q: "Co je to úschova peněz?",
        a: "Je to nezávislá úschova peněz třetí stranou. Kupující zaplatí nám, my peníze držíme, a prodávajícímu je vyplatíme až po potvrzení, že zboží dorazilo a odpovídá popisu. Pokud něco nesedí, peníze vracíme kupujícímu.",
      },
      {
        q: "Pro koho je Depozitka určena?",
        a: "Primárně pro online bazary, marketplace platformy a nezávislé prodejce, kteří chtějí kupujícím nabídnout bezpečnou platbu bez nutnosti řešit vlastní systém úschovy plateb.",
      },
      {
        q: "Jak se Depozitka liší od platební brány?",
        a: "Platební brána jen zprostředkuje platbu mezi kupujícím a prodávajícím — peníze jdou ihned prodejci. Depozitka drží peníze v úschově, dokud kupující nepotvrdí přijetí zboží. To je zásadní rozdíl v ochraně.",
      },
    ],
  },
  {
    category: "Platba a výplata",
    items: [
      {
        q: "Jak probíhá platba?",
        a: "Kupující platí bankovním převodem na náš úschovní účet ve FIO bance. Do emailu dostane číslo účtu, variabilní symbol a QR kód pro rychlou platbu. Platby automaticky párujeme podle VS.",
      },
      {
        q: "Jak dlouho trvá výplata prodávajícímu?",
        a: "Po potvrzení doručení nebo uplynutí automatické lhůty generujeme platební příkaz do 2 pracovních dnů. Převod na bankovní účet prodávajícího trvá obvykle jeden další pracovní den.",
      },
      {
        q: "Můžu platit kartou?",
        a: "V první fázi podporujeme jen bankovní převod (včetně QR plateb). Platby kartou plánujeme přidat po nasazení na širší škálu marketplaces.",
      },
      {
        q: "Co když kupující nezaplatí?",
        a: "Transakce se automaticky ruší po 24 hodinách. Prodávající není blokován a může zboží nabídnout znovu. Neplatí se žádná provize.",
      },
    ],
  },
  {
    category: "Spory a ochrana",
    items: [
      {
        q: "Co když zboží nedorazí?",
        a: "Depozitka automaticky sleduje tracking přepravce. Pokud dopravce potvrdí nedoručení, nebo prodávající nezadá tracking ve stanovené lhůtě, peníze se automaticky vrátí kupujícímu.",
      },
      {
        q: "Co když zboží dorazí poškozené nebo jiné, než bylo inzerováno?",
        a: "Kupující může otevřít spor před potvrzením převzetí. Peníze zůstanou v úschově, obě strany mají 3 pracovní dny na doložení důkazů (foto, komunikace). Pokud se strany nedohodnou, rozhoduje nezávislý arbitr.",
      },
      {
        q: "Kdo rozhoduje spory?",
        a: "Nezávislý arbitrážní proces podle transparentních pravidel. U sporů nad 5 000 Kč je možné odvolání k druhostupňovému rozhodčímu.",
      },
      {
        q: "Můžu jako kupující odstoupit od nákupu?",
        a: "Ano, pokud je zboží prodáváno podnikatelem (B2C). Uplatní se standardní 14denní lhůta pro odstoupení. Mezi soukromými osobami (C2C) záleží na individuálních dohodách, Depozitka v takovém případě posuzuje každý případ individuálně.",
      },
    ],
  },
  {
    category: "Ceny a účetnictví",
    items: [
      {
        q: "Kolik to stojí?",
        a: "Pro jednotlivce 5 % z částky transakce, minimálně 15 Kč. Pro marketplace integrace od 3 % podle objemu. Detaily najdete v ceníku.",
      },
      {
        q: "Kdo platí provizi?",
        a: "Standardně prodávající — provize se strhává z výplaty. Marketplace si ale může v rámci API nastavit, aby provizi platil kupující nebo se dělila.",
      },
      {
        q: "Dostanu daňový doklad?",
        a: "Ano, ke každé provizi generujeme PDF fakturu dostupnou v rozhraní. Pro prodávající i pro provozovatele marketplace.",
      },
    ],
  },
  {
    category: "Technické",
    items: [
      {
        q: "Máte API?",
        a: "Ano, REST API s kompletní dokumentací. Podporujeme vytváření transakcí, sledování stavu, webhooky pro real-time události a sandbox prostředí pro vývoj. Detaily na stránce Pro provozovatele.",
      },
      {
        q: "Jak dlouho trvá integrace?",
        a: "Základní integrace (vytváření transakcí, příjem webhooků) se dá zvládnout za jedno odpolední. Plná integrace včetně uživatelského rozhraní a onboardingu trvá typicky do týdne.",
      },
      {
        q: "Kde jsou uložena data?",
        a: "Servery a databáze provozujeme v datacentrech na území EU. Data šifrujeme v klidu (AES-256) i při přenosu (TLS 1.3).",
      },
    ],
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              FAQ
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Časté otázky
            </h1>
            <p className="text-lg sm:text-xl text-navy-100 leading-relaxed">
              Odpovědi na to, na co se lidé nejčastěji ptají. Nenašli jste
              to, co hledáte?{" "}
              <Link
                href="/kontakt"
                className="text-gold-400 hover:text-gold-300 underline-offset-4 hover:underline"
              >
                Napište nám.
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ GROUPS */}
      <Section bg="white">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((group) => (
            <div key={group.category}>
              <h2 className="text-2xl font-bold text-navy-900 mb-6 pb-3 border-b border-navy-200">
                {group.category}
              </h2>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <details
                    key={item.q}
                    className="bg-navy-50 rounded-xl border border-navy-100 group"
                  >
                    <summary className="cursor-pointer font-bold text-navy-900 p-5 flex items-center justify-between gap-4 list-none">
                      <span>{item.q}</span>
                      <span className="text-gold-500 text-2xl leading-none flex-shrink-0 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-navy-700 leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section bg="gold">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
            Nenašli jste odpověď?
          </h2>
          <p className="text-lg text-navy-700 mb-8">
            Napište nám konkrétní dotaz — odpovídáme do 24 hodin v
            pracovní dny.
          </p>
          <Button href="/kontakt" variant="secondary" size="lg">
            Napsat nám <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </Section>
    </>
  );
}
