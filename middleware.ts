import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/docs'];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, check if user is authenticated
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // If no token, redirect to login page
  if (!token) {
    const url = new URL('/login', request.url);
    // Add the current path as redirect parameter
    url.searchParams.set('redirectTo', path);
    return NextResponse.redirect(url);
  }
  
  // User is authenticated, allow access to protected route
  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  // Match all routes except for API routes, _next (Next.js files), and certain file types
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};