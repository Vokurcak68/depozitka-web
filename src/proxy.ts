import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host")?.toLowerCase() || "";
  const { pathname } = req.nextUrl;

  // status.depozitka.eu -> serve status page at domain root
  if (
    (host === "status.depozitka.eu" || host === "www.status.depozitka.eu") &&
    pathname === "/"
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/status";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-main.xml).*)"],
};
