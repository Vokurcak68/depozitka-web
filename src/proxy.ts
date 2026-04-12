import { NextRequest, NextResponse } from "next/server";

const MAIN_SITE_URL = "https://www.depozitka.eu";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host")?.toLowerCase() || "";
  const { pathname } = req.nextUrl;

  const isStatusHost = host === "status.depozitka.eu" || host === "www.status.depozitka.eu" || host.startsWith("status.depozitka.eu:");

  // status.depozitka.eu -> serve status board at domain root
  if (isStatusHost && (pathname === "/" || pathname === "")) {
    const url = req.nextUrl.clone();
    url.pathname = "/status";
    return NextResponse.rewrite(url);
  }

  // On status host we only want the status page.
  // Any other route should go to the main marketing site on www.depozitka.eu.
  if (isStatusHost) {
    const allowed = pathname === "/status" || pathname.startsWith("/status/") || pathname.startsWith("/brand/");

    if (!allowed) {
      const target = new URL(req.url);
      target.protocol = "https:";
      target.host = new URL(MAIN_SITE_URL).host;
      // keep the same path + query
      return NextResponse.redirect(target, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-main.xml).*)"],
};
