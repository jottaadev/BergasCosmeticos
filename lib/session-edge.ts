export interface SessionPayload {
  email: string
  exp: number
}

function base64UrlEncode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  // btoa available in Edge runtime
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64UrlDecode<T = unknown>(input: string): T | null {
  try {
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : ''
    const json = atob(b64 + pad)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

export async function verifySessionEdge(token: string, secret: string): Promise<SessionPayload | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [encHeader, encPayload, encSignature] = parts
  const data = `${encHeader}.${encPayload}`

  // Import secret into Web Crypto
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const expected = base64UrlEncode(sig)
  if (expected !== encSignature) return null

  const payload = base64UrlDecode<SessionPayload>(encPayload)
  if (!payload || typeof payload.exp !== 'number') return null
  if (Date.now() > payload.exp) return null
  return payload
}


