import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  // Only protect these specific paths
  const pathname = req.nextUrl.pathname;
  if (
    !pathname.startsWith("/members-portal") &&
    !pathname.startsWith("/course-library") &&
    !pathname.startsWith("/admin")
  ) {
    return NextResponse.next();
  }

  // Get the NextAuth token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "default_secret_for_development_only" });

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = token.role as string;
  const active = token.active as boolean;
  const tier = (token.tier as string) || "tier1";

  // Admins bypass all restrictions
  if (role === "admin") {
    return NextResponse.next();
  }

  // If trying to access admin route without admin role
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/members-portal", req.url));
  }

  // If trying to access protected routes but not active
  if (!active) {
    const tierNumber = tier.replace("tier", "");
    return NextResponse.redirect(new URL(`/checkout?tier=${tierNumber}`, req.url));
  }

  return NextResponse.next();
}

// Ensure middleware only runs on specific paths to improve performance
export const config = {
  matcher: ["/members-portal/:path*", "/course-library/:path*", "/admin/:path*"],
};
