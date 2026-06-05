import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { listIdeas, createIdea } from '@/app/(os)/lib/db/ideas';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') ?? undefined;
    const game_id = searchParams.get('game_id') ? parseInt(searchParams.get('game_id')!) : undefined;
    const ideas = await listIdeas({ status, game_id });
    return NextResponse.json(ideas);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const idea = await createIdea(body);
    return NextResponse.json(idea, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
