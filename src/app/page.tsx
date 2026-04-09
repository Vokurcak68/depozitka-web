import Link from "next/link";
import Image from "next/image";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import {
  ShieldCheck,
  Lock,
  Package,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Users,
  Code,
  Scale,
  Bank,
  Sparkles,
} from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Text column */}
            <div className="lg:col-span-7 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-gold-300 mb-6">
                <Sparkles className="h-4 w-4" />
Bezpečná platba pro český online trh
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Peníze držíme my,<br />
                <span className="text-gold-400">dokud nedostaneš zboží.</span>
              </h1>
              <p className="text-lg sm:text-xl text-navy-100 leading-relaxed mb-10 max-w-2xl">
                Depozitka je nezávislá úschova plateb pro bazary, marketplace
                a prodejce. Kupující platí s jistotou, prodávající s jasnými
                pravidly. Konec podvodů v online obchodování.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/jak-to-funguje" variant="primary" size="lg">
                  Jak to funguje <ArrowRight className="h-5 w-5" />
                </Button>
                <Button href="/pro-provozovatele" variant="outline" size="lg">
                  Pro provozovatele bazarů
                </Button>
              </div>
            </div>

            {/* Logo column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-64 sm:w-80 md:w-96 lg:w-full lg:max-w-lg">
                {/* soft gold glow behind logo */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -m-8 rounded-full bg-gold-400/20 blur-3xl"
                />
                <Image
                  src="/brand/logo-transparent.png"
                  alt="Depozitka logo"
                  width={1440}
                  height={1440}
                  priority
                  className="relative w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <Section bg="white">
        <SectionHeader
          eyebrow="Proč Depozitka"
          title="Tři strany, jeden bezpečný obchod"
          subtitle="Transparentní systém úschovy plateb, který chrání kupujícího, prodávajícího i provozovatele marketplace."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-navy-50 rounded-2xl p-8 border border-navy-100">
            <div className="h-12 w-12 rounded-xl bg-gold-400 flex items-center justify-center mb-5">
              <ShieldCheck className="h-7 w-7 text-navy-900" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">
              Pro kupující
            </h3>
            <p className="text-navy-600 leading-relaxed">
              Zaplatíš jen jednou. Peníze jdou do úschovy, ne přímo
              prodávajícímu. Neodešle zboží? Dostaneš vše zpět.
            </p>
          </div>

          <div className="bg-navy-50 rounded-2xl p-8 border border-navy-100">
            <div className="h-12 w-12 rounded-xl bg-gold-400 flex items-center justify-center mb-5">
              <Package className="h-7 w-7 text-navy-900" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">
              Pro prodávající
            </h3>
            <p className="text-navy-600 leading-relaxed">
              Jasná pravidla, garantovaná výplata po doručení. Žádné
              chargebacky, žádné dohady. Peníze máš do 2 pracovních dnů.
            </p>
          </div>

          <div className="bg-navy-50 rounded-2xl p-8 border border-navy-100">
            <div className="h-12 w-12 rounded-xl bg-gold-400 flex items-center justify-center mb-5">
              <Users className="h-7 w-7 text-navy-900" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">
              Pro marketplace
            </h3>
            <p className="text-navy-600 leading-relaxed">
              Zvyš důvěru ve svou platformu. API integrace za pár hodin,
              minimum změn ve vašem systému, maximum spokojených uživatelů.
            </p>
          </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section bg="gray">
        <SectionHeader
          eyebrow="Proces"
          title="Čtyři kroky k bezpečnému nákupu"
          subtitle="Od platby až po výplatu — vše transparentní, vše logované, vše v souladu s českým právem."
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              icon: CreditCard,
              title: "Kupující zaplatí",
              desc: "Bankovním převodem s variabilním symbolem. Peníze přijdou na náš úschovní účet.",
            },
            {
              num: "02",
              icon: Package,
              title: "Prodávající odešle",
              desc: "Až po potvrzení přijaté platby. Do systému nahraje tracking zásilky.",
            },
            {
              num: "03",
              icon: CheckCircle,
              title: "Kupující potvrdí",
              desc: "Převzetí zboží a jeho stav. Systém také automaticky hlídá doručení.",
            },
            {
              num: "04",
              icon: Bank,
              title: "Výplata prodávajícímu",
              desc: "Po potvrzení nebo automaticky po lhůtě. Minus transparentní provize.",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100"
            >
              <div className="text-sm font-bold text-gold-500 mb-2">
                {step.num}
              </div>
              <step.icon className="h-8 w-8 text-navy-700 mb-4" />
              <h3 className="text-lg font-bold text-navy-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/jak-to-funguje" variant="secondary">
            Podrobný popis procesu <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Section>

      {/* TRUST BAR */}
      <Section bg="white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
              <Lock className="h-6 w-6 text-navy-700" />
            </div>
            <div>
              <h4 className="font-bold text-navy-900 mb-1">Šifrovaná komunikace</h4>
              <p className="text-sm text-navy-600">
                TLS 1.3, HMAC-SHA256 podpis webhooků a pravidelné bezpečnostní audity.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-navy-700" />
            </div>
            <div>
              <h4 className="font-bold text-navy-900 mb-1">GDPR &amp; audit log</h4>
              <p className="text-sm text-navy-600">
                Každá akce je zalogována. Transakce dohledatelné 10 let dozadu.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
              <Scale className="h-6 w-6 text-navy-700" />
            </div>
            <div>
              <h4 className="font-bold text-navy-900 mb-1">Řešení sporů</h4>
              <p className="text-sm text-navy-600">
                Nezávislý arbitrážní proces s jasnými lhůtami a pravidly.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FOR OPERATORS CTA */}
      <Section bg="navy">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              Pro provozovatele marketplace
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">
              Integrujte Depozitku do svého bazaru
            </h2>
            <p className="text-lg text-navy-100 leading-relaxed mb-8">
              REST API, webhooky, automatické párování plateb a integrace
              s přepravci. Vše, co potřebujete, abyste svým uživatelům
              nabídli bezpečnou platbu, aniž byste museli řešit účetnictví
              nebo licence PSD2.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/pro-provozovatele" variant="primary" size="md">
                <Code className="h-5 w-5" />
                Technická integrace
              </Button>
              <Button href="/kontakt" variant="outline" size="md">
                Domluvit schůzku
              </Button>
            </div>
          </div>
          <div className="bg-navy-900/50 rounded-2xl p-6 border border-white/10 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-gold-400/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-navy-200">
                POST /api/v1/transactions
              </span>
            </div>
            <pre className="text-navy-100 leading-relaxed overflow-x-auto">
              <code>{`{
  "buyer": { "email": "jan@example.cz" },
  "seller": { "account": "123456/0100" },
  "amount": 2500,
  "currency": "CZK",
  "description": "Model lokomotivy H0"
}`}</code>
            </pre>
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section bg="gold">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
            Máte otázku nebo chcete začít?
          </h2>
          <p className="text-lg text-navy-700 mb-8">
            Ozvěte se — odpovídáme do 24 hodin v pracovní dny.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/kontakt" variant="secondary" size="lg">
              Napsat nám
            </Button>
            <Button href="/faq" variant="ghost" size="lg">
              Časté otázky
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
