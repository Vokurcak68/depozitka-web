import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ENGINE_BASE = process.env.NEXT_PUBLIC_ENGINE_BASE || "https://engine.depozitka.eu";

function makeTargetUrl(reqUrl: string, slug: string[]) {
  const u = new URL(reqUrl);
  const path = slug.map(encodeURIComponent).join("/");
  return `${ENGINE_BASE}/api/deals/${path}${u.search || ""}`;
}

async function proxy(req: Request, slug: string[]) {
  const targetUrl = makeTargetUrl(req.url, slug);

  // Forward body as-is (text) to avoid JSON parse issues.
  const method = req.method.toUpperCase();
  const contentType = req.headers.get("content-type") || "application/json";

  const init: RequestInit = {
    method,
    headers: {
      "content-type": contentType,
    },
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await req.text();
  }

  const res = await fetch(targetUrl, init);
  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json; charset=utf-8",
    },
  });
}

export async function GET(req: Request, ctx: { params: Promise<{ slug: string[] }> | { slug: string[] } }) {
  const params = (await (ctx as any).params) as { slug: string[] };
  return proxy(req, params.slug || []);
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string[] }> | { slug: string[] } }) {
  const params = (await (ctx as any).params) as { slug: string[] };
  try {
    return await proxy(req, params.slug || []);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { ok: false, error: "ENGINE_FETCH_FAILED", details: message || undefined },
      { status: 502 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
