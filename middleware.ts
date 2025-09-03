import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Detect web crawlers/bots
  const isCrawler = /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator/i.test(userAgent);
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/login', 
    '/api/auth/google', 
    '/api/auth/google/callback', 
    '/api/reset-users',
    '/sitemap.xml',
    '/robots.txt'
  ];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Allow crawlers to access homepage for SEO
  if (isCrawler && pathname === '/') {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  const authToken = request.cookies.get('auth-token');
  
  // Always allow auth API routes
  if (pathname.startsWith('/api/auth/')) {
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