import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function middleware(request) {
  const currentUrl = request.nextUrl.pathname;
  const accessToken = cookies().get("accessToken");

  const publicRoutes = ["/login", "/signup"];

  if (!accessToken && !publicRoutes.includes(currentUrl) || currentUrl === "/") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl.href);
  }

  if (accessToken && publicRoutes.includes(currentUrl)) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl.href);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
