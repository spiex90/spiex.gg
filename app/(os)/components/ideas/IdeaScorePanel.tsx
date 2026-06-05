'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../primitives/Card';
import type { Idea } from '../../lib/types';

export function IdeaScorePanel({ idea }: { idea: Idea }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function score() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/os/ai/score-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId: idea.id }),
      });
      if (!res.ok) throw new Error('Scoring failed');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  const hasScore = idea.growth_score != null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-violet-400" />
            <span className="text-white/70 text-sm font-medium">AI Scoring</span>
          </div>
          <button
            onClick={score}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/15 hover:bg-violet-600/25
                       text-violet-400 text-xs rounded-lg transition-colors disabled:opacity-50"
          >
            <Zap size={11} className={loading ? 'animate-pulse' : ''} />
            {loading ? 'Scoring...' : hasScore ? 'Re-score' : 'Score Idea'}
          </button>
        </div>
      </CardHeader>
      <CardBody>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        {!hasScore && !loading && (
          <div className="text-center py-6">
            <Zap size={28} className="text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-sm">
              AI will score this idea across 7 growth dimensions
            </p>
            <p className="text-white/20 text-xs mt-1">
              Reach · Shares · Saves · Follows · Twitch Conversion · ROI
            </p>
          </div>
        )}
        {loading && (
          <div className="flex items-center gap-2 py-4 text-violet-400 text-sm">
            <Zap size={14} className="animate-pulse" />
            Analyzing idea across all dimensions...
          </div>
        )}
        {hasScore && !loading && (
          <div className="text-center py-2">
            <p className="text-white/40 text-sm">
              Scored {idea.scored_at ? new Date(idea.scored_at).toLocaleDateString() : 'recently'}
            </p>
            <p className="text-white/25 text-xs mt-1">Click Re-score to refresh with latest context</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
