import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Bloquer l'accès admin aux non-admins
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Routes protégées — connexion requise
        const protectedRoutes = ['/account', '/orders', '/checkout']
        const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

        if (isProtected) return !!token

        // Admin — token + rôle ADMIN requis
        if (pathname.startsWith('/admin')) return token?.role === 'ADMIN'

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/orders/:path*',
    '/checkout',
  ],
}
