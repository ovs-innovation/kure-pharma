import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const userInfo = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!userInfo) {
    const loginUrl = new URL("/auth/login", request.url);
    const returnPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("redirectUrl", returnPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/order/:path*",
    "/checkout/:path*",
  ],
};
