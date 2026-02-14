import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Proxy for adding pathname header to requests
 * Maintenance mode check is handled in (main)/layout.tsx
 */
export async function proxy(request: NextRequest) {
  // Add pathname header for use in layouts
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
