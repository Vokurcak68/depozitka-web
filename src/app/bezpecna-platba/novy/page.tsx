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
  signedUrl?: string | null;
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

  const [initiatorRole, setInitiatorRole] = useState<"buyer" | "seller">("seller");
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
  const [ogInfo, setOgInfo] = useState<{
    title?: string | null;
    description?: string | null;
    imageStoragePath?: string | null;
  } | null>(null);

  // Attachments selected on the first screen (queued; uploaded after create)
  const [localFiles, setLocalFiles] = useState<File[]>([]);

  // Post-create upload status
  const [postUploadBusy, setPostUploadBusy] = useState(false);
  const [postUploadError, setPostUploadError] = useState<string>("");
  const [postUploadDone, setPostUploadDone] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<{
    dealId: string;
    viewToken: string;
    inviteSent?: boolean;
    initiatorRole: "buyer" | "seller";
  } | null>(null);

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
      const res = await fetch(`/api/deals/import-og`, {
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

      // NOTE: OG imported images are already stored in Supabase Storage by engine.
      // We attach them to the deal on create by sending `attachments: importedAttachments`.
      // They are not added to localFiles (localFiles are only user-selected uploads).

      // Optionally show previews (engine may return signedUrl per attachment)

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
      // Create + send invite (single step)
      const res = await fetch(`/api/deals/create`, {
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

      // Upload user-selected attachments right after create
      if (localFiles.length > 0) {
        await uploadQueuedFiles(json.dealId, json.viewToken, localFiles);
        setLocalFiles([]);
      }

      // Show success (email sent in the same step)
      setSuccess({
        dealId: json.dealId,
        viewToken: json.viewToken,
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

  useEffect(() => {
    if (!success) return;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch {
      // Safari fallback
      window.scrollTo(0, 0);
    }
  }, [success?.dealId]);

  async function uploadQueuedFiles(dealId: string, viewToken: string, files: File[]) {
    setPostUploadError("");
    if (!files || files.length === 0) return;

    setPostUploadBusy(true);
    try {
      for (const f of files) {
        // 1) ask engine for signed upload URL + DB row
        const metaRes = await fetch(`/api/deals/upload-url`, {
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
          title="Nabídka odeslaná"
          subtitle="Protistraně přijde email s odkazem. Bez OTP nabídku nepotvrdí."
        />

        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            {success.inviteSent === false
              ? "Nabídka je vytvořená, ale email se nepodařilo odeslat. Zkopíruj link a pošli ho protistraně ručně."
              : "Email s nabídkou je odeslaný. Čekáme na potvrzení protistrany."}
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

            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              Pozn.: Tohle je odkaz pro protistranu. Ty jako zadavatel už do nabídky nelez (ať se nic nemění pod rukama).
              Pokud bude potřeba něco upravit, pošli novou nabídku.
            </div>
          </div>

          {postUploadDone > 0 && (
            <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-5">
              <div className="text-sm font-semibold text-navy-900">Přílohy</div>
              <div className="mt-1 text-xs text-navy-500">Nahráno souborů: {postUploadDone}</div>
              {postUploadError && <div className="mt-2 text-xs text-red-700">Nahrávání: {postUploadError}</div>}
            </div>
          )}

          <div className="mt-6 flex gap-3">
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

      <div className="max-w-3xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-navy-800">
          <div className="font-semibold">1) Vyplníš</div>
          <div className="text-xs text-navy-600">základ nabídky</div>
        </div>
        <div className="rounded-2xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-800">
          <div className="font-semibold">2) Systém pošle výzvu</div>
          <div className="text-xs text-navy-600">protistrana dostane email automaticky</div>
        </div>
        <div className="rounded-2xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-800">
          <div className="font-semibold">3) Potvrdí OTP</div>
          <div className="text-xs text-navy-600">a vznikne úschova</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="max-w-3xl mx-auto rounded-3xl border border-navy-100 bg-gradient-to-b from-white to-navy-50/40 p-5 sm:p-7 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Jsi</div>
            <select
              value={initiatorRole}
              onChange={(e) => setInitiatorRole(e.target.value as any)}
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
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
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
              placeholder="např. 1250"
            />
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Tvoje jméno</div>
            <input
              value={initiatorName}
              onChange={(e) => setInitiatorName(e.target.value)}
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
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
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
              placeholder="jan@domena.cz"
            />
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-navy-800 mb-1">Jméno protistrany (volitelné)</div>
            <input
              value={counterpartyName}
              onChange={(e) => setCounterpartyName(e.target.value)}
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
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
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
              placeholder="protistrana@domena.cz"
            />
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Typ předání</div>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value as any)}
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
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
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
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
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
              placeholder="např. Zásilkovna na výdejní místo / osobní předání Praha"
            />
          </label>


          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Odkaz na inzerát (volitelné)</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
                placeholder="https://..."
              />
              <Button type="button" variant="secondary" disabled={importingOg || !externalUrl.trim()} onClick={importOg}>
                {importingOg ? "Načítám…" : "Stáhnout popis + obrázky"}
              </Button>
            </div>
            {ogInfo && (
              <div className="mt-2 text-xs text-navy-500">
                Načteno z odkazu (OG). Můžeš to upravit ručně.
              </div>
            )}

            {importedAttachments.length > 0 && (
              <div className="mt-3 rounded-2xl border border-navy-100 bg-white p-4">
                <div className="text-sm font-semibold text-navy-900">Fotky z inzerátu</div>
                <div className="mt-1 text-xs text-navy-500">
                  Načteno: {importedAttachments.length}. Tyhle fotky se přiloží k nabídce.
                </div>

                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {importedAttachments.map((a) => (
                    <div key={a.storagePath} className="relative">
                      <div className="aspect-square overflow-hidden rounded-lg border border-navy-100 bg-navy-50">
                        {a.signedUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.signedUrl} alt={a.fileName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-navy-500">IMG</div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setImportedAttachments((list) => list.filter((x) => x.storagePath !== a.storagePath))}
                        className="absolute -right-2 -top-2 rounded-full bg-navy-900 px-2 py-1 text-[10px] font-semibold text-white"
                        aria-label="Odebrat"
                        title="Odebrat"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Přílohy (volitelné)</div>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
              disabled={loading || postUploadBusy}
              onChange={(e) => {
                const list = e.target.files;
                if (!list) return;
                const next = Array.from(list);
                setLocalFiles(next);
              }}
              className="block w-full cursor-pointer text-sm text-navy-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gold-400 file:px-4 file:py-2 file:font-semibold file:text-navy-900 hover:file:bg-gold-300"
            />
            <div className="mt-1 text-xs text-navy-500">
              {localFiles.length > 0
                ? `Vybráno souborů: ${localFiles.length}`
                : "Můžeš přidat fotky / PDF už teď. (Nahrání proběhne po odeslání nabídky.)"}
            </div>
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Předmět</div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
              placeholder="např. Prodej modelu lokomotivy Roco"
            />
          </label>

          <label className="block sm:col-span-2">
            <div className="text-sm font-semibold text-navy-800 mb-1">Poznámka (volitelné)</div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 min-h-28 shadow-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
              placeholder="Upřesnění k nabídce…"
            />
          </label>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold text-navy-800 mb-2">Souhlas</div>
          <label className="flex items-start gap-3 rounded-2xl border border-gold-200 bg-gold-50 p-4">
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

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-2xl border border-navy-100 bg-white/80 p-4">
          <div className="text-xs text-navy-600">Po odeslání dostaneš link, který pošleš protistraně.</div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" disabled={loading || postUploadBusy}>
              {loading || postUploadBusy ? "Odesílám…" : "Vytvořit nabídku"}
            </Button>
            <Button href="/bezpecna-platba" variant="outlineDark">
              Zpět
            </Button>
          </div>
        </div>
      </form>
    </Section>
  );
}
