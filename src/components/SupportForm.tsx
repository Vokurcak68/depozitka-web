"use client";

import { useEffect, useMemo, useState } from "react";
import TurnstileWidget from "@/components/TurnstileWidget";

const ENGINE_BASE = "https://engine.depozitka.eu";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type Category = "incident" | "payment" | "integration" | "legal" | "other";

const categories: { value: Category; label: string }[] = [
  { value: "incident", label: "Incident / výpadek" },
  { value: "payment", label: "Platba / transakce" },
  { value: "integration", label: "Integrace / API" },
  { value: "legal", label: "Právní" },
  { value: "other", label: "Jiné" },
];

type Uploading = {
  file: File;
  state: "queued" | "uploading" | "done" | "error";
  error?: string;
};

export default function SupportForm() {
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("incident");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [transactionRef, setTransactionRef] = useState("");

  const [files, setFiles] = useState<Uploading[]>([]);
  const [inAppBrowser, setInAppBrowser] = useState(false);

  useEffect(() => {
    try {
      const ua = navigator.userAgent || "";
      // Common embedded browsers that often block <input type="file">.
      setInAppBrowser(/Telegram|FBAN|FBAV|Instagram|Line\//i.test(ua));
    } catch {
      setInAppBrowser(false);
    }
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ticketCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      !!turnstileToken &&
      email.includes("@") &&
      subject.trim().length > 0 &&
      message.trim().length > 0 &&
      !submitting
    );
  }, [turnstileToken, email, subject, message, submitting]);

  async function submit() {
    setError(null);
    setSubmitting(true);

    try {
      const createRes = await fetch(`${ENGINE_BASE}/api/support/create`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          email,
          name,
          category,
          subject,
          message,
          pageUrl,
          transactionRef,
        }),
      });

      const createJson = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createJson?.error || `CREATE_FAILED_${createRes.status}`);
      }

      const { ticketId, ticketCode, uploadToken } = createJson as {
        ticketId: string;
        ticketCode: string;
        uploadToken: string;
      };

      // Upload files sequentially (avoid rate limits)
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.state === "done") continue;

        setFiles((prev) =>
          prev.map((x) => (x.file === f.file ? { ...x, state: "uploading", error: undefined } : x))
        );

        const metaRes = await fetch(`${ENGINE_BASE}/api/support/upload-url`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            turnstileToken,
            ticketId,
            uploadToken,
            fileName: f.file.name,
            contentType: f.file.type || "text/plain",
            fileSize: f.file.size,
          }),
        });

        const metaJson = await metaRes.json();
        if (!metaRes.ok) {
          setFiles((prev) =>
            prev.map((x) => (x.file === f.file ? { ...x, state: "error", error: metaJson?.error || "UPLOAD_URL_FAILED" } : x))
          );
          continue;
        }

        const { signedUrl } = metaJson as { signedUrl: string };

        const putRes = await fetch(signedUrl, {
          method: "PUT",
          headers: { "content-type": f.file.type || "application/octet-stream" },
          body: f.file,
        });

        if (!putRes.ok) {
          setFiles((prev) =>
            prev.map((x) => (x.file === f.file ? { ...x, state: "error", error: `UPLOAD_FAILED_${putRes.status}` } : x))
          );
          continue;
        }

        setFiles((prev) => prev.map((x) => (x.file === f.file ? { ...x, state: "done" } : x)));
      }

      setResult({ ticketCode });
    } catch (e: any) {
      setError(e?.message || "ERROR");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-6">
      {result ? (
        <div>
          <div className="text-sm text-navy-500">Ticket vytvořen</div>
          <div className="text-2xl font-bold text-navy-900 mt-1">{result.ticketCode}</div>
          <p className="mt-3 text-navy-600">
            Díky. Ozveme se na email <b>{email}</b>. (Pokud to byl jen test, klidně mi napiš.)
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-navy-800">Email *</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2"
                placeholder="např. nekdo@email.cz"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-navy-800">Jméno</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2"
                placeholder="volitelně"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-navy-800">Kategorie</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-navy-800">URL stránky</span>
              <input
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2"
                placeholder="kde se to stalo (volitelně)"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-navy-800">Předmět *</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2"
                placeholder="stručně"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-navy-800">Popis *</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 min-h-[140px]"
                placeholder="co přesně se děje, co jsi čekal, co se stalo..."
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-navy-800">Reference (transakce / číslo)</span>
              <input
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2"
                placeholder="volitelně"
              />
            </label>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-navy-800">Přílohy</div>
            {inAppBrowser && (
              <div className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                Pozor: v in-app prohlížeči (Telegram/Instagram/Facebook…) často nejde nahrávat soubory.
                Otevři stránku v Safari/Chrome a zkus to znovu.
              </div>
            )}
            <input
              type="file"
              multiple
              onChange={(e) => {
                const list = Array.from(e.target.files || []);
                setFiles((prev) => [...prev, ...list.map((file) => ({ file, state: "queued" as const }))]);
              }}
              className="mt-2"
            />
            {files.length > 0 && (
              <ul className="mt-3 space-y-2 text-sm">
                {files.map((f) => (
                  <li key={f.file.name + f.file.size} className="flex items-center justify-between gap-3">
                    <span className="truncate">{f.file.name}</span>
                    <span className="text-navy-500">
                      {f.state === "queued" && "čeká"}
                      {f.state === "uploading" && "upload..."}
                      {f.state === "done" && "OK"}
                      {f.state === "error" && `chyba (${f.error})`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 text-xs text-navy-500">
              Max 10 MB / soubor. Povolené: PNG, JPG, WEBP, PDF, TXT.
            </div>
          </div>

          <div className="mt-6">
            {TURNSTILE_SITE_KEY ? (
              <TurnstileWidget
                siteKey={TURNSTILE_SITE_KEY}
                action="support_create"
                onToken={(t) => setTurnstileToken(t)}
              />
            ) : (
              <div className="text-sm text-red-600">
                Chybí env: NEXT_PUBLIC_TURNSTILE_SITE_KEY
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              disabled={!canSubmit}
              onClick={submit}
              className="px-4 py-2 rounded-lg bg-gold-400 text-navy-900 font-semibold disabled:opacity-50"
            >
              {submitting ? "Odesílám…" : "Vytvořit ticket"}
            </button>
            <div className="text-xs text-navy-500">
              Po odeslání dostaneš ID ticketu. (Proti spamu chráněno Turnstile.)
            </div>
          </div>
        </>
      )}
    </div>
  );
}
