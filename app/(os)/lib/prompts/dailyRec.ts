import { SPIEX_BRAND } from '../constants';
import type { Idea, Alert, DailyMetrics } from '../types';

export const DAILY_REC_SYSTEM = `You are the Growth Brain for ${SPIEX_BRAND.name}'s Creator OS.
Give a sharp, tactical daily recommendation. No fluff. No motivational speeches.
Sound like a sharp business partner who actually understands gaming content and Arab audiences.`;

export function dailyRecPrompt(
  topIdeas: Idea[],
  metrics: DailyMetrics[],
  alerts: Alert[],
  currentGame: string | null,
): string {
  const metricsStr = metrics
    .map(m => `${m.platform}: ${m.today.toLocaleString()} followers (${m.delta >= 0 ? '+' : ''}${m.delta} today)`)
    .join('\n');

  const ideasStr = topIdeas
    .map(i => `- "${i.title}" (growth score: ${i.growth_score ?? 'not scored'}, status: ${i.status})`)
    .join('\n');

  const alertsStr = alerts.length > 0
    ? alerts.map(a => `- [${a.severity}] ${a.title}`).join('\n')
    : 'No alerts';

  return `Today's situation:

CURRENT GAME: ${currentGame ?? 'None set'}

METRICS:
${metricsStr}

TOP IDEAS IN VAULT:
${ideasStr}

ALERTS:
${alertsStr}

Give me:
1. **The One Thing** — the single most impactful thing to post or do today (be specific)
2. **Why** — data-backed reason, 1-2 sentences max
3. **Quick Win** — something that takes under 30 minutes to execute
4. **Watch Out** — one risk or thing to avoid today

Keep it under 200 words total. Be direct.`;
}
