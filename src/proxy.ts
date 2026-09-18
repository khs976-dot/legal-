import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ar/, "") || "/";
    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin")
  ) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", "en");
    return NextResponse.next({
      request: { headers },
    });
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
