import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(
  req: NextRequest
): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  //console.log("Tais middleware pathname: ", pathname);
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
    // Match all routes except static files, _next, assets, API routes
    "/((?!_next/|assets/|api/|trpc/|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:js|css|jpg|jpeg|png|svg|webp|gif|woff2?|ttf|ico|eot|otf|txt|pdf|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

function redirectToLoginWithCallback(request: NextRequest): NextResponse {
  const fullPath = request.nextUrl.pathname + request.nextUrl.search;
  const encoded = encodeURIComponent(fullPath);
  const loginUrl = new URL(`/auth/login?callbackUrl=${encoded}`, request.url);

  return NextResponse.redirect(loginUrl);
}
