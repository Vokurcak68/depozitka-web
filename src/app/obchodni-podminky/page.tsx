import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "Obchodní podmínky",
  description:
    "Všeobecné obchodní podmínky služby Depozitka — pravidla používání escrow služby, práva a povinnosti účastníků transakcí.",
};

export default function ObchodniPodminkyPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              Právní dokumenty
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Obchodní podmínky
            </h1>
            <p className="text-navy-200">
              Verze 1.0 · Účinnost od 1. dubna 2026
            </p>
          </div>
        </div>
      </section>

      <Section bg="white">
        <article className="max-w-3xl mx-auto prose prose-slate">
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-5 mb-8">
            <p className="text-sm text-navy-800 m-0">
              <strong>Poznámka:</strong> Toto je pracovní verze obchodních
              podmínek pro marketingové účely. Finální závazné znění bude
              zveřejněno před spuštěním ostrého provozu a bude k dispozici
              ke stažení v PDF. Dotazy směřujte na{" "}
              <a
                href="mailto:legal@depozitka.eu"
                className="text-navy-900 underline"
              >
                legal@depozitka.eu
              </a>
              .
            </p>
          </div>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            1. Základní ustanovení
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Tyto obchodní podmínky upravují poskytování služby Depozitka,
            která zajišťuje nezávislou úschovu finančních prostředků při
            nákupu a prodeji zboží mezi kupujícím a prodávajícím. Provozovatelem
            služby je společnost Depozitka s.r.o. se sídlem v Praze.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            2. Vymezení pojmů
          </h2>
          <ul className="space-y-2 text-navy-700">
            <li>
              <strong>Služba</strong> — webová aplikace a API pro správu
              escrow transakcí dostupné na doméně depozitka.eu.
            </li>
            <li>
              <strong>Kupující</strong> — osoba, která hradí kupní cenu do
              úschovy provozovatele za účelem nákupu zboží.
            </li>
            <li>
              <strong>Prodávající</strong> — osoba, která dodává zboží a
              přijímá kupní cenu z úschovy po dokončení transakce.
            </li>
            <li>
              <strong>Provozovatel</strong> — Depozitka s.r.o., právnická
              osoba zajišťující provoz Služby.
            </li>
            <li>
              <strong>Transakce</strong> — samostatný obchodní případ
              evidovaný ve Službě mezi kupujícím a prodávajícím.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            3. Průběh transakce
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Detailní popis procesu je k dispozici na stránce{" "}
            <Link
              href="/jak-to-funguje"
              className="text-navy-900 underline hover:text-gold-600"
            >
              Jak to funguje
            </Link>
            . Transakce se skládá z pěti kroků: vytvoření, platba do
            úschovy, odeslání zboží, potvrzení převzetí, výplata
            prodávajícímu.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            4. Odměna za službu
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Provozovatel má nárok na odměnu ve výši stanovené v aktuálně
            platném{" "}
            <Link
              href="/cenik"
              className="text-navy-900 underline hover:get-gold-600"
            >
              ceníku
            </Link>
            . Odměna se strhává z vyplácené částky po úspěšném dokončení
            transakce. Při neúspěšné transakci se odměna neúčtuje.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            5. Práva a povinnosti účastníků
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Kupující se zavazuje uhradit kupní cenu ve stanovené lhůtě.
            Prodávající se zavazuje odeslat zboží odpovídající popisu
            inzerátu ve stanovené lhůtě a doložit podání zásilky.
            Provozovatel se zavazuje uchovávat svěřené prostředky odděleně
            a vyplatit je oprávněné straně v souladu s pravidly služby.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            6. Řešení sporů
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Spory mezi kupujícím a prodávajícím řeší provozovatel jako
            nezávislý mediátor dle interních pravidel. Pokud se strany
            nedohodnou, rozhoduje provozovatel na základě předložených
            důkazů. Rozhodnutí provozovatele je pro účely výplaty
            prostředků závazné; právo na soudní ochranu tím není dotčeno.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            7. Ochrana osobních údajů
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Zpracování osobních údajů se řídí samostatnými zásadami
            dostupnými na stránce{" "}
            <Link
              href="/ochrana-udaju"
              className="text-navy-900 underline hover:text-gold-600"
            >
              Ochrana osobních údajů
            </Link>
            .
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            8. Závěrečná ustanovení
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Tyto obchodní podmínky se řídí právním řádem České republiky.
            Provozovatel je oprávněn podmínky měnit; o podstatných změnách
            informuje uživatele s dostatečným předstihem. Neplatnost
            některého ustanovení neovlivňuje platnost ostatních.
          </p>
        </article>
      </Section>
    </>
  );
}
