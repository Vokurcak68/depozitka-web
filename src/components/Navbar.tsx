"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/jak-to-funguje", label: "Jak to funguje" },
  { href: "/cenik", label: "Ceník" },
  { href: "/pro-provozovatele", label: "Pro provozovatele" },
  { href: "/bezpecnost", label: "Bezpečnost" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar() {
  // On status subdomain we show status board as a standalone page (no global nav).
  if (typeof window !== "undefined") {
    const host = window.location.host.toLowerCase();
    if (host === "status.depozitka.eu" || host.startsWith("status.depozitka.eu:")) {
      return null;
    }
  }

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-navy-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 relative flex-shrink-0">
              <Image
                src="/brand/logo-transparent.png"
                alt="Depozitka"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-navy-700 tracking-tight">
              Depozitka
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-gold-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/kontakt"
              className="px-4 py-2 text-sm font-semibold text-navy-700 hover:text-gold-500 transition-colors"
            >
              Začít používat
            </Link>
            <Link
              href="/pro-provozovatele"
              className="px-4 py-2 text-sm font-semibold bg-gold-400 text-navy-900 rounded-lg hover:bg-gold-500 transition-colors shadow-sm"
            >
              Integrace do bazaru
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-navy-700"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="lg:hidden py-4 border-t border-navy-100">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 rounded-md"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/pro-provozovatele"
                className="mt-2 mx-3 px-4 py-2.5 text-sm font-semibold bg-gold-400 text-navy-900 rounded-lg text-center"
                onClick={() => setOpen(false)}
              >
                Integrace do bazaru
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
