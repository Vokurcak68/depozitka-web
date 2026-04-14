"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";

const ENGINE_BASE = process.env.NEXT_PUBLIC_ENGINE_BASE || "https://engine.depozitka.eu";

type DealDto = {
  id: string;
  status: string;
  rejectionReason?: string | null;
  initiatorRole: "buyer" | "seller";
  initiatorEmail: string;
  initiatorName: string | null;
  counterpartyEmail: string;
  counterpartyName: string | null;
  title: string;
  description: string | null;
  totalAmountCzk: number;
  deliveryMethod: "personal" | "carrier" | null;
  shippingTerms: "buyer_pays" | "seller_pays" | "included" | "split" | "other" | null;
  shippingCarrier: string | null;
  shippingNote: string | null;
  estimatedShipDate: string | null;
  termsAcceptedAt: string | null;
  termsVersion: string | null;
  externalUrl: string | null;
  externalImageStoragePath?: string | null;
  expiresAt: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
};

type AttachmentDto = {
  id: string;
  file_name: string;
  content_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
};

type GetDealResponse =
  | { ok: true; deal: DealDto; attachments: AttachmentDto[] }
  | { ok: false; error: string };

type SimpleOk = { ok: true } | { ok: false; error: string };

type AcceptResponse =
  | { ok: true; transactionId: string; transactionCode: string }
  | { ok: false; error: string };

export default function DealV2Page() {
  const params = useParams();
  const search = useSearchParams();

  const id = String((params as any)?.id || "");
  const viewToken = String(search?.get("t") || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [deal, setDeal] = useState<DealDto | null>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const isFinalState = useMemo(() => {
    const s = String(deal?.status || "").toLowerCase();
    return ["accepted", "rejected", "expired", "cancelled", "superseded"].includes(s);
  }, [deal?.status]);

  const statusLabel = useMemo(() => {
    const s = String(deal?.status || "").toLowerCase();
    switch (s) {
      case "sent":
        return "Odesláno";
      case "draft":
        return "Koncept";
      case "accepted":
        return "Schváleno";
      case "rejected":
        return "Zamítnuto";
      case "expired":
        return "Vypršelo";
      case "cancelled":
        return "Zrušeno";
      case "superseded":
        return "Nahrazeno";
      default:
        return deal?.status || "";
    }
  }, [deal?.status]);

  const [attachments, setAttachments] = useState<AttachmentDto[]>([]);
  // Upload on deal page disabled by design: attachments are added only during deal creation.
  // This prevents changing the deal "under the counterparty's hands".
  const [uploading] = useState(false);
  const [uploadError] = useState<string>("");

  const [busy, setBusy] = useState(false);
  const [doneMsg, setDoneMsg] = useState<string>("");
  const topRef = useRef<HTMLDivElement | null>(null);

  const canOtp = useMemo(() => !!id && !!viewToken && !busy && !isFinalState, [id, viewToken, busy, isFinalState]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/deals/get?dealId=${encodeURIComponent(id)}&viewToken=${encodeURIComponent(viewToken)}`,
      );
      const json = (await res.json()) as GetDealResponse;
      if (!res.ok || !json.ok) {
        setError((json as any)?.error || "Nabídku se nepodařilo načíst");
        return;
      }
      setDeal(json.deal);
      setAttachments(json.attachments || []);
    } catch (e: any) {
      setError(e?.message || "Interní chyba");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id || !viewToken) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, viewToken]);

  async function sendOtp() {
    setBusy(true);
    setError("");
    setDoneMsg("");
    try {
      const res = await fetch(`/api/deals/send-otp`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dealId: id, viewToken }),
      });
      const json = (await res.json()) as SimpleOk;
      if (!res.ok || !json.ok) {
        setError((json as any)?.error || "Nepodařilo se poslat OTP");
        return;
      }
      setOtpSent(true);
    } catch (e: any) {
      setError(e?.message || "Interní chyba");
    } finally {
      setBusy(false);
    }
  }

  async function openAttachment(storagePath: string) {
    // Popup blockers: open the window synchronously on user click
    let w: Window | null = null;
    try {
      w = window.open("about:blank");
    } catch {
      w = null;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/deals/file-url`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dealId: id, viewToken, storagePath }),
      });
      const json = (await res.json()) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!res.ok || !json?.ok || !json?.signedUrl) {
        if (w) w.close();
        setError(json?.error || "Nepodařilo se otevřít soubor");
        return;
      }

      if (w) w.location.href = json.signedUrl;
      else window.location.href = json.signedUrl;
    } catch (e: any) {
      if (w) w.close();
      setError(e?.message || "Interní chyba");
    } finally {
      setBusy(false);
    }
  }

  // Upload on deal page disabled by design (attachments only during create flow).

  async function acceptReject(kind: "accept" | "reject") {
    setBusy(true);
    setError("");
    setDoneMsg("");

    try {
      const endpoint = kind === "accept" ? "accept" : "reject";
      const payload: any = { dealId: id, viewToken, otp };
      if (kind === "reject") payload.reason = rejectReason.trim();

      const res = await fetch(`/api/deals/${endpoint}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as AcceptResponse | SimpleOk;
      if (!res.ok || !("ok" in json) || !(json as any).ok) {
        setError((json as any)?.error || "Nepodařilo se uložit odpověď");
        return;
      }

      if (kind === "accept" && "transactionCode" in json) {
        setDoneMsg(`Potvrzeno. Transakce: ${(json as any).transactionCode}`);
      } else {
        setDoneMsg(kind === "accept" ? "Potvrzeno." : "Odmítnuto.");
      }

      await load();
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e: any) {
      setError(e?.message || "Interní chyba");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section bg="white">
      <SectionHeader
        eyebrow="Bezpečná platba"
        title="Nabídka"
        subtitle="K potvrzení/odmítnutí je potřeba OTP kód."
      />

      {!viewToken && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Chybí token v URL (parametr <b>t</b>).
        </div>
      )}

      {loading && <div className="text-navy-700">Načítám…</div>}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {deal && (
        <div ref={topRef} className="mt-6 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
            <div className="text-sm text-navy-600">
              Stav: <span className="font-semibold text-navy-900">{statusLabel}</span>
            </div>
            <div className="mt-2 text-xl font-bold text-navy-900">{deal.title}</div>
            {deal.description && (
              <div className="mt-2 text-sm text-navy-700 whitespace-pre-wrap">{deal.description}</div>
            )}

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="text-navy-700">
                <span className="text-navy-500">Cena:</span>{" "}
                <span className="font-semibold">{deal.totalAmountCzk.toLocaleString("cs-CZ")} Kč</span>
              </div>
              <div className="text-navy-700">
                <span className="text-navy-500">Iniciátor:</span>{" "}
                <span className="font-semibold">
                  {deal.initiatorName ? `${deal.initiatorName} (${deal.initiatorEmail})` : deal.initiatorEmail}
                </span>{" "}
                ({deal.initiatorRole})
              </div>
              <div className="text-navy-700">
                <span className="text-navy-500">Protistrana:</span>{" "}
                <span className="font-semibold">
                  {deal.counterpartyName ? `${deal.counterpartyName} (${deal.counterpartyEmail})` : deal.counterpartyEmail}
                </span>
              </div>
              <div className="text-navy-700">
                <span className="text-navy-500">Platí do:</span>{" "}
                <span className="font-semibold">{new Date(deal.expiresAt).toLocaleString("cs-CZ")}</span>
              </div>
              {deal.deliveryMethod && (
                <div className="text-navy-700">
                  <span className="text-navy-500">Předání:</span>{" "}
                  <span className="font-semibold">{deal.deliveryMethod === "personal" ? "Osobně" : "Dopravce"}</span>
                </div>
              )}
              {deal.shippingTerms && (
                <div className="text-navy-700">
                  <span className="text-navy-500">Doprava:</span>{" "}
                  <span className="font-semibold">
                    {deal.shippingTerms === "buyer_pays"
                      ? "Platí kupující"
                      : deal.shippingTerms === "seller_pays"
                        ? "Platí prodávající"
                        : deal.shippingTerms === "included"
                          ? "V ceně"
                          : deal.shippingTerms === "split"
                            ? "Dělíme se"
                            : "Jinak/domluvou"}
                  </span>
                </div>
              )}
              {deal.shippingCarrier && (
                <div className="text-navy-700">
                  <span className="text-navy-500">Dopravce:</span>{" "}
                  <span className="font-semibold">{deal.shippingCarrier}</span>
                </div>
              )}
              {deal.estimatedShipDate && (
                <div className="text-navy-700">
                  <span className="text-navy-500">Odhad odeslání:</span>{" "}
                  <span className="font-semibold">{deal.estimatedShipDate}</span>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-navy-100 bg-white p-4">
              <div className="text-sm font-semibold text-navy-900">Podklady</div>

              {deal.externalUrl ? (
                <div className="mt-2 text-sm">
                  <a className="text-blue-600 underline" href={deal.externalUrl} target="_blank" rel="noreferrer">
                    Odkaz na inzerát
                  </a>
                </div>
              ) : (
                <div className="mt-2 text-xs text-navy-500">Odkaz na inzerát nebyl přiložen.</div>
              )}

              {attachments.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {attachments.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className="block w-full text-left text-sm text-blue-700 underline"
                      onClick={() => openAttachment(a.storage_path)}
                    >
                      {a.file_name} ({Math.round(a.file_size / 1024)} kB)
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-xs text-navy-500">Zatím bez příloh.</div>
              )}

              <div className="mt-4">
                <div className="text-sm font-semibold text-navy-900">Nahrát fotky / PDF</div>
                <div className="mt-2 text-xs text-navy-500">
                  Přidávání příloh na stránce nabídky je vypnuté. Přílohy se přidávají jen při vytváření nabídky, aby se
                  nabídka nedala měnit „pod rukama“ protistrany.
                </div>
              </div>
            </div>
          </div>

          {!otpSent && !isFinalState && (
            <div className="mt-6">
              <Button onClick={sendOtp} variant="primary" disabled={!canOtp}>
                Poslat ověřovací kód (OTP)
              </Button>
              <div className="mt-2 text-xs text-navy-500">OTP Vám pošleme na e-mail.</div>
            </div>
          )}

          {otpSent && !isFinalState && (
            <div className="mt-6 rounded-2xl border border-navy-100 bg-navy-50 p-5">
              <div className="text-sm font-semibold text-navy-900">Zadej OTP</div>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full sm:w-40 rounded-lg border border-navy-200 px-3 py-2"
                  placeholder="123456"
                  inputMode="numeric"
                />
                <Button
                  onClick={() => acceptReject("accept")}
                  variant="primary"
                  className="w-full sm:w-auto sm:min-w-[140px]"
                  disabled={busy || otp.trim().length < 4}
                >
                  Souhlasím
                </Button>
              </div>

              <div className="mt-3">
                <div className="text-xs font-semibold text-navy-900">Důvod zamítnutí (povinné)</div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                  placeholder="Např. nesouhlasím s cenou / chybí fotky / špatný popis / doprava apod."
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={() => acceptReject("reject")}
                    variant="outlineDark"
                    className="w-full sm:w-auto sm:min-w-[140px]"
                    disabled={busy || otp.trim().length < 4 || rejectReason.trim().length < 3}
                  >
                    Nesouhlasím
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-xs text-navy-500">
                Kód je jednorázový. Když ti to hlásí chybu, pošli OTP znovu.
              </div>
            </div>
          )}

          {isFinalState && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="text-sm font-semibold text-emerald-900">
                Nabídka je uzavřená: {statusLabel}
              </div>
              {String(deal.status).toLowerCase() === "rejected" && deal.rejectionReason && (
                <div className="mt-2 text-xs text-emerald-900/80 whitespace-pre-wrap">
                  <span className="font-semibold">Důvod:</span> {deal.rejectionReason}
                </div>
              )}
              <div className="mt-1 text-xs text-emerald-900/80">
                Už nejde posílat OTP ani měnit odpověď. Pokud potřebuješ nový návrh, iniciátor musí vytvořit novou nabídku.
              </div>
            </div>
          )}

          {doneMsg && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {doneMsg}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
