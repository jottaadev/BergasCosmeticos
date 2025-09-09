import { NextRequest, NextResponse } from 'next/server'
import { verifySessionEdge } from '@/lib/session-edge'

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // proteger /admin e subrotas
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('auth_token')?.value
    const valid = token ? await verifySessionEdge(token, SECRET) : null
    if (!token || !valid) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}


