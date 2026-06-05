'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../primitives/Card';
import type { Game } from '../../lib/types';

interface Props { game: Game }

export function GameAnalysisPanel({ game }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const cached = game.ai_analysis;

  async function run() {
    setText('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/os/ai/analyze-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id }),
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const { delta, error: e } = JSON.parse(data);
            if (e) { setError(e); break; }
            if (delta) setText(t => t + delta);
          } catch { /* skip */ }
        }
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  const displayText = text || (cached ? JSON.stringify(cached, null, 2) : '');
  const hasContent = Boolean(displayText);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-violet-400" />
            <span className="text-white/70 text-sm font-medium">AI Game Intelligence</span>
            {game.ai_analyzed_at && !text && (
              <span className="text-white/25 text-xs">
                · Last analyzed {new Date(game.ai_analyzed_at).toLocaleDateString()}
              </span>
            )}
          </div>
          <button
            onClick={run}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/15 hover:bg-violet-600/25
                       text-violet-400 text-xs rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Analyzing...' : hasContent ? 'Re-analyze' : 'Analyze'}
          </button>
        </div>
      </CardHeader>
      <CardBody>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!hasContent && !loading && !error && (
          <div className="text-center py-8">
            <Zap size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Click Analyze to get AI-powered content opportunities</p>
          </div>
        )}
        {hasContent && (
          <div
            className="text-sm text-white/70 leading-relaxed space-y-3 prose-sm prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: (text || (typeof cached === 'string' ? cached : JSON.stringify(cached, null, 2)))
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white/90">$1</strong>')
                .replace(/^### (.+)$/gm, '<h3 class="text-white/80 font-semibold mt-4 mb-1">$1</h3>')
                .replace(/^## (.+)$/gm, '<h2 class="text-white font-bold mt-5 mb-2">$1</h2>')
                .replace(/^# (.+)$/gm, '<h1 class="text-white font-black mt-5 mb-2">$1</h1>')
                .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
                .replace(/\n/g, '<br/>'),
            }}
          />
        )}
        {loading && <span className="animate-pulse text-violet-400">▋</span>}
      </CardBody>
    </Card>
  );
}
