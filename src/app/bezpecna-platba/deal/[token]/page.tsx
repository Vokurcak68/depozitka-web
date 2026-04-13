"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";

const ENGINE_BASE = process.env.NEXT_PUBLIC_ENGINE_BASE || "https://engine.depozitka.eu";

// Legacy V1 page kept only as a redirect to V2.

export default function DealDetailPage() {
  const params = useParams();
  const token = String((params as any)?.token || "");

  useEffect(() => {
    if (!token) return;

    // Legacy V1 token is not compatible with V2. Keep a clear message.
    // We keep this page so old links don't 404.
  }, [token]);

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
