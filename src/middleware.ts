import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple JWT decode (no verification) for middleware routing decisions.
// Actual verification happens in API routes with jsonwebtoken.
function decodeJwt(token: string | undefined): { userId?: string; exp?: number } | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  const payload = decodeJwt(token);

  // Check if token is valid (exists and not expired)
  const isTokenValid = payload && payload.exp && payload.exp > Math.floor(Date.now() / 1000);

  // If user has a valid token and is on login/register, redirect to home
  if (isTokenValid && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};