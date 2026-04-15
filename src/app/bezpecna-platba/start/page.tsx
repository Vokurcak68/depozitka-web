import type { Metadata } from "next";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Package,
  Sparkles,
  Users,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Bezpečná platba — Start",
  description:
    "Rychlý start bezpečné platby mezi lidmi. Moderní vstupní stránka, která navede do klasického formuláře.",
  alternates: {
    canonical: "/bezpecna-platba/start",
  },
};

const scenarios = [
  {
    title: "Elektronika",
    desc: "Mobil, notebook, konzole. Jasné podmínky + tracking.",
  },
  {
    title: "Sběratelské kousky",
    desc: "Modely, karty, rarity. Bezpečný průběh obchodu.",
  },
  {
    title: "Móda a doplňky",
    desc: "Boty, kabelky, streetwear. Transparentní postup.",
  },
  {
    title: "Ostatní",
    desc: "Cokoliv, co posíláš dopravcem a chceš mít kryté.",
  },
];

const steps = [
  {
    num: "01",
    title: "Vyplníš nabídku",
    desc: "Cena, kdo prodává/kupuje, způsob doručení.",
    icon: Sparkles,
  },
  {
    num: "02",
    title: "Druhá strana potvrdí OTP",
    desc: "Bez potvrzení se nic nespustí.",
    icon: CheckCircle,
  },
  {
    num: "03",
    title: "Vznikne úschova",
    desc: "Peníze držíme bezpečně až do převzetí.",
    icon: ShieldCheck,
  },
  {
    num: "04",
    title: "Odeslání + tracking",
    desc: "Systém hlídá průběh zásilky i lhůty.",
    icon: Package,
  },
];

export default function BezpecnaPlatbaStartPage() {
  return (
    <>
      <Section bg="white" className="overflow-hidden">
        <div className="relative rounded-3xl border border-navy-100 bg-gradient-to-br from-white via-navy-50 to-gold-50 p-8 sm:p-12">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-200/30 blur-2xl" />
          <div className="absolute -left-12 -bottom-16 h-44 w-44 rounded-full bg-sky-300/20 blur-2xl" />

          <div className="relative z-10 max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-700">
              <Sparkles className="h-4 w-4 text-gold-500" />
              Nový start pro bezpečnou platbu
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">
              Bezpečná platba mezi lidmi,
              <span className="block text-gold-600">jednodušeji a přehledněji</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-700 sm:text-lg">
              Tohle je nový vstup. Vše tě navede do klasického formuláře, který už znáš.
              Funkčnost zůstává stejná — jen lepší začátek pro nové uživatele.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/bezpecna-platba/novy" size="lg" variant="primary">
                Pokračovat do klasického formuláře <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/bezpecna-platba" size="lg" variant="outlineDark">
                Zpět na přehled služby
              </Button>
            </div>

            <div className="mt-6 grid max-w-2xl grid-cols-1 gap-3 text-sm text-navy-700 sm:grid-cols-3">
              <div className="rounded-xl border border-navy-100 bg-white/70 p-3">
                <strong>~2 minuty</strong>
                <div>na založení nabídky</div>
              </div>
              <div className="rounded-xl border border-navy-100 bg-white/70 p-3">
                <strong>OTP potvrzení</strong>
                <div>žádné nechtěné obchody</div>
              </div>
              <div className="rounded-xl border border-navy-100 bg-white/70 p-3">
                <strong>Tracking & lhůty</strong>
                <div>vše pod kontrolou</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section bg="gray">
        <SectionHeader
          eyebrow="Jak to probíhá"
          title="4 kroky a hotovo"
          subtitle="Bez změny logiky. Jen jasnější a příjemnější průchod pro nováčky."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-2 text-sm font-bold text-gold-500">{s.num}</div>
              <s.icon className="mb-4 h-8 w-8 text-navy-700" />
              <h3 className="mb-2 text-lg font-bold text-navy-900">{s.title}</h3>
              <p className="text-sm leading-relaxed text-navy-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="white">
        <SectionHeader
          eyebrow="Vyber scénář"
          title="Co právě prodáváš?"
          subtitle="Jen vizuální pomoc. Po kliknutí jdeš pořád do stejného formuláře."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-md"
            >
              <div className="mb-3 inline-flex rounded-lg bg-navy-50 p-2 text-navy-700">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-navy-900">{card.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-navy-600">{card.desc}</p>
              <Button href="/bezpecna-platba/novy" variant="outlineDark" size="sm" className="w-full">
                Použít tento scénář
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold-200 bg-gold-50 p-6 text-center">
          <h3 className="text-xl font-bold text-navy-900">Ready?</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-navy-700 sm:text-base">
            Můžeš jít rovnou do klasického formuláře. Tohle je jen lepší vstupní stránka.
          </p>
          <div className="mt-5">
            <Button href="/bezpecna-platba/novy" variant="primary" size="lg">
              Pokračovat do formuláře <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
