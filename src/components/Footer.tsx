import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy-700 text-navy-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 relative bg-white rounded p-1">
                <Image
                  src="/brand/logo.jpg"
                  alt="Depozitka"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-xl font-bold text-white">Depozitka</span>
            </div>
            <p className="text-sm text-navy-200 leading-relaxed">
              Bezpečná platba pro každý online obchod. Peníze držíme my, dokud
              nedostaneš zboží.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Produkt</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jak-to-funguje" className="hover:text-gold-400 transition-colors">
                  Jak to funguje
                </Link>
              </li>
              <li>
                <Link href="/cenik" className="hover:text-gold-400 transition-colors">
                  Ceník
                </Link>
              </li>
              <li>
                <Link href="/bezpecnost" className="hover:text-gold-400 transition-colors">
                  Bezpečnost
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Pro firmy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pro-provozovatele" className="hover:text-gold-400 transition-colors">
                  Integrace do bazaru
                </Link>
              </li>
              <li>
                <Link href="/pro-provozovatele#api" className="hover:text-gold-400 transition-colors">
                  API dokumentace
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-gold-400 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Právní</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/obchodni-podminky" className="hover:text-gold-400 transition-colors">
                  Obchodní podmínky
                </Link>
              </li>
              <li>
                <Link href="/ochrana-udaju" className="hover:text-gold-400 transition-colors">
                  Ochrana údajů
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@depozitka.eu"
                  className="hover:text-gold-400 transition-colors"
                >
                  info@depozitka.eu
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-navy-300">
            © {new Date().getFullYear()} Depozitka. Všechna práva vyhrazena.
          </p>
          <div className="flex items-center gap-2 text-xs text-navy-300">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span>Escrow účet ve FIO bance · Česká republika</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
