"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TurnstileWidget from "@/components/TurnstileWidget";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";

const ENGINE_BASE = process.env.NEXT_PUBLIC_ENGINE_BASE || "https://engine.depozitka.eu";

type CreateDealResponse =
  | { ok: true; dealId: string; viewToken: string; status: string; inviteSent?: boolean }
  | { ok: false; error: string; details?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export default function BezpecnaPlatbaNovyPage() {
  const router = useRouter();
  void router; // no-op (kept for future redirects)

  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileReset, setTurnstileReset] = useState(0);

  const [initiatorRole, setInitiatorRole] = useState<"buyer" | "seller">("buyer");
  const [initiatorName, setInitiatorName] = useState<string>("");
  const [initiatorEmail, setInitiatorEmail] = useState<string>("");

  const [counterpartyName, setCounterpartyName] = useState<string>("");
  const [counterpartyEmail, setCounterpartyEmail] = useState<string>("");

  const [amountCzk, setAmountCzk] = useState<string>("");

  const [deliveryMethod, setDeliveryMethod] = useState<"personal" | "carrier">("carrier");
  const [shippingTerms, setShippingTerms] = useState<
    "buyer_pays" | "seller_pays" | "included" | "split" | "other"
  >("buyer_pays");
  const [shippingCarrier, setShippingCarrier] = useState<string>("Zásilkovna");
  const [shippingNote, setShippingNote] = useState<string>("");
  const [estimatedShipDate, setEstimatedShipDate] = useState<string>("");

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // OG import (level 2)
  const [externalUrl, setExternalUrl] = useState<string>("");
  const [importingOg, setImportingOg] = useState(false);
  const [ogInfo, setOgInfo] = useState<{ title?: string | null; description?: string | null; imageStoragePath?: string | null } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<{ dealId: string; viewToken: string; inviteSent?: boolean } | null>(null);

  const canSubmit = useMemo(() => {
    const amt = Number(amountCzk);
    return (
      !!turnstileToken &&
      initiatorName.trim().length > 0 &&
      initiatorEmail.trim().length > 0 &&
      counterpartyEmail.trim().length > 0 &&
      subject.trim().length > 0 &&
      Number.isFinite(amt) &&
      amt > 0 &&
      !!deliveryMethod &&
      (deliveryMethod === "personal" || shippingCarrier.trim().length > 0) &&
      termsAccepted
    );
  }, [
    turnstileToken,
    initiatorName,
    initiatorEmail,
    counterpartyEmail,
    subject,
    amountCzk,
    deliveryMethod,
    shippingCarrier,
    termsAccepted,
  ]);

  async function importOg() {
    setError("");

    const url = externalUrl.trim();
    if (!url) {
      setError("Vlož odkaz.");
      return;
    }

    setImportingOg(true);
    try {
      const res = await fetch(`${ENGINE_BASE}/api/deals/import-og`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = (await res.json()) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!res.ok || !json?.ok) {
        setError(json?.error || "Nepodařilo se stáhnout info z odkazu");
        return;
      }

      const snap = json.snapshot || {};
      setOgInfo({
        title: snap.title,
        description: snap.description,
        imageStoragePath: json.imageStoragePath || null,
      });

      // Prefill only if user has not typed anything yet
      if (!subject.trim() && snap.title) setSubject(String(snap.title).slice(0, 180));
      if (!message.trim() && snap.description) setMessage(String(snap.description).slice(0, 1000));
    } catch (e: any) {
      setError(e?.message || "Interní chyba");
    } finally {
      setImportingOg(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Zkontroluj povinná pole a Turnstile.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${ENGINE_BASE}/api/deals/create`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          initiatorRole,
          initiatorEmail,
          initiatorName,
          counterpartyEmail,
          counterpartyName,
          title: subject,
          description: message,
          totalAmountCzk: Number(amountCzk),
          deliveryMethod,
          shippingTerms,
          shippingCarrier: deliveryMethod === "carrier" ? shippingCarrier : null,
          shippingNote: shippingNote || null,
          estimatedShipDate: estimatedShipDate || null,
          termsAccepted,
          termsVersion: "v1",
          externalUrl: externalUrl.trim() || null,
          externalSnapshot: ogInfo ? { og: ogInfo } : null,
          externalImageStoragePath: ogInfo?.imageStoragePath || null,
        }),
      });

      const json = (await res.json()) as CreateDealResponse;
      if (!res.ok || !json.ok) {
        const d: any = (json as any)?.details;

        const detailsText = Array.isArray(d)
          ? d.join(", ")
          : (d?.codes && Array.isArray(d.codes) && d.codes.length > 0)
            ? d.codes.join(", ")
            : d
              ? JSON.stringify(d)
              : "";

        setError(
          `${(json as any)?.error || "Nepodařilo se vytvořit nabídku"}${detailsText ? ` (${detailsText})` : ""}. Zkus prosím Turnstile ověřit znovu.`
        );
        setTurnstileToken("");
        setTurnstileReset((n) => n + 1);
        return;
      }

      // Show post-create screen for initiator (counterparty gets email link).
      setSuccess({ dealId: json.dealId, viewToken: json.viewToken, inviteSent: (json as any).inviteSent });
    } catch (err: any) {
      setError(err?.message || "Interní chyba");
      setTurnstileToken("");
      setTurnstileReset((n) => n + 1);
    } finally {
      setLoading(false);
    }
  }

  const dealLink = success
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/deal/${success.dealId}?t=${encodeURIComponent(success.viewToken)}`
    : "";

  if (success) {
    return (
      <Section bg="white">
        <SectionHeader
          eyebrow="Bezpečná platba"
          title="Pozvánka odeslaná"
          subtitle="Protistraně přijde email s odkazem. Bez OTP nabídku nepotvrdí."
        />

        <div className="max-w-2xl">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            {success.inviteSent === false
              ? "Nabídka je vytvořená, ale email se nepodařilo odeslat. Zkopíruj link a pošli ho protistraně ručně."
              : "Email s pozvánkou je odeslaný. Čekáme na potvrzení protistrany."}
          </div>

          <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-5">
            <div className="text-sm font-semibold text-navy-900">Odkaz na nabídku</div>
            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <input
                readOnly
                value={dealLink}
                className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(dealLink);
                  } catch {
                    // ignore
                  }
                }}
              >
                Zkopírovat
              </Button>
            </div>
            <div className="mt-2 text-xs text-navy-500">
              Tenhle link slouží protistraně k vyžádání OTP a potvrzení/odmítnutí.
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button href={`/deal/${success.dealId}?t=${encodeURIComponent(success.viewToken)}`} variant="outlineDark">
              Otevřít nabídku
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSuccess(null);
                setTurnstileToken("");
                setTurnstileReset((n) => n + 1);
              }}
            >
              Vytvořit další
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section bg="white">
      <SectionHeader
        eyebrow="Bezpečná platba"
        title="Vytvořit nabídku"
        subtitle="Protistrana může nabídku jen potvrdit nebo odmítnout. Když odmítne, nabídku upravíš a pošleš znovu."
      />

      <form onSubmit={onSubmit} className="max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Jsi</div>
            <select
              value={initiatorRole}
              onChange={(e) => setInitiatorRole(e.target.value as any)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
            >
              <option value="buyer">Kupující</option>
              <option value="seller">Prodávající</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Cena (Kč) — vč. dopravy</div>
            <input
              inputMode="numeric"
              value={amountCzk}
              onChange={(e) => setAmountCzk(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="např. 1250"
            />
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Tvoje jméno</div>
            <input
              value={initiatorName}
              onChange={(e) => setInitiatorName(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="Jan Novák"
            />
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Tvůj email</div>
            <input
              value={initiatorEmail}
              onChange={(e) => setInitiatorEmail(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="jan@domena.cz"
            />
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Typ předání</div>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value as any)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
            >
              <option value="personal">Osobně</option>
              <option value="carrier">Dopravce</option>
            </select>
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Doprava</div>
            <select
              value={shippingTerms}
              onChange={(e) => setShippingTerms(e.target.value as any)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
            >
              <option value="buyer_pays">Platí kupující (navíc)</option>
              <option value="seller_pays">Platí prodávající</option>
              <option value="included">Doprava je v ceně</option>
              <option value="split">Dělíme se</option>
              <option value="other">Jinak / domluvou</option>
            </select>
          </label>

          {deliveryMethod === "carrier" && (
            <label className="block sm:col-span-2">
              <div className="text-sm font-semibold text-navy-800 mb-1">Dopravce</div>
              <select
                value={shippingCarrier}
                onChange={(e) => setShippingCarrier(e.target.value)}
                className="w-full rounded-lg border border-navy-200 px-3 py-2"
              >
                <option>Zásilkovna</option>
                <option>PPL</option>
                <option>DPD</option>
                <option>GLS</option>
                <option>Česká pošta</option>
              </select>
            </label>
          )}

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Poznámka k dopravě (volitelné)</div>
            <input
              value={shippingNote}
              onChange={(e) => setShippingNote(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="např. Zásilkovna na výdejní místo / osobní předání Praha"
            />
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Odhad odeslání (volitelné)</div>
            <input
              value={estimatedShipDate}
              onChange={(e) => setEstimatedShipDate(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="YYYY-MM-DD"
            />
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Odkaz na inzerát (volitelné)</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full rounded-lg border border-navy-200 px-3 py-2"
                placeholder="https://..."
              />
              <Button type="button" variant="secondary" disabled={importingOg || !externalUrl.trim()} onClick={importOg}>
                {importingOg ? "Načítám…" : "Stáhnout popis (OG)"}
              </Button>
            </div>
            {ogInfo && (
              <div className="mt-2 text-xs text-navy-500">
                Načteno z odkazu (OG). Můžeš to upravit ručně.
              </div>
            )}
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Předmět</div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="např. Prodej modelu lokomotivy Roco"
            />
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Poznámka (volitelné)</div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 min-h-28"
              placeholder="Upřesnění k nabídce…"
            />
          </label>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold text-navy-800 mb-2">Souhlas</div>
          <label className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1"
            />
            <div className="text-sm text-navy-800">
              Souhlasím s podmínkami služby Depozitka.
              <div className="mt-1 text-xs text-navy-500">
                (MVP: link na podmínky doplníme; ukládáme čas souhlasu.)
              </div>
            </div>
          </label>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold text-navy-800 mb-2">Ověření (anti-spam)</div>
          <TurnstileWidget
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
            action="deals_create"
            onToken={setTurnstileToken}
            resetKey={turnstileReset}
          />
          {!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div className="mt-2 text-sm text-red-600">
              Chybí NEXT_PUBLIC_TURNSTILE_SITE_KEY
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button type="submit" variant="primary" disabled={loading || !canSubmit}>
            {loading ? "Odesílám…" : "Vytvořit nabídku"}
          </Button>
          <Button href="/bezpecna-platba" variant="outlineDark">
            Zpět
          </Button>
        </div>
      </form>
    </Section>
  );
}
