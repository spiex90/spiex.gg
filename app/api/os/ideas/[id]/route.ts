import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { getIdea, updateIdea, deleteIdea } from '@/app/(os)/lib/db/ideas';

export const runtime = 'nodejs';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const idea = await getIdea(parseInt(id));
  if (!idea) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(idea);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const idea = await updateIdea(parseInt(id), body);
  return NextResponse.json(idea);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await deleteIdea(parseInt(id));
  return NextResponse.json({ ok: true });
}
