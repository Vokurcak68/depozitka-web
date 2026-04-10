import type { Metadata } from "next";
import Link from "next/link";
import Section, { SectionHeader } from "@/components/Section";
import { Clock, ShieldCheck, Code, Users } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktujte tým Depozitky. Odpovídáme do 24 hodin v pracovní dny. Podpora, obchod, technická integrace i právní dotazy.",
};

const departments = [
  {
    icon: Users,
    title: "Obecná podpora",
    email: "info@depozitka.eu",
    desc: "Otázky k používání služby, transakcím, platbám nebo cokoli dalšího, co vás zajímá.",
  },
  {
    icon: Code,
    title: "Technická integrace",
    email: "api@depozitka.eu",
    desc: "API, webhooky, SDK, sandbox přístup a vše ohledně implementace do vašeho marketplace.",
  },
  {
    icon: ShieldCheck,
    title: "Právní a compliance",
    email: "legal@depozitka.eu",
    desc: "Smluvní podmínky, GDPR, AML, rozhodčí řízení a další právní záležitosti.",
  },
];

export default function KontaktPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              Kontakt
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Ozvěte se nám
            </h1>
            <p className="text-lg sm:text-xl text-navy-100 leading-relaxed">
              Odpovídáme do 24 hodin v pracovní dny. Vyberte si oddělení,
              které nejvíc odpovídá vaší otázce — dostanete se tak přímo
              ke správnému člověku.
            </p>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <Section bg="white">
        <SectionHeader
          eyebrow="Napište nám"
          title="Vyberte si oddělení"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {departments.map((d) => (
            <a
              key={d.title}
              href={`mailto:${d.email}`}
              className="group bg-navy-50 rounded-2xl p-8 border border-navy-100 hover:border-gold-400 hover:shadow-md transition"
            >
              <div className="h-12 w-12 rounded-xl bg-gold-400 flex items-center justify-center mb-5">
                <d.icon className="h-7 w-7 text-navy-900" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                {d.title}
              </h3>
              <p className="text-navy-600 leading-relaxed mb-4 text-sm">
                {d.desc}
              </p>
              <span className="font-mono text-sm font-semibold text-navy-900 group-hover:text-gold-600 transition">
                {d.email} →
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* COMPANY INFO */}
      <Section bg="gray">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            eyebrow="Údaje o společnosti"
            title="Kdo za Depozitkou stojí"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-navy-100">
              <h3 className="font-bold text-navy-900 mb-4">
                Fakturační údaje
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-navy-500 mb-1">Název</dt>
                  <dd className="text-navy-900 font-medium">
                    NetMate CZ spol. s r.o.
                  </dd>
                </div>
                <div>
                  <dt className="text-navy-500 mb-1">Sídlo</dt>
                  <dd className="text-navy-900 font-medium">
                    Rybná 716/24, Staré Město, 110 00 Praha 1
                  </dd>
                </div>
                <div>
                  <dt className="text-navy-500 mb-1">IČ / DIČ</dt>
                  <dd className="text-navy-900 font-medium">
                    IČO 08034966 / DIČ CZ08034966
                  </dd>
                </div>
                <div>
                  <dt className="text-navy-500 mb-1">Spisová značka</dt>
                  <dd className="text-navy-900 font-medium">
                    C 311906, Městský soud v Praze
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-navy-100">
              <h3 className="font-bold text-navy-900 mb-4">Bankovní spojení</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-navy-500 mb-1">Úschovní účet (FIO)</dt>
                  <dd className="text-navy-900 font-mono font-medium">
                    2900000710/2010
                  </dd>
                </div>
                <div>
                  <dt className="text-navy-500 mb-1">IBAN</dt>
                  <dd className="text-navy-900 font-mono font-medium text-xs">
                    CZ53 2010 0000 0029 0000 0710
                  </dd>
                </div>
                <div>
                  <dt className="text-navy-500 mb-1">SWIFT / BIC</dt>
                  <dd className="text-navy-900 font-mono font-medium">
                    FIOBCZPPXXX
                  </dd>
                </div>

              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* HOURS */}
      <Section bg="white">
        <div className="max-w-2xl mx-auto text-center">
          <Clock className="h-10 w-10 text-gold-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-navy-900 mb-3">
            Provozní doba podpory
          </h2>
          <p className="text-navy-600 leading-relaxed mb-6">
            Pondělí – pátek, 9:00 – 17:00 (SEČ).<br />
            Mimo provozní hodiny odpovídáme první následující pracovní
            den.
          </p>
          <p className="text-sm text-navy-500">
            Technické incidenty a výpadky řešíme 24/7 přes automatický
            monitoring. Stav služby najdete na{" "}
            <Link
              href="/"
              className="text-navy-700 underline underline-offset-4 hover:text-gold-600"
            >
              status.depozitka.eu
            </Link>{" "}
            (připravujeme).
          </p>
        </div>
      </Section>
    </>
  );
}
