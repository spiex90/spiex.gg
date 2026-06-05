'use client';

import { useState, useEffect } from 'react';
import { Zap, RefreshCw } from 'lucide-react';

interface Props {
  payload: {
    topIdeas: Array<{ title: string; growth_score: number | null; status: string }>;
    metrics: Array<{ platform: string; today: number; delta: number }>;
    alerts: Array<{ title: string; severity: string }>;
    currentGame: string | null;
  };
}

export default function AIRecommendation({ payload }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function run() {
    setText('');
    setDone(false);
    setLoading(true);

    try {
      const res = await fetch('/api/os/ai/daily-rec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') { setDone(true); break; }
          try {
            const { delta } = JSON.parse(data);
            if (delta) setText(t => t + delta);
          } catch { /* skip */ }
        }
      }
    } finally {
      setLoading(false);
      setDone(true);
    }
  }

  useEffect(() => { run(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-[#0f0f14] border border-violet-500/20 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-600/20 rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-violet-400" />
          </div>
          <span className="text-white/80 text-sm font-semibold">Growth Brain</span>
          <span className="text-white/20 text-xs">· Today's Recommendation</span>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="text-white/30 hover:text-white/60 transition-colors disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="text-sm text-white/70 leading-relaxed min-h-[80px]">
        {loading && !text && (
          <span className="text-white/20 animate-pulse">Analyzing your data...</span>
        )}
        {text && (
          <div
            className="prose-sm prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white/90">$1</strong>')
                .replace(/\n/g, '<br/>'),
            }}
          />
        )}
        {loading && text && <span className="animate-pulse ml-0.5 text-violet-400">▋</span>}
      </div>
    </div>
  );
}
