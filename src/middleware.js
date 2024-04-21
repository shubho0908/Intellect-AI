import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the current url
  const currentUrl = request?.nextUrl?.pathname;
  if (currentUrl === "/") {
    const loginUrl = new URL("/login", request?.url);
    return NextResponse.redirect(loginUrl.href);
  }
}
