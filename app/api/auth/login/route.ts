import { NextRequest, NextResponse } from 'next/server'
import { signSession } from '@/lib/session'

// Para produção, use variável de ambiente forte
const SECRET = process.env.AUTH_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('Variáveis de ambiente AUTH_SECRET, ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórias')
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 })
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const token = signSession({ email, exp: Date.now() + 1000 * 60 * 60 * 8 }, SECRET) // 8h

    const res = NextResponse.json({ ok: true })
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8
    })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Erro no login' }, { status: 500 })
  }
}


