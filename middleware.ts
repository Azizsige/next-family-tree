import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");

  // Kalau mau ke admin tapi gak ada session, pindahin ke login
  if (isAdminPage && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kalau udah login tapi malah ke halaman login lagi, pindahin ke admin
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
