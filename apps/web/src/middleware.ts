import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function middleware(
  req: NextRequest
): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // Public route
  const isPublicRoute = pathname === "/";
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(req);
  const isLoginPath = pathname.startsWith("/auth/login");

  if (sessionCookie && isLoginPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!sessionCookie && !isLoginPath) {
    return redirectToLoginWithCallback(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

function redirectToLoginWithCallback(request: NextRequest): NextResponse {
  const fullPath = request.nextUrl.pathname + request.nextUrl.search;
  const encoded = encodeURIComponent(fullPath);
  const loginUrl = new URL(`/auth/login?callbackUrl=${encoded}`, request.url);

  return NextResponse.redirect(loginUrl);
}
