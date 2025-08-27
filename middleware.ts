import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/login', 
    '/verify-otp', 
    '/api/auth/google', 
    '/api/auth/google/callback', 
    '/api/auth/verify-otp', 
    '/api/auth/resend-otp', 
    '/api/reset-users',
    '/sitemap.xml',
    '/robots.txt'
  ];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Check if user is authenticated
  const authToken = request.cookies.get('auth-token');
  
  // Always allow OTP verification page and API routes
  if (pathname === '/verify-otp' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }
  
  // If it's not a public route and user is not authenticated, redirect to login
  if (!isPublicRoute && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is authenticated and trying to access login page, redirect to home
  if (pathname === '/login' && authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 