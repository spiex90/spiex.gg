import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSessionToken, COOKIE_NAME } from '@/app/(os)/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createSessionToken();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
