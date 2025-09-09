import crypto from 'crypto'

export interface SessionPayload {
  email: string
  exp: number
}

function base64url(input: Buffer) {
  return input.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function signSession(payload: SessionPayload, secret: string) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encHeader = base64url(Buffer.from(JSON.stringify(header)))
  const encPayload = base64url(Buffer.from(JSON.stringify(payload)))
  const data = `${encHeader}.${encPayload}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest()
  const encSignature = base64url(signature)
  return `${data}.${encSignature}`
}

export function verifySession(token: string, secret: string): SessionPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [encHeader, encPayload, encSignature] = parts
  const data = `${encHeader}.${encPayload}`
  const expected = base64url(crypto.createHmac('sha256', secret).update(data).digest())
  if (!crypto.timingSafeEqual(Buffer.from(encSignature), Buffer.from(expected))) {
    return null
  }
  try {
    const json = JSON.parse(Buffer.from(encPayload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
    if (typeof json.exp !== 'number' || Date.now() > json.exp) return null
    return json as SessionPayload
  } catch {
    return null
  }
}


