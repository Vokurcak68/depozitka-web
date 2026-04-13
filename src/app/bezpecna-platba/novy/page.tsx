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
  void initiatorName; // V2: can be used for nicer emails / display
  const [initiatorEmail, setInitiatorEmail] = useState<string>("");

  const [counterpartyName, setCounterpartyName] = useState<string>("");
  void counterpartyName; // V2: optional
  const [counterpartyEmail, setCounterpartyEmail] = useState<string>("");

  const [amountCzk, setAmountCzk] = useState<string>("");
  const [shippingCarrier, setShippingCarrier] = useState<string>("Zásilkovna");
  void shippingCarrier; // V2: will be stored in deal metadata

  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");

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
      shippingCarrier.trim().length > 0
    );
  }, [
    turnstileToken,
    initiatorName,
    initiatorEmail,
    counterpartyEmail,
    subject,
    amountCzk,
    shippingCarrier,
  ]);

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
          counterpartyEmail,
          title: subject,
          description: message,
          totalAmountCzk: Number(amountCzk),
          // TODO (V2): phone, externalUrl/snapshot, attachments snapshot
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

          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Jméno protistrany (volitelné)</div>
            <input
              value={counterpartyName}
              onChange={(e) => setCounterpartyName(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="Petr Svoboda"
            />
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Email protistrany</div>
            <input
              value={counterpartyEmail}
              onChange={(e) => setCounterpartyEmail(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="petr@domena.cz"
            />
          </label>

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
          <div className="text-sm font-semibold text-navy-800 mb-2">Ověření (anti-spam)</div>
          <TurnstileWidget
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
            action="direct_deal_create"
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
