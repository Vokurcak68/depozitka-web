import type { Metadata } from "next";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import {
  CreditCard,
  Package,
  CheckCircle,
  Bank,
  Clock,
  ShieldCheck,
  ArrowRight,
  Scale,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Jak to funguje",
  description:
    "Podrobný popis procesu Depozitka — od zadání transakce přes platbu, odeslání a potvrzení převzetí až po výplatu prodávajícímu.",
};

const steps = [
  {
    num: "01",
    icon: CreditCard,
    title: "Vytvoření transakce",
    role: "Prodávající nebo marketplace",
    time: "Ihned",
    desc: "Prodávající (nebo váš bazar přes API) zadá v Depozitce nákupní transakci — částku, popis zboží, údaje kupujícího a prodávajícího. Kupující dostane email s pokyny k platbě včetně čísla účtu a variabilního symbolu.",
    details: [
      "Každá transakce má unikátní VS ve formátu DPT-YYYY-XXXX",
      "Email s instrukcemi jde kupujícímu do 60 sekund",
      "QR kód pro rychlou mobilní platbu je součástí emailu",
    ],
  },
  {
    num: "02",
    icon: Bank,
    title: "Kupující zaplatí do úschovy",
    role: "Kupující",
    time: "Do 24 hodin",
    desc: "Kupující zaplatí bankovním převodem na náš úschovní účet ve FIO bance. Automaticky párujeme příchozí platby podle variabilního symbolu — obvykle do 2 minut od připsání.",
    details: [
      "Platba jde na transparentní úschovní účet, ne na naše s.r.o.",
      "Oba účastníci vidí potvrzení o přijetí v reálném čase",
      "Nezaplacená transakce se po 24 hodinách automaticky ruší",
    ],
  },
  {
    num: "03",
    icon: Package,
    title: "Prodávající odešle zboží",
    role: "Prodávající",
    time: "Do 5 pracovních dnů",
    desc: "Po potvrzení platby prodávající odešle zásilku a zadá do systému tracking. My automaticky sledujeme stav přes napojení na přepravce (Česká pošta, Zásilkovna, PPL, DPD, GLS, Geis).",
    details: [
      "Povinný tracking = automatická verifikace doručení",
      "Volitelně foto podacího lístku pro zvýšenou ochranu",
      "Zpoždění? Kupující je automaticky informován",
    ],
  },
  {
    num: "04",
    icon: CheckCircle,
    title: "Kupující potvrdí převzetí",
    role: "Kupující",
    time: "Do 7 dnů od doručení",
    desc: "Po doručení kupující potvrdí, že zboží odpovídá popisu. Pokud to nezvládne, systém po 7 dnech automaticky započítá doručení jako úspěšné a spustí výplatu — ale jen pokud dopravce potvrdil doručení.",
    details: [
      "Automatické potvrzení podle přepravce v 14denní lhůtě",
      "Možnost reklamace a otevření sporu kdykoli před potvrzením",
      "Spor = peníze zůstávají v úschově až do rozhodnutí",
    ],
  },
  {
    num: "05",
    icon: ShieldCheck,
    title: "Výplata prodávajícímu",
    role: "Depozitka",
    time: "Do 2 pracovních dnů",
    desc: "Jakmile je transakce dokončená, generujeme platební příkaz na účet prodávajícího. Minus transparentní provize. Prodávající dostane email s detailem výplaty a dokladem.",
    details: [
      "Automatický XML příkaz přes FIO API",
      "Provize se strhává transparentně a jednorázově",
      "Daňový doklad k provizi v PDF ihned po výplatě",
    ],
  },
];

export default function JakToFungujePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              Proces krok za krokem
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Jak funguje <span className="text-gold-400">Depozitka</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-100 leading-relaxed">
              Pět jasných kroků. Žádná zbytečná byrokracie, žádné skryté
              poplatky. Každá fáze má jasnou lhůtu a odpovědnou stranu.
            </p>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <Section bg="white">
        <div className="space-y-16 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative">
              {idx < steps.length - 1 && (
                <div
                  className="hidden md:block absolute left-8 top-20 bottom-0 w-px bg-navy-200"
                  aria-hidden="true"
                />
              )}
              <div className="flex gap-6 md:gap-10">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-2xl bg-gold-400 flex items-center justify-center shadow-md">
                    <step.icon className="h-8 w-8 text-navy-900" />
                  </div>
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-gold-500">
                      KROK {step.num}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-navy-100 text-navy-700">
                      {step.role}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-navy-600">
                      <Clock className="h-3.5 w-3.5" />
                      {step.time}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
                    {step.title}
                  </h2>
                  <p className="text-navy-600 leading-relaxed mb-4">
                    {step.desc}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-sm text-navy-700"
                      >
                        <CheckCircle className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* DISPUTES */}
      <Section bg="gray">
        <SectionHeader
          eyebrow="Když něco nejde podle plánu"
          title="Řešení sporů"
          subtitle="Peníze v úschově zůstávají chráněné. Máme jasný postup pro každou komplikaci."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-navy-100">
            <Scale className="h-8 w-8 text-navy-700 mb-4" />
            <h3 className="text-lg font-bold text-navy-900 mb-2">
              Otevření sporu
            </h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Kupující nebo prodávající může kdykoli před potvrzením
              otevřít spor. Transakce se pozastaví, peníze zůstávají v
              úschově.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-navy-100">
            <Clock className="h-8 w-8 text-navy-700 mb-4" />
            <h3 className="text-lg font-bold text-navy-900 mb-2">
              Mediace (3 dny)
            </h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Obě strany mají 3 pracovní dny na doložení důkazů —
              fotografie, komunikace, tracking. Snažíme se dohodnout.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-navy-100">
            <ShieldCheck className="h-8 w-8 text-navy-700 mb-4" />
            <h3 className="text-lg font-bold text-navy-900 mb-2">
              Rozhodnutí
            </h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Pokud dohoda nevznikne, nezávislý arbitr rozhodne na základě
              důkazů a pravidel služby. Rozhodnutí je finální.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section bg="navy">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Jasný proces, férové lhůty
          </h2>
          <p className="text-lg text-navy-100 mb-8">
            Podívejte se na ceník nebo začněte rovnou s integrací.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/cenik" variant="primary" size="lg">
              Ceník <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/pro-provozovatele" variant="outline" size="lg">
              Pro marketplace
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
