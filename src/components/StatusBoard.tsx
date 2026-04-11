"use client";

import { useEffect, useMemo, useState } from "react";

type Overall = "operational" | "degraded" | "major_outage";
type TargetStatus = "operational" | "degraded" | "incident";

interface MonitorTarget {
  code: string;
  name: string;
  url: string;
  severity: "critical" | "high" | "low";
  status: TargetStatus;
  lastCheck: {
    checked_at: string;
    ok: boolean;
    status_code: number | null;
    response_ms: number | null;
    error_message: string | null;
  } | null;
  openIncident: {
    id: string;
    opened_at: string;
    open_reason: string | null;
  } | null;
}

interface MonitorPayload {
  ok: boolean;
  overall: Overall;
  generatedAt: string;
  targets: MonitorTarget[];
}

const API_URL = "https://depozitka-engine.vercel.app/api/monitor/status";

function badgeClass(status: TargetStatus) {
  if (status === "operational") return "bg-emerald-100 text-emerald-800";
  if (status === "degraded") return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

function overallText(status: Overall): string {
  if (status === "operational") return "Všechny služby jsou v pořádku";
  if (status === "degraded") return "Část služeb je omezená";
  return "Aktivní incident";
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function StatusBoard() {
  const [data, setData] = useState<MonitorPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as MonitorPayload;
        if (!mounted) return;
        setData(json);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Nepodařilo se načíst status.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    const t = setInterval(load, 60_000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  const ordered = useMemo(() => {
    if (!data?.targets) return [];
    return [...data.targets].sort((a, b) => a.name.localeCompare(b.name, "cs"));
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">Status Depozitka</h1>
      <p className="text-navy-600 mb-8">
        Veřejný přehled dostupnosti služeb. Aktualizace probíhá automaticky každých 5 minut.
      </p>

      {loading && <div className="rounded-xl border border-navy-200 bg-white p-6">Načítám status…</div>}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          Nepodařilo se načíst monitoring ({error}).
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="rounded-2xl border border-navy-200 bg-white p-6 mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  data.overall === "operational"
                    ? "bg-emerald-100 text-emerald-800"
                    : data.overall === "degraded"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {overallText(data.overall)}
              </span>
            </div>
            <p className="text-sm text-navy-500">Poslední aktualizace: {formatDate(data.generatedAt)}</p>
          </div>

          <div className="space-y-4">
            {ordered.map((target) => (
              <article key={target.code} className="rounded-2xl border border-navy-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-navy-900">{target.name}</h2>
                    <a
                      href={target.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-navy-600 underline underline-offset-4 hover:text-navy-800"
                    >
                      {target.url}
                    </a>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(target.status)}`}>
                    {target.status === "operational"
                      ? "Operational"
                      : target.status === "degraded"
                        ? "Degraded"
                        : "Incident"}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-navy-600">
                  <div>Poslední kontrola: {formatDate(target.lastCheck?.checked_at)}</div>
                  <div>HTTP status: {target.lastCheck?.status_code ?? "ERR"}</div>
                  <div>Odezva: {target.lastCheck?.response_ms ?? "—"} ms</div>
                  {target.openIncident && (
                    <div className="text-red-700 font-medium">
                      Incident od {formatDate(target.openIncident.opened_at)}
                      {target.openIncident.open_reason ? ` — ${target.openIncident.open_reason}` : ""}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
