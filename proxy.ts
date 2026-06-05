import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'os_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const [ts, sig] = token.split('.');
    if (!ts || !sig) return false;

    const age = Date.now() - parseInt(ts);
    if (age > SESSION_MAX_AGE_MS || age < 0) return false;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sigBytes = await crypto.subtle.sign('HMAC', key, enc.encode(ts));
    const expected = Buffer.from(sigBytes).toString('hex');
    return expected === sig;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only gate /os routes (not /os/login, not /api/os/auth/*)
  if (!pathname.startsWith('/os')) return NextResponse.next();
  if (pathname === '/os/login') return NextResponse.next();
  if (pathname.startsWith('/api/os/auth')) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.OS_SESSION_SECRET ?? 'fallback-secret-change-me';

  if (!token || !(await verifyToken(token, secret))) {
    const loginUrl = new URL('/os/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/os/:path*', '/api/os/:path*'],
};
