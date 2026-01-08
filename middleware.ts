import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin routes - only ADMIN users
    if (pathname.startsWith('/admin')) {
      if (token?.userType !== 'ADMIN') {
        return NextResponse.redirect(new URL('/auth', req.url))
      }
    }

    // Seller/Freelancer routes
    if (pathname.startsWith('/seller-dashboard') || pathname.startsWith('/create-gig')) {
      if (!['FREELANCER', 'AGENCY', 'ADMIN'].includes(token?.userType as string)) {
        return NextResponse.redirect(new URL('/apply-seller', req.url))
      }
    }

    // Client-specific routes
    if (pathname.startsWith('/dashboard') && pathname !== '/seller-dashboard') {
      if (!token?.userType) {
        return NextResponse.redirect(new URL('/auth', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes
        if (pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) {
          return true
        }

        // Protected routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/seller-dashboard/:path*',
    '/admin/:path*',
    '/create-gig/:path*',
    '/messages/:path*',
    '/profile/:path*'
  ]
}