import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Allow static assets, next internals, and auth APIs
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api/auth') ||
    path.match(/\.(png|jpg|jpeg|svg|ico)$/i)
  ) {
    return NextResponse.next();
  }

  const isAuthPage = path === '/login';

  // Not logged in
  if (!token) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Logged in
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;

    if (isAuthPage) {
      if (role === 'owner/admin') {
        return NextResponse.redirect(new URL('/owner', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (path.startsWith('/owner') && role !== 'owner/admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Session corrupted
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
