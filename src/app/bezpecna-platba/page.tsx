import type { Metadata } from "next";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import { ArrowRight, ShieldCheck, Package, CheckCircle, Bank, Users } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Bezpečná platba mezi lidmi",
  description:
    "Depozitka mezi lidmi: vytvoř nabídku, protistrana ji potvrdí (OTP) a teprve potom vznikne úschova. Vždy přes dopravce.",
  alternates: {
    canonical: "/bezpecna-platba",
  },
};

export default function BezpecnaPlatbaPage() {
  return (
    <>
      <Section bg="white">
        <SectionHeader
          eyebrow="Depozitka mezi lidmi"
          title="Bezpečná platba při prodeji mezi lidmi"
          subtitle="Vytvoříš nabídku, protistrana ji potvrdí (OTP) a teprve potom vznikne úschova. Vždy s dopravcem — žádný osobní odběr, žádná hotovost."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-navy-50 rounded-2xl p-6 border border-navy-100">
            <ShieldCheck className="h-8 w-8 text-navy-700 mb-3" />
            <h3 className="text-lg font-bold text-navy-900 mb-1">Jedna částka</h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Cena je konečná včetně dopravy. Žádné doplácení „po cestě“.
            </p>
          </div>

          <div className="bg-navy-50 rounded-2xl p-6 border border-navy-100">
            <Package className="h-8 w-8 text-navy-700 mb-3" />
            <h3 className="text-lg font-bold text-navy-900 mb-1">Vždy dopravce</h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Funguje jen pro zaslání zásilky. Díky tomu umíme hlídat tracking a lhůty.
            </p>
          </div>

          <div className="bg-navy-50 rounded-2xl p-6 border border-navy-100">
            <Users className="h-8 w-8 text-navy-700 mb-3" />
            <h3 className="text-lg font-bold text-navy-900 mb-1">Protistrana nic needituje</h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              Může jen potvrdit / odmítnout. Když odmítne, pošleš upravenou nabídku znovu.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button href="/bezpecna-platba/novy" variant="primary" size="lg">
            Vytvořit nabídku <ArrowRight className="h-5 w-5" />
          </Button>
          <Button href="/jak-to-funguje" variant="outlineDark" size="lg">
            Jak funguje úschova
          </Button>
        </div>

        <div className="mt-8 text-sm text-navy-600">
          <p>
            Pozn.: Telefon je volitelný, email je povinný. Všechny kroky ti přijdou do emailu.
          </p>
        </div>
      </Section>

      <Section bg="gray">
        <SectionHeader
          eyebrow="Proces"
          title="Jak to probíhá"
          subtitle="Krátce a jasně — bez zbytečných kroků."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              title: "Vytvoříš nabídku",
              desc: "Vyplníš cenu (vč. dopravy), dopravce a emaily obou stran.",
              icon: ShieldCheck,
            },
            {
              num: "02",
              title: "OTP potvrzení",
              desc: "Protistraně pošleme kód a odkaz. Buď potvrdí, nebo odmítne.",
              icon: CheckCircle,
            },
            {
              num: "03",
              title: "Vznikne úschova",
              desc: "Teprve po potvrzení vytvoříme escrow transakci a pošleme platební údaje.",
              icon: Bank,
            },
            {
              num: "04",
              title: "Odeslání + tracking",
              desc: "Prodávající odešle zásilku, nahraje tracking a systém hlídá doručení.",
              icon: Package,
            },
          ].map((s) => (
            <div key={s.num} className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100">
              <div className="text-sm font-bold text-gold-500 mb-2">{s.num}</div>
              <s.icon className="h-8 w-8 text-navy-700 mb-4" />
              <h3 className="text-lg font-bold text-navy-900 mb-2">{s.title}</h3>
              <p className="text-sm text-navy-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

