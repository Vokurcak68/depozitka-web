"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TurnstileWidget from "@/components/TurnstileWidget";
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";

const ENGINE_BASE = process.env.NEXT_PUBLIC_ENGINE_BASE || "https://engine.depozitka.eu";

type CreateDealResponse =
  | {
      ok: true;
      dealId: string;
      viewToken: string;
      status: "draft" | "sent";
      inviteSent?: boolean;
      attachedCount?: number;
    }
  | { ok: false; error: string; details?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

type SendInviteResponse = { ok: true } | { ok: false; error: string; details?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

type ImportedAttachment = {
  storagePath: string;
  fileName: string;
  contentType: string;
  fileSize: number;
};

type OgSnapshot = {
  url: string;
  title: string | null;
  description: string | null;
  fetchedAt: string;
  images?: string[];
};

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

  function normalizeAmountInput(v: string) {
    // Mobile keyboards often insert spaces/separators; keep digits only (CZK integer in MVP)
    return v.replace(/[^0-9]/g, "");
  }

  function parseAmountCzk(v: string) {
    const digits = normalizeAmountInput(v);
    if (!digits) return NaN;
    const n = Number(digits);
    return Number.isFinite(n) ? n : NaN;
  }

  const [deliveryMethod, setDeliveryMethod] = useState<"personal" | "carrier">("carrier");
  const [shippingTerms, setShippingTerms] = useState<
    "buyer_pays" | "seller_pays" | "included" | "split" | "other"
  >("included");
  // Carrier + estimated ship date are optional; we hide them in MVP UI.
  const [shippingCarrier, setShippingCarrier] = useState<string>("");
  void setShippingCarrier; // kept for future UI
  const [shippingNote, setShippingNote] = useState<string>("");
  const [estimatedShipDate, setEstimatedShipDate] = useState<string>("");
  void setEstimatedShipDate; // kept for future UI

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // OG import (level 2)
  const [externalUrl, setExternalUrl] = useState<string>("");
  const [importingOg, setImportingOg] = useState(false);
  const [externalSnapshot, setExternalSnapshot] = useState<OgSnapshot | null>(null);
  const [importedAttachments, setImportedAttachments] = useState<ImportedAttachment[]>([]);
  const [ogInfo, setOgInfo] = useState<{ title?: string | null; description?: string | null; imageStoragePath?: string | null } | null>(null);

  // Post-create upload (seller typically wants to attach photos)
  const [postUploadBusy, setPostUploadBusy] = useState(false);
  const [postUploadError, setPostUploadError] = useState<string>("");
  const [postUploadDone, setPostUploadDone] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<{
    dealId: string;
    viewToken: string;
    status: "draft" | "sent";
    inviteSent?: boolean;
    initiatorRole: "buyer" | "seller";
  } | null>(null);

  const [sendingInvite, setSendingInvite] = useState(false);
  const [sendInviteError, setSendInviteError] = useState<string>("");

  const canSubmit = useMemo(() => {
    const amt = parseAmountCzk(amountCzk);
    return (
      !!turnstileToken &&
      initiatorName.trim().length > 0 &&
      initiatorEmail.trim().length > 0 &&
      counterpartyEmail.trim().length > 0 &&
      subject.trim().length > 0 &&
      Number.isFinite(amt) &&
      amt > 0 &&
      !!deliveryMethod &&
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
    // shippingCarrier is optional + hidden in MVP
    termsAccepted,
  ]);

  function isFacebookLikeUrl(raw: string): boolean {
    try {
      const u = new URL(raw);
      const h = u.hostname.toLowerCase();
      return (
        h === "facebook.com" ||
        h.endsWith(".facebook.com") ||
        h === "fb.com" ||
        h.endsWith(".fb.com")
      );
    } catch {
      return false;
    }
  }

  async function importOg() {
    setError("");

    const url = externalUrl.trim();
    if (!url) {
      setError("Vlož odkaz.");
      return;
    }

    // Facebook často vyžaduje přihlášení a blokuje automatické načtení OG dat.
    if (isFacebookLikeUrl(url)) {
      setError("Facebook odkazy nejdou spolehlivě načíst (vyžadují přihlášení). Vyplň předmět a popis ručně.");
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

      const snap = (json.snapshot || {}) as OgSnapshot;
      setExternalSnapshot(snap);

      setOgInfo({
        title: snap.title,
        description: snap.description,
        imageStoragePath: json.imageStoragePath || null,
      });

      const imported = (Array.isArray((json as any).importedAttachments)
        ? ((json as any).importedAttachments as ImportedAttachment[])
        : [])
        .filter((a) => a && typeof a.storagePath === "string");
      setImportedAttachments(imported);

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
      // Create as DRAFT first (so seller can upload photos before sending)
      const res = await fetch(`${ENGINE_BASE}/api/deals/create`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          sendInvite: false,
          initiatorRole,
          initiatorEmail,
          initiatorName,
          counterpartyEmail,
          counterpartyName,
          title: subject,
          description: message,
          totalAmountCzk: parseAmountCzk(amountCzk),
          deliveryMethod,
          shippingTerms,
          shippingCarrier: deliveryMethod === "carrier" ? (shippingCarrier.trim() || null) : null,
          shippingNote: shippingNote || null,
          estimatedShipDate: estimatedShipDate || null,
          termsAccepted,
          termsVersion: "v1",
          externalUrl: externalUrl.trim() || null,
          externalSnapshot: externalSnapshot ? { og: externalSnapshot } : null,
          externalImageStoragePath: ogInfo?.imageStoragePath || null,
          attachments: importedAttachments.length
            ? importedAttachments.map((a) => ({
                storagePath: a.storagePath,
                fileName: a.fileName,
                contentType: a.contentType,
                fileSize: a.fileSize,
              }))
            : [],
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

      setSuccess({
        dealId: json.dealId,
        viewToken: json.viewToken,
        status: json.status || "draft",
        inviteSent: (json as any).inviteSent,
        initiatorRole,
      });
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

  async function sendInviteNow(dealId: string, viewToken: string) {
    setSendInviteError("");
    setSendingInvite(true);
    try {
      const res = await fetch(`${ENGINE_BASE}/api/deals/send-invite`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dealId, viewToken }),
      });

      const json = (await res.json()) as SendInviteResponse;
      if (!res.ok || !json.ok) {
        setSendInviteError((json as any)?.error || "SEND_INVITE_FAILED");
        return;
      }

      setSuccess((s) => (s ? { ...s, status: "sent", inviteSent: true } : s));
    } catch (e: any) {
      setSendInviteError(e?.message || "SEND_INVITE_FAILED");
    } finally {
      setSendingInvite(false);
    }
  }

  useEffect(() => {
    if (!success) return;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch {
      // Safari fallback
      window.scrollTo(0, 0);
    }
  }, [success?.dealId]);

  async function uploadSellerFiles(dealId: string, viewToken: string, list: FileList | null) {
    setPostUploadError("");
    if (!list || list.length === 0) return;

    setPostUploadBusy(true);
    try {
      const files = Array.from(list);

      for (const f of files) {
        // 1) ask engine for signed upload URL + DB row
        const metaRes = await fetch(`${ENGINE_BASE}/api/deals/upload-url`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            dealId,
            viewToken,
            fileName: f.name,
            contentType: f.type || "application/octet-stream",
            fileSize: f.size,
          }),
        });

        const metaJson = (await metaRes.json()) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!metaRes.ok || !metaJson?.ok || !metaJson?.signedUrl) {
          setPostUploadError(metaJson?.error || "UPLOAD_URL_FAILED");
          continue;
        }

        // 2) upload directly to Storage
        const putRes = await fetch(metaJson.signedUrl, {
          method: "PUT",
          headers: { "content-type": f.type || "application/octet-stream" },
          body: f,
        });

        if (!putRes.ok) {
          setPostUploadError(`UPLOAD_FAILED_${putRes.status}`);
          continue;
        }
      }

      setPostUploadDone((n) => n + files.length);
    } catch (e: any) {
      setPostUploadError(e?.message || "UPLOAD_FAILED");
    } finally {
      setPostUploadBusy(false);
    }
  }

  if (success) {
    return (
      <Section bg="white">
        <SectionHeader
          eyebrow="Bezpečná platba"
          title={success.status === "sent" ? "Pozvánka odeslaná" : "Nabídka připravená"}
          subtitle={
            success.status === "sent"
              ? "Protistraně přijde email s odkazem. Bez OTP nabídku nepotvrdí."
              : "Nejdřív si přidej fotky (pokud chceš), a pak nabídku odešli protistraně."
          }
        />

        <div className="max-w-2xl mx-auto">
          {success.status === "sent" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
              {success.inviteSent === false
                ? "Nabídka je vytvořená, ale email se nepodařilo odeslat. Zkopíruj link a pošli ho protistraně ručně."
                : "Email s pozvánkou je odeslaný. Čekáme na potvrzení protistrany."}
            </div>
          ) : (
            <div className="rounded-2xl border border-navy-100 bg-white px-5 py-4 text-sm text-navy-900">
              <div className="font-semibold">Ještě to není odeslané.</div>
              <div className="mt-1 text-xs text-navy-500">
                Tohle je schválně: jako prodávající si můžeš nejdřív přiložit fotky. Až pak to odešleš kupujícímu.
              </div>
            </div>
          )}

          {success.status !== "sent" && (
            <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-5">
              <div className="text-sm font-semibold text-navy-900">Odeslání pozvánky</div>
              <div className="mt-1 text-xs text-navy-500">
                Až budeš mít hotovo (fotky, kontrola textu), odešli pozvánku kupujícímu.
              </div>

              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="primary"
                  disabled={sendingInvite}
                  onClick={() => sendInviteNow(success.dealId, success.viewToken)}
                >
                  {sendingInvite ? "Odesílám…" : "Odeslat pozvánku"}
                </Button>
                <Button href={`/deal/${success.dealId}?t=${encodeURIComponent(success.viewToken)}`} variant="outlineDark">
                  Náhled nabídky
                </Button>
              </div>

              {sendInviteError && <div className="mt-2 text-xs text-red-700">{sendInviteError}</div>}
            </div>
          )}

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

          {success.initiatorRole === "seller" && (
            <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-5">
              <div className="text-sm font-semibold text-navy-900">Fotky (prodávající)</div>
              <div className="mt-1 text-xs text-navy-500">
                Přilož fotky zboží – uloží se k nabídce a zůstanou i kdyby se inzerát mezitím smazal.
              </div>

              {success.status !== "sent" && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                  Tip: Nahraj fotky teď a až pak klikni na „Odeslat pozvánku“.
                </div>
              )}

              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif"
                disabled={postUploadBusy}
                onChange={(e) => uploadSellerFiles(success.dealId, success.viewToken, e.target.files)}
                className="mt-3 block w-full cursor-pointer text-sm text-navy-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gold-400 file:px-4 file:py-2 file:font-semibold file:text-navy-900 hover:file:bg-gold-300"
              />
              {postUploadError && <div className="mt-2 text-xs text-red-700">Nahrávání: {postUploadError}</div>}
              {postUploadDone > 0 && <div className="mt-2 text-xs text-emerald-700">Nahráno souborů: {postUploadDone}</div>}
            </div>
          )}

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
                setExternalSnapshot(null);
                setImportedAttachments([]);
                setPostUploadError("");
                setPostUploadBusy(false);
                setPostUploadDone(0);
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

      <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
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
            <div className="text-sm font-semibold text-navy-800 mb-1">Cena (Kč)</div>
            <input
              inputMode="numeric"
              type="tel"
              pattern="[0-9]*"
              value={amountCzk}
              onChange={(e) => setAmountCzk(normalizeAmountInput(e.target.value))}
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
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
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
              placeholder="např. Petr"
            />
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Email protistrany</div>
            <input
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              value={counterpartyEmail}
              onChange={(e) => setCounterpartyEmail(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2"
              placeholder="protistrana@domena.cz"
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
          <Button type="submit" variant="primary" disabled={loading}>
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
