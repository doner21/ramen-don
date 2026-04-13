import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page through
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // No Supabase configured — redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("notice", "not_configured");
      return NextResponse.redirect(loginUrl);
    }

    // Check for auth cookie (Supabase session)
    const projectRef = supabaseUrl.replace("https://", "").split(".")[0];
    const cookieNames = [
      `sb-${projectRef}-auth-token`,
      `sb-${projectRef}-auth-token.0`,
      "sb-access-token",
    ];

    const hasSession = cookieNames.some((name) => request.cookies.has(name));

    if (!hasSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
