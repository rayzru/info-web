import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy for handling maintenance mode redirects
 *
 * When maintenance mode is enabled:
 * - Redirects all users to /maintenance page
 * - Allows admins to bypass (based on session)
 * - Allows access to static assets, API routes, and auth
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for:
  // - Static files and assets
  // - API routes (needed for tRPC, auth, etc.)
  // - Maintenance page itself
  // - Auth-related pages
  // - _next internal routes
  const skipPaths = [
    "/maintenance",
    "/api",
    "/_next",
    "/favicon.ico",
    "/icon",
    "/logo",
    "/login",
    "/register",
  ];

  if (skipPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if maintenance mode is enabled
  // We use a simple fetch to our own API to check settings
  // This avoids importing database code into middleware (edge runtime limitation)
  try {
    const maintenanceCheckUrl = new URL("/api/maintenance-check", request.url);
    const response = await fetch(maintenanceCheckUrl, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.maintenanceEnabled && !data.isAdmin) {
        // Redirect to maintenance page
        const maintenanceUrl = new URL("/maintenance", request.url);
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  } catch (error) {
    // If check fails, allow access (fail open)
    console.error("Maintenance check failed:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
