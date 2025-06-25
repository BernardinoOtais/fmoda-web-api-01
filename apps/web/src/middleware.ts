import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function middleware(
  req: NextRequest
): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  //Rota publica
  const isPublicRoute = pathname === "/";
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(req);

  const isLoginPath = pathname.startsWith("/auth/login");

  if (!sessionCookie && !isLoginPath) {
    return buildLoginRedirect(req, pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

function buildLoginRedirect(request: NextRequest, path: string) {
  let callbackUrl = path;
  if (request.nextUrl.search) {
    callbackUrl += request.nextUrl.search;
  }
  const encoded = encodeURIComponent(callbackUrl);
  console.log("Censa e coisa: ", encoded);
  return NextResponse.redirect(
    new URL(`/auth/login?callbackUrl=${encoded}`, request.url)
  );
}

/*
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],

*/
