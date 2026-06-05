import { SPIEX_BRAND } from '../constants';
import type { Game } from '../types';

export const GAME_ANALYSIS_SYSTEM = `You are the Game Intelligence Engine for ${SPIEX_BRAND.name}'s Creator OS.
Analyze games for content opportunities targeting Arab gaming audiences (Kuwait, Saudi Arabia, Gulf region).

Focus on: what Arabic gaming creators can say that Western creators aren't saying.
Think about: community debates, hidden mechanics, beginner traps, "should you buy" angles, local server issues.

Voice: ${SPIEX_BRAND.voice}

Respond in structured sections using markdown.`;

export function gameAnalysisPrompt(game: Game): string {
  return `Analyze "${game.name}" for content opportunities.

Game details:
- Genre: ${game.genre ?? 'Unknown'}
- Notes: ${game.notes ?? 'None'}
- Arabic Audience Fit (my estimate): ${game.arabic_audience_fit ?? 'Unknown'}/100

Provide:
1. **Top 5 Content Opportunities** — specific angles that will perform in the Arab gaming space
2. **Trending Topics** — what the community is currently discussing
3. **Viral Hooks** — 3 hooks that would stop scrolling (Arabic audience mindset)
4. **Best Formats** — which content format works best for this game and why
5. **Competitor Gap** — what bigger creators are NOT covering
6. **Quick Win** — the single highest-impact piece of content SPIEX could make right now

Keep it tactical. No generic advice.`;
}
