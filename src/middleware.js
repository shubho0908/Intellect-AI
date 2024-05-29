import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function middleware(request) {
  const currentUrl = request.nextUrl.pathname;
  const accessToken = cookies().get("accessToken");

  const authRoutes = ["/login", "/signup"];
  const publicRoutes = ["/home", "/post", "/profile"];

  if (!accessToken && publicRoutes.some((url) => currentUrl.includes(url))) {
    return NextResponse.next();
  }

  if (
    !accessToken &&
    !publicRoutes.some((url) => currentUrl.includes(url)) &&
    !authRoutes.some((url) => currentUrl.includes(url))
  ) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl.href);
  }

  if (
    (accessToken && authRoutes.some((url) => currentUrl.includes(url))) ||
    currentUrl === "/"
  ) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl.href);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
