import { NextRequest } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { createStreamResponse } from '@/app/(os)/lib/anthropic';
import { DAILY_REC_SYSTEM, dailyRecPrompt } from '@/app/(os)/lib/prompts/dailyRec';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!(await getSession())) return new Response('Unauthorized', { status: 401 });

  const { topIdeas, metrics, alerts, currentGame } = await req.json();
  const prompt = dailyRecPrompt(topIdeas, metrics, alerts, currentGame);

  return createStreamResponse(DAILY_REC_SYSTEM, prompt, 'claude-haiku-4-5');
}
