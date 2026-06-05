import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { getGame, updateGame, deleteGame } from '@/app/(os)/lib/db/games';

export const runtime = 'nodejs';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const game = await getGame(parseInt(id));
  if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(game);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const game = await updateGame(parseInt(id), body);
  return NextResponse.json(game);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await deleteGame(parseInt(id));
  return NextResponse.json({ ok: true });
}
