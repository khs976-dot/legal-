import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RETIRED = new Set(["/about", "/practice", "/contact"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ar/, "") || "/";
    return NextResponse.redirect(url);
  }

  if (RETIRED.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.hash = pathname === "/contact" ? "inquiry" : "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    if (RETIRED.has(rest)) {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      url.hash = rest === "/contact" ? "inquiry" : "";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/admin")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", "en");
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return response;
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", "en");
    return NextResponse.next({
      request: { headers },
    });
  }

  const headers = new Headers(request.headers);
  headers.set("x-locale", "ar");
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/ar" : `/ar${pathname}`;
  return NextResponse.rewrite(url, {
    request: { headers },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)"],
};
