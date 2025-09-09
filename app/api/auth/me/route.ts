import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 })
  const session = verifySession(token, SECRET)
  if (!session) return NextResponse.json({ authenticated: false }, { status: 200 })
  return NextResponse.json({ authenticated: true, email: session.email })
}


