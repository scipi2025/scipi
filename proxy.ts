import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname === '/admin/login') {
    // If already authenticated, redirect to admin dashboard
    const token = request.cookies.get('auth-token')?.value;
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Protect all /admin routes (except login)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;

    // No token found
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      // Invalid token, redirect to login and clear cookie
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // Token is valid, allow access
    return NextResponse.next();
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    // Check if this is an admin-only API route
    const adminApiRoutes = ['/api/partners', '/api/projects', '/api/events', '/api/resources', '/api/upload'];
    const isAdminRoute = adminApiRoutes.some(route => pathname.startsWith(route));

    if (isAdminRoute) {
      const token = request.cookies.get('auth-token')?.value;

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};

