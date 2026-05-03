import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, hasLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocalePrefix = pathname
    .split("/")
    .filter(Boolean)
    .some((segment, index) => index === 0 && hasLocale(segment));

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  const preferredLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const locale = hasLocale(preferredLocale ?? "") ? preferredLocale : DEFAULT_LOCALE;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
