export const dynamic = 'force-dynamic';

import { getIdea } from '../../../lib/db/ideas';
import { IdeaScorePanel } from '../../../components/ideas/IdeaScorePanel';
import { IdeaPackages } from '../../../components/ideas/IdeaPackages';
import { StatusBadge } from '../../../components/primitives/Badge';
import { Card, CardHeader, CardBody } from '../../../components/primitives/Card';
import { PLATFORM_LABELS, SCORE_LABELS } from '../../../lib/constants';
import { formatDate, scoreColor } from '../../../lib/formatters';
import { ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listPackages } from '../../../lib/db/packages';

export default async function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ideaId = parseInt(id);
  const [idea, packages] = await Promise.all([
    getIdea(ideaId),
    listPackages(ideaId).catch(() => []),
  ]);
  if (!idea) notFound();

  const scoreFields = Object.keys(SCORE_LABELS) as Array<keyof typeof SCORE_LABELS>;
  const hasScores = idea.growth_score != null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/os/ideas" className="text-white/30 hover:text-white/60 transition-colors mt-1">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-white">{idea.title}</h1>
            <StatusBadge status={idea.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-white/25">
            {idea.game && <span>Game: {idea.game.name}</span>}
            {(idea.platforms ?? []).length > 0 && (
              <span>{(idea.platforms ?? []).map(p => PLATFORM_LABELS[p]).join(', ')}</span>
            )}
            <span>{formatDate(idea.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasScores && (
            <div className="text-center px-4">
              <div className={`text-2xl font-black tabular-nums ${scoreColor(idea.growth_score!)}`}>
                {idea.growth_score}
              </div>
              <div className="text-white/20 text-[10px] uppercase tracking-wider">Growth Score</div>
            </div>
          )}
        </div>
      </div>

      {idea.description && (
        <Card className="p-4">
          <p className="text-white/60 text-sm leading-relaxed">{idea.description}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Scoring */}
        <IdeaScorePanel idea={idea} />

        {/* Score breakdown */}
        {hasScores && (
          <Card>
            <CardHeader>
              <span className="text-white/70 text-sm font-medium">Score Breakdown</span>
            </CardHeader>
            <CardBody className="space-y-3">
              {scoreFields.map(field => {
                const val = idea[field as keyof typeof idea] as number | null;
                if (val == null) return null;
                return (
                  <div key={field}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/40">{SCORE_LABELS[field]}</span>
                      <span className={scoreColor(val)}>{val}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          val >= 80 ? 'bg-emerald-500' : val >= 60 ? 'bg-yellow-500' : val >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {idea.score_rationale && (
                <p className="text-white/40 text-xs pt-2 border-t border-white/5 leading-relaxed">
                  {idea.score_rationale}
                </p>
              )}
            </CardBody>
          </Card>
        )}
      </div>

      {/* Content Packages */}
      <IdeaPackages ideaId={ideaId} packages={packages} />
    </div>
  );
}
