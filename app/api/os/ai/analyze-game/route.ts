import { NextRequest } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { createStreamResponse } from '@/app/(os)/lib/anthropic';
import { GAME_ANALYSIS_SYSTEM, gameAnalysisPrompt } from '@/app/(os)/lib/prompts/gameAnalysis';
import { getGame } from '@/app/(os)/lib/db/games';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!(await getSession())) return new Response('Unauthorized', { status: 401 });

  const { gameId } = await req.json();
  const game = await getGame(gameId);
  if (!game) return new Response('Game not found', { status: 404 });

  const prompt = gameAnalysisPrompt(game);
  return createStreamResponse(GAME_ANALYSIS_SYSTEM, prompt, 'claude-opus-4-5');
}
