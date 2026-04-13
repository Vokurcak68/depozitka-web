"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";

const ENGINE_BASE = process.env.NEXT_PUBLIC_ENGINE_BASE || "https://engine.depozitka.eu";

type DealState = {
  status: string;
  subject: string;
  amountCzk: number;
  shippingCarrier: string;
  initiatorRole: "buyer" | "seller";
  initiatorName: string;
  counterpartyEmail: string;
  versionNo: number;
};

type GetDealResponse =
  | { ok: true; deal: DealState }
  | { ok: false; error: string };

type OtpStartResponse =
  | { ok: true }
  | { ok: false; error: string };

type OtpVerifyResponse =
  | { ok: true }
  | { ok: false; error: string };

type RespondResponse =
  | { ok: true; next?: { type: "tx"; transactionCode: string } }
  | { ok: false; error: string };

export default function DealDetailPage() {
  const params = useParams();
  const token = String((params as any)?.token || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [deal, setDeal] = useState<DealState | null>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [busy, setBusy] = useState(false);
  const [doneMsg, setDoneMsg] = useState<string>("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${ENGINE_BASE}/api/direct-deals/get?token=${encodeURIComponent(token)}`);
      const json = (await res.json()) as GetDealResponse;
      if (!res.ok || !json.ok) {
        setError((json as any)?.error || "Nabídku se nepodařilo načíst");
        return;
      }
      setDeal(json.deal);
    } catch (e: any) {
      setError(e?.message || "Interní chyba");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function startOtp() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${ENGINE_BASE}/api/direct-deals/otp/start`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = (await res.json()) as OtpStartResponse;
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

  async function verifyOtp() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${ENGINE_BASE}/api/direct-deals/otp/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, otp }),
      });
      const json = (await res.json()) as OtpVerifyResponse;
      if (!res.ok || !json.ok) {
        setError((json as any)?.error || "OTP nesedí");
        return;
      }
      setOtpVerified(true);
    } catch (e: any) {
      setError(e?.message || "Interní chyba");
    } finally {
      setBusy(false);
    }
  }

  async function respond(accept: boolean) {
    setBusy(true);
    setError("");
    setDoneMsg("");
    try {
      const res = await fetch(`${ENGINE_BASE}/api/direct-deals/respond`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, accept }),
      });
      const json = (await res.json()) as RespondResponse;
      if (!res.ok || !json.ok) {
        setError((json as any)?.error || "Nepodařilo se uložit odpověď");
        return;
      }

      setDoneMsg(accept ? "Potvrzeno. Díky!" : "Odmítnuto. Díky za info.");
      await load();
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
        subtitle="Protistrana může nabídku jen potvrdit / odmítnout."
      />

      {loading && <div className="text-navy-700">Načítám…</div>}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {deal && (
        <div className="mt-6 max-w-2xl">
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
            <div className="text-sm text-navy-600">Stav: <span className="font-semibold text-navy-900">{deal.status}</span></div>
            <div className="mt-2 text-xl font-bold text-navy-900">{deal.subject}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="text-navy-700"><span className="text-navy-500">Cena:</span> <span className="font-semibold">{deal.amountCzk.toLocaleString("cs-CZ")} Kč</span> (vč. dopravy)</div>
              <div className="text-navy-700"><span className="text-navy-500">Dopravce:</span> <span className="font-semibold">{deal.shippingCarrier}</span></div>
              <div className="text-navy-700"><span className="text-navy-500">Iniciátor:</span> <span className="font-semibold">{deal.initiatorName}</span> ({deal.initiatorRole})</div>
              <div className="text-navy-700"><span className="text-navy-500">Verze:</span> <span className="font-semibold">{deal.versionNo}</span></div>
            </div>
          </div>

          {!otpSent && (
            <div className="mt-6">
              <Button onClick={startOtp} variant="primary" disabled={busy}>
                Poslat ověřovací kód (OTP)
              </Button>
              <div className="mt-2 text-xs text-navy-500">
                Ověřovací kód pošleme na email protistrany.
              </div>
            </div>
          )}

          {otpSent && !otpVerified && (
            <div className="mt-6 rounded-2xl border border-navy-100 bg-navy-50 p-5">
              <div className="text-sm font-semibold text-navy-900">Zadej OTP</div>
              <div className="mt-3 flex gap-3">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-40 rounded-lg border border-navy-200 px-3 py-2"
                  placeholder="123456"
                  inputMode="numeric"
                />
                <Button onClick={verifyOtp} variant="secondary" disabled={busy || otp.trim().length < 4}>
                  Ověřit
                </Button>
              </div>
            </div>
          )}

          {otpVerified && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={() => respond(true)} variant="primary" disabled={busy}>
                Souhlasím
              </Button>
              <Button onClick={() => respond(false)} variant="outlineDark" disabled={busy}>
                Nesouhlasím
              </Button>
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
