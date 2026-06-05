import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { listGames, createGame } from '@/app/(os)/lib/db/games';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const games = await listGames();
    return NextResponse.json(games);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const game = await createGame(body);
    return NextResponse.json(game, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
