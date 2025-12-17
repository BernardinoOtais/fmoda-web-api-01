import { getSessionCookie } from "@repo/authweb/session";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(
  req: NextRequest
): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  //console.log("Tais middleware pathname: ", pathname);
  // Public route
  const isPublicRoute = pathname === "/";
  if (isPublicRoute) {
    //console.log("proxy 01");
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(req);
  const isLoginPath = pathname.startsWith("/auth/login");

  if (sessionCookie && isLoginPath) {
    //console.log("proxy 02");
    //console.log("proxy 02");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!sessionCookie && !isLoginPath) {
    //console.log("proxy 03");
    return redirectToLoginWithCallback(req);
  }

  //console.log("proxy 04");

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
