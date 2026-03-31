import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ADDED "/api/auth/register" to the public routes array!
const publicRoutes = ["/", "/login", "/api/auth/login", "/api/auth/register", "/api/auth/logout"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api");

  // 1. Let public routes pass through
  if (publicRoutes.includes(pathname)) {
    const token = req.cookies.get("token")?.value;
    
    // If a logged-in user visits public pages, route them to their dashboards
    if (token && (pathname === "/login" || pathname === "/")) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        if (payload.role === "owner/admin") {
          return NextResponse.redirect(new URL("/owner", req.url));
        }
        return NextResponse.redirect(new URL("/menu", req.url));
      } catch {
        // Token is invalid, let them stay on the public page
      }
    }
    return NextResponse.next();
  }

  // 2. Check for token on protected routes
  const token = req.cookies.get("token")?.value;

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    if (pathname.startsWith("/owner") && role !== "owner/admin") {
      return NextResponse.redirect(new URL("/menu", req.url));
    }

    return NextResponse.next();
  } catch {
    const response = isApiRoute 
      ? NextResponse.json({ error: "Token expired or invalid" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));
      
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};