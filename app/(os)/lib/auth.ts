import 'server-only';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'os_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function hmac(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Buffer.from(sig).toString('hex');
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.OS_SESSION_SECRET ?? 'fallback-secret-change-me';
  const ts = Date.now().toString();
  const sig = await hmac(secret, ts);
  return `${ts}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.OS_SESSION_SECRET ?? 'fallback-secret-change-me';
    const [ts, sig] = token.split('.');
    if (!ts || !sig) return false;
    // Check expiry
    const age = (Date.now() - parseInt(ts)) / 1000;
    if (age > SESSION_MAX_AGE) return false;
    // Verify HMAC
    const expected = await hmac(secret, ts);
    return expected === sig;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function verifyPassword(input: string): boolean {
  const password = process.env.OS_PASSWORD;
  if (!password) return false;
  // Constant-time compare
  if (input.length !== password.length) return false;
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    result |= input.charCodeAt(i) ^ password.charCodeAt(i);
  }
  return result === 0;
}

export { COOKIE_NAME };
