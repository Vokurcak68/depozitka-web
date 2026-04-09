import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description:
    "Zásady zpracování osobních údajů služby Depozitka v souladu s GDPR — jaká data zpracováváme, proč, jak dlouho a jaká máte práva.",
};

export default function OchranaUdajuPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-gold-400">
              GDPR
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Ochrana osobních údajů
            </h1>
            <p className="text-navy-200">
              Verze 1.0 · Účinnost od 1. dubna 2026
            </p>
          </div>
        </div>
      </section>

      <Section bg="white">
        <article className="max-w-3xl mx-auto">
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-5 mb-8">
            <p className="text-sm text-navy-800 m-0">
              <strong>Poznámka:</strong> Toto je pracovní verze zásad
              zpracování osobních údajů. Finální znění bude zveřejněno
              před spuštěním ostrého provozu. Dotazy a žádosti směřujte na{" "}
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
            1. Správce osobních údajů
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Správcem vašich osobních údajů je společnost Depozitka s.r.o.
            se sídlem v Praze. Kontakt pro oblast ochrany osobních údajů:{" "}
            <a
              href="mailto:legal@depozitka.eu"
              className="text-navy-900 underline hover:text-gold-600"
            >
              legal@depozitka.eu
            </a>
            .
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            2. Jaké údaje zpracováváme
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Zpracováváme pouze údaje nezbytné k provedení transakce a
            splnění zákonných povinností:
          </p>
          <ul className="space-y-2 text-navy-700 mb-4">
            <li>
              <strong>Identifikační:</strong> jméno, příjmení, datum
              narození (u vybraných transakcí)
            </li>
            <li>
              <strong>Kontaktní:</strong> email, telefon, doručovací
              adresa
            </li>
            <li>
              <strong>Platební:</strong> číslo bankovního účtu, variabilní
              symbol, historie plateb
            </li>
            <li>
              <strong>Technické:</strong> IP adresa, prohlížeč, logy
              přihlášení
            </li>
            <li>
              <strong>Transakční:</strong> popis zboží, částka, stav
              transakce, komunikace v rámci sporu
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            3. Účely zpracování
          </h2>
          <ul className="space-y-2 text-navy-700 mb-4">
            <li>
              Plnění smlouvy (provedení transakce mezi kupujícím a
              prodávajícím)
            </li>
            <li>
              Plnění zákonných povinností (účetnictví, AML, archivace)
            </li>
            <li>Řešení sporů a reklamací</li>
            <li>Bezpečnost a prevence podvodů</li>
            <li>
              Marketingová komunikace (pouze na základě vašeho souhlasu)
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            4. Právní základ zpracování
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Zpracování probíhá na základě plnění smlouvy (čl. 6 odst. 1
            písm. b GDPR), plnění právní povinnosti (čl. 6 odst. 1 písm. c
            GDPR), oprávněného zájmu (čl. 6 odst. 1 písm. f GDPR) a v
            některých případech vašeho souhlasu (čl. 6 odst. 1 písm. a
            GDPR).
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            5. Doba uchovávání
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Osobní údaje zpracováváme po dobu trvání smluvního vztahu a
            následně po dobu stanovenou právními předpisy — zpravidla 10
            let od ukončení transakce (zákon o účetnictví). Některé údaje
            (např. logy) uchováváme kratší dobu pro účely bezpečnosti.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            6. Předávání třetím stranám
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Vaše údaje můžeme předávat:
          </p>
          <ul className="space-y-2 text-navy-700 mb-4">
            <li>FIO bance za účelem zpracování plateb</li>
            <li>
              Přepravním společnostem (Česká pošta, Zásilkovna, PPL, DPD,
              GLS, Geis) pro účely sledování zásilek
            </li>
            <li>
              Účetní a daňovým poradcům (zpracovatelé na základě smlouvy)
            </li>
            <li>Orgánům veřejné moci, vyžaduje-li to zákon</li>
          </ul>
          <p className="text-navy-700 leading-relaxed mb-4">
            Údaje nepředáváme mimo EU bez vaší vědomí a bez odpovídajících
            záruk.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            7. Vaše práva
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Podle GDPR máte následující práva:
          </p>
          <ul className="space-y-2 text-navy-700 mb-4">
            <li>Právo na přístup k osobním údajům</li>
            <li>Právo na opravu nepřesných údajů</li>
            <li>
              Právo na výmaz („právo být zapomenut") — s výjimkou údajů
              nutných k plnění zákonných povinností
            </li>
            <li>Právo na omezení zpracování</li>
            <li>Právo na přenositelnost údajů</li>
            <li>Právo vznést námitku proti zpracování</li>
            <li>Právo odvolat souhlas (tam, kde je zpracování na něm založeno)</li>
            <li>
              Právo podat stížnost u Úřadu pro ochranu osobních údajů (
              <a
                href="https://www.uoou.cz"
                target="_blank"
                rel="noopener"
                className="text-navy-900 underline hover:text-gold-600"
              >
                uoou.cz
              </a>
              )
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            8. Zabezpečení
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Používáme šifrování TLS 1.3 pro přenos dat, AES-256 pro
            ukládání citlivých informací, dvoufaktorovou autentizaci pro
            administrátorské přístupy a pravidelné bezpečnostní audity.
            Více o bezpečnostních opatřeních na stránce{" "}
            <Link
              href="/bezpecnost"
              className="text-navy-900 underline hover:text-gold-600"
            >
              Bezpečnost
            </Link>
            .
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            9. Cookies
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            Na webových stránkách používáme pouze technicky nezbytné
            cookies pro správné fungování aplikace. Analytické a
            marketingové cookies používáme jen s vaším výslovným
            souhlasem.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">
            10. Kontakt
          </h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            V případě jakýchkoli dotazů nebo žádostí týkajících se
            zpracování osobních údajů nás kontaktujte na{" "}
            <a
              href="mailto:legal@depozitka.eu"
              className="text-navy-900 underline hover:text-gold-600"
            >
              legal@depozitka.eu
            </a>
            . Odpovídáme do 30 dnů.
          </p>
        </article>
      </Section>
    </>
  );
}
