import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === '/auth';

  // Get the token from the session
  const isAuthenticated = request.cookies.has('session');

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/discover/:path*',
    '/settings/:path*',
    '/auth',
  ],
};