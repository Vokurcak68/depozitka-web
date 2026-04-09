import type { Metadata } from "next";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import {
  Code,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
  Package,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Pro provozovatele marketplace",
  description:
    "Depozitka pro bazary, marketplace a platformy. REST API, webhooky, sandbox. Integrace za pár hodin, bez PSD2 licence a vlastního účetnictví.",
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Vyšší důvěra uživatelů",
    desc: "Bezpečná platba = víc dokončených obchodů. Kupující se nebojí poslat peníze neznámému prodejci.",
  },
  {
    icon: Users,
    title: "Méně podvodů a sporů",
    desc: "Automatické párování, tracking přepravců a audit log eliminují většinu problémových transakcí.",
  },
  {
    icon: Code,
    title: "Snadná integrace",
    desc: "REST API, webhooky, kompletní dokumentace. Funkční MVP za jedno odpoledne, full integrace do týdne.",
  },
  {
    icon: Package,
    title: "Bez licencí a účetnictví",
    desc: "Nemusíte řešit PSD2, AML ani vlastní escrow účet. Všechno za vás udělá Depozitka.",
  },
];

const apiExample = `POST https://api.depozitka.eu/v1/transactions
Authorization: Bearer sk_live_xxxxxxxxxxxxxxxx
Content-Type: application/json

{
  "buyer": {
    "email": "jan@example.cz",
    "name": "Jan Novák",
    "phone": "+420 777 123 456"
  },
  "seller": {
    "account": "123456789/0100",
    "name": "Petr Prodejce",
    "email": "petr@example.cz"
  },
  "amount": 2500,
  "currency": "CZK",
  "description": "Model lokomotivy TT BR 132",
  "listing_url": "https://vasbazar.cz/inzerat/12345",
  "webhook_url": "https://vasbazar.cz/api/depozitka/webhook"
}`;

const responseExample = `HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "dpt_2026_04A9B3",
  "status": "awaiting_payment",
  "payment": {
    "account": "2900000710/2010",
    "vs": "DPTA9B3",
    "amount": 2500,
    "qr_code_url": "https://api.depozitka.eu/qr/dpt_2026_04A9B3.png"
  },
  "expires_at": "2026-04-10T17:11:00Z",
  "created_at": "2026-04-09T17:11:00Z"
}`;

const webhookEvents = [
  { event: "transaction.created", desc: "Transakce vytvořena" },
  { event: "transaction.paid", desc: "Platba přijata do úschovy" },
  { event: "transaction.shipped", desc: "Prodávající zadal tracking" },
  { event: "transaction.delivered", desc: "Přepravce potvrdil doručení" },
  { event: "transaction.completed", desc: "Kupující potvrdil, výplata" },
  { event: "transaction.disputed", desc: "Otevřen spor" },
  { event: "transaction.refunded", desc: "Peníze vráceny kupujícímu" },
  { event: "transaction.expired", desc: "Nezaplaceno včas, storno" },
];

export default function ProProvozovatelePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              Pro marketplace a bazary
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Bezpečná platba<br />
              <span className="text-gold-400">na pár řádků kódu</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-100 leading-relaxed mb-10">
              Přidejte do svého bazaru nebo platformy escrow systém, aniž
              byste museli zakládat vlastní účetnictví, řešit AML nebo
              PSD2 licence. Depozitka se postará o zbytek.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="#api" variant="primary" size="lg">
                <Code className="h-5 w-5" />
                API dokumentace
              </Button>
              <Button href="/kontakt" variant="outline" size="lg">
                Domluvit schůzku
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <Section bg="white">
        <SectionHeader
          eyebrow="Proč integrovat"
          title="Co z toho máte vy jako provozovatel"
          subtitle="Depozitka není další platební brána. Řešíme specifický problém online tržišť — důvěru mezi neznámými stranami."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-navy-50 rounded-2xl p-8 border border-navy-100"
            >
              <div className="h-12 w-12 rounded-xl bg-gold-400 flex items-center justify-center mb-5">
                <b.icon className="h-7 w-7 text-navy-900" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                {b.title}
              </h3>
              <p className="text-navy-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* API SECTION */}
      <Section bg="gray" id="api">
        <SectionHeader
          eyebrow="REST API"
          title="Integrace za odpoledne"
          subtitle="Jednoduché HTTP endpointy, JSON payloady, standardní autentizace přes Bearer token. Sandbox zdarma, produkce po podpisu smlouvy."
        />

        {/* Request */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 rounded bg-gold-400 text-navy-900 text-xs font-bold">
                POST
              </span>
              <span className="font-mono text-sm text-navy-700">
                /v1/transactions
              </span>
              <span className="text-xs text-navy-500 ml-2">
                Vytvoření nové transakce
              </span>
            </div>
            <pre className="bg-navy-900 text-navy-100 p-6 rounded-2xl overflow-x-auto text-sm leading-relaxed">
              <code>{apiExample}</code>
            </pre>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 rounded bg-green-500 text-white text-xs font-bold">
                201
              </span>
              <span className="font-mono text-sm text-navy-700">
                Odpověď serveru
              </span>
            </div>
            <pre className="bg-navy-900 text-navy-100 p-6 rounded-2xl overflow-x-auto text-sm leading-relaxed">
              <code>{responseExample}</code>
            </pre>
          </div>
        </div>
      </Section>

      {/* WEBHOOKS */}
      <Section bg="white">
        <SectionHeader
          eyebrow="Webhooky"
          title="Real-time události"
          subtitle="O každé změně stavu transakce se dozvíte okamžitě. HMAC-SHA256 podpis, automatický retry 3× při selhání."
        />
        <div className="max-w-3xl mx-auto">
          <div className="bg-navy-50 rounded-2xl p-6 border border-navy-100">
            <ul className="divide-y divide-navy-200">
              {webhookEvents.map((evt) => (
                <li
                  key={evt.event}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <code className="font-mono text-sm font-semibold text-navy-900">
                    {evt.event}
                  </code>
                  <span className="text-sm text-navy-600">{evt.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ONBOARDING */}
      <Section bg="gray">
        <SectionHeader
          eyebrow="Jak začít"
          title="Od prvního kontaktu k ostrému provozu"
          subtitle="Proces integrace je jednoduchý a rychlý — typicky do 7 pracovních dnů."
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              num: "1",
              title: "Konzultace",
              desc: "Zjistíme vaše potřeby, objem transakcí a specifika platformy.",
            },
            {
              num: "2",
              title: "Sandbox",
              desc: "Dostanete testovací API klíče a můžete začít integrovat.",
            },
            {
              num: "3",
              title: "Smlouva",
              desc: "Podepíšeme rámcovou smlouvu s individuálními podmínkami.",
            },
            {
              num: "4",
              title: "Produkce",
              desc: "Přepneme vás na ostré API a jdete live.",
            },
          ].map((s) => (
            <div
              key={s.num}
              className="bg-white rounded-2xl p-6 border border-navy-100 relative"
            >
              <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-gold-400 text-navy-900 font-bold flex items-center justify-center text-sm">
                {s.num}
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2 mt-2">
                {s.title}
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section bg="navy">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-gold-300 mb-6">
            <Sparkles className="h-4 w-4" />
            Pro první integrátory individuální podmínky
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pojďme se bavit o vaší platformě
          </h2>
          <p className="text-lg text-navy-100 mb-8">
            Napište nám pár řádků o vašem projektu. Odpovíme s návrhem
            integrace a orientačními podmínkami do 24 hodin.
          </p>
          <Button href="/kontakt" variant="primary" size="lg">
            Napsat nám <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </Section>
    </>
  );
}
