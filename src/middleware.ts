// Auth middleware — JWT verification on protected routes

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "0ndata-session";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/api/auth/signup",
  "/api/auth/signin",
  "/api/auth/signout",
  "/api/public",
  "/api/marketplace/install",
  "/api/marketplace/callback",
  "/api/webhooks",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and public paths
  if (isStaticAsset(pathname) || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    // API routes return 401, pages redirect to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Verify JWT
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "change-me-in-production"
    );
    const { payload } = await jwtVerify(token, secret);

    // Attach user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.sub as string);
    response.headers.set("x-user-email", payload.email as string);
    return response;
  } catch {
    // Invalid token — clear cookie and redirect
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    const response = NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
