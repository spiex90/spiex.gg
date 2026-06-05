import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { generateJSON } from '@/app/(os)/lib/anthropic';
import { SCORING_SYSTEM, scoringUserPrompt } from '@/app/(os)/lib/prompts/ideaScoring';
import { getIdea, saveIdeaScores } from '@/app/(os)/lib/db/ideas';
import { getGame } from '@/app/(os)/lib/db/games';
import type { IdeaScores } from '@/app/(os)/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ideaId } = await req.json();

  const idea = await getIdea(ideaId);
  if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 });

  const game = idea.game_id ? await getGame(idea.game_id) : null;
  const userMessage = scoringUserPrompt(idea, game);

  const scores = await generateJSON<IdeaScores>(SCORING_SYSTEM, userMessage, 'claude-haiku-4-5');
  await saveIdeaScores(ideaId, scores);

  return NextResponse.json(scores);
}
