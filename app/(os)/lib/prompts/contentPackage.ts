import { SPIEX_BRAND } from '../constants';
import type { Idea, Game, ContentFormat } from '../types';

export const PACKAGE_SYSTEM = `You are the AI Content Factory for ${SPIEX_BRAND.name}'s Creator OS.

Your job: generate complete, ready-to-post content packages for a Kuwaiti Twitch streamer.

SPIEX VOICE:
${SPIEX_BRAND.voice}

NEVER use:
- "في عالم..." or any generic Arabic opener
- "Don't miss out", "Game changer", "Level up your..."
- Corporate language
- Emojis as filler
- Fake enthusiasm

FORMAT: Return ONLY valid JSON matching the schema provided.`;

export function packagePrompt(
  idea: Idea,
  game: Game | null,
  formats: ContentFormat[],
): string {
  const formatDescriptions = {
    ig_carousel: 'Instagram Carousel (5-8 slides)',
    tt_carousel: 'TikTok Carousel (3-5 slides)',
    ig_reel: 'Instagram Reel (15-30 sec script)',
    tt_video: 'TikTok Video (15-30 sec script)',
    yt_short: 'YouTube Short (under 60 sec)',
  };

  const formatList = formats.map(f => `- ${formatDescriptions[f]}`).join('\n');

  return `Generate content packages for this idea:

Title: ${idea.title}
Description: ${idea.description ?? 'N/A'}
Game: ${game?.name ?? 'No specific game'}

Formats needed:
${formatList}

Return this JSON structure (one entry per format):
{
  "packages": [
    {
      "format": "<format_id>",
      "hook": "<attention-grabbing opening line>",
      "slides": [
        {
          "slide_number": 1,
          "en": "<English slide text>",
          "ar": "<Arabic slide text in Kuwaiti dialect>",
          "visual_note": "<brief direction for designer>"
        }
      ],
      "caption_en": "<full English caption with personality>",
      "caption_ar": "<full Arabic caption in Kuwaiti dialect>",
      "hashtags": ["tag1", "tag2"],
      "cta": "<call to action>",
      "title": "<SEO title if applicable>",
      "seo_keywords": ["kw1", "kw2"]
    }
  ]
}

Notes:
- Arabic must be in Kuwaiti dialect (not MSA)
- Captions should sound like a gamer talking to friends
- Hashtags: mix Arabic and English, avoid over-used generic ones
- CTA must mention twitch.tv/spiex90 or "Twitch" at least once
- For reel/video/short formats, "slides" field contains the script as sequential lines`;
}
