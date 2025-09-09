import { NextRequest, NextResponse } from 'next/server'
import { signSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

// Para produção, use variável de ambiente forte
const SECRET = process.env.AUTH_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

if (!SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
  throw new Error('Variáveis de ambiente AUTH_SECRET, ADMIN_EMAIL e ADMIN_PASSWORD_HASH são obrigatórias')
}

// Garantir que as variáveis não são undefined após a verificação
const authSecret = SECRET as string
const adminEmail = ADMIN_EMAIL as string
const adminPasswordHash = ADMIN_PASSWORD_HASH as string

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 })
    }

    // Verificar email
    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    // Verificar senha com hash
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const token = signSession({ email, exp: Date.now() + 1000 * 60 * 60 * 8 }, authSecret) // 8h

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


