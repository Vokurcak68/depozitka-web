import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ENGINE_BASE = process.env.NEXT_PUBLIC_ENGINE_BASE || "https://engine.depozitka.eu";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const url = typeof (body as any)?.url === "string" ? String((body as any).url) : "";
  if (!url.trim()) {
    return NextResponse.json({ ok: false, error: "MISSING_URL" }, { status: 400 });
  }

  try {
    const res = await fetch(`${ENGINE_BASE}/api/deals/import-og`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json; charset=utf-8",
        // no CORS needed: this is same-origin for the browser
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { ok: false, error: "ENGINE_FETCH_FAILED", details: message || undefined },
      { status: 502 },
    );
  }
}
