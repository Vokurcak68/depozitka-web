"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";

// Legacy V1 page kept for backward compatibility.
// Some older emails linked to /bezpecna-platba/deal/<id>?t=<viewToken> (or without t).

export default function DealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();

  const token = String((params as any)?.token || "");
  const t = search?.get("t") || "";

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);

  useEffect(() => {
    if (!token) return;
    if (!isUuid) return;

    const next = t ? `/deal/${token}?t=${encodeURIComponent(t)}` : `/deal/${token}`;
    router.replace(next);
  }, [router, token, t, isUuid]);

  if (isUuid) {
    // Redirect is handled in useEffect; render a small fallback UI for the brief moment.
    return (
      <Section bg="white">
        <SectionHeader eyebrow="Bezpečná platba" title="Otevírám nabídku…" subtitle="Přesměrovávám na nový detail nabídky." />
      </Section>
    );
  }

  return (
    <Section bg="white">
      <SectionHeader
        eyebrow="Bezpečná platba"
        title="Odkaz už není platný"
        subtitle="Tenhle starý odkaz (V1) už nejde použít. Požádej prosím iniciátora o nový odkaz na nabídku."
      />

      <div className="mt-4 max-w-2xl rounded-2xl border border-navy-100 bg-white p-6 text-sm text-navy-800">
        Nový odkaz vypadá takhle: <b>https://depozitka.eu/deal/&lt;id&gt;?t=&lt;token&gt;</b>
      </div>

      <div className="mt-6">
        <Button href="/bezpecna-platba" variant="outlineDark">
          Zpět
        </Button>
      </div>
    </Section>
  );
}
