import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/(os)/lib/auth';
import { generateJSON } from '@/app/(os)/lib/anthropic';
import { PACKAGE_SYSTEM, packagePrompt } from '@/app/(os)/lib/prompts/contentPackage';
import { getIdea } from '@/app/(os)/lib/db/ideas';
import { getGame } from '@/app/(os)/lib/db/games';
import { createPackage } from '@/app/(os)/lib/db/packages';
import type { ContentFormat, ContentPayload } from '@/app/(os)/lib/types';

export const runtime = 'nodejs';

interface GeneratedPackage {
  format: ContentFormat;
  hook: string;
  slides?: Array<{ slide_number: number; en: string; ar: string; visual_note: string }>;
  caption_en: string;
  caption_ar: string;
  hashtags: string[];
  cta: string;
  title?: string;
  seo_keywords?: string[];
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ideaId, formats } = await req.json() as { ideaId: number; formats: ContentFormat[] };

  const idea = await getIdea(ideaId);
  if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 });

  const game = idea.game_id ? await getGame(idea.game_id) : null;
  const prompt = packagePrompt(idea, game, formats);

  const result = await generateJSON<{ packages: GeneratedPackage[] }>(PACKAGE_SYSTEM, prompt, 'claude-opus-4-5');

  const savedPackages = await Promise.all(
    result.packages.map(async (pkg) => {
      const payload: ContentPayload = {
        hook: pkg.hook,
        slides: pkg.slides,
        caption_en: pkg.caption_en,
        caption_ar: pkg.caption_ar,
        hashtags: pkg.hashtags,
        cta: pkg.cta,
        title: pkg.title,
        seo_keywords: pkg.seo_keywords,
      };

      return createPackage({
        idea_id: ideaId,
        format: pkg.format,
        payload,
        language: 'bilingual',
      });
    }),
  );

  return NextResponse.json({ packages: savedPackages });
}
