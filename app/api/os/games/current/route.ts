import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { getCurrentGame, setCurrentGame } from '@/app/(os)/lib/db/games';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const game = await getCurrentGame();
  return NextResponse.json(game);
}

export async function PUT(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await setCurrentGame(id);
  return NextResponse.json({ ok: true });
}
