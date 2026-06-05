import { listIdeas } from '../../lib/db/ideas';
import { Card } from '../../components/primitives/Card';
import { StatusBadge } from '../../components/primitives/Badge';
import { formatDate, scoreBg } from '../../lib/formatters';
import { PLATFORM_LABELS } from '../../lib/constants';
import { Lightbulb, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function IdeasPage() {
  const ideas = await listIdeas().catch(() => []);
  const active = ideas.filter(i => i.status !== 'archived');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Idea Vault</h1>
          <p className="text-white/30 text-sm mt-0.5">{active.length} active ideas</p>
        </div>
        <Link
          href="/os/ideas/new"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500
                     text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={14} /> New Idea
        </Link>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Lightbulb size={40} className="text-white/15 mb-4" />
          <p className="text-white/30 text-sm">Vault is empty</p>
          <Link href="/os/ideas/new" className="text-violet-400 text-sm mt-2 hover:underline">
            Add your first idea →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {active.map(idea => (
            <Link key={idea.id} href={`/os/ideas/${idea.id}`}>
              <Card hover className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white/90 font-medium truncate">{idea.title}</p>
                      {idea.game && (
                        <span className="text-white/25 text-xs flex-shrink-0">· {idea.game.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={idea.status} />
                      {idea.platforms.length > 0 && (
                        <span className="text-white/25 text-xs">
                          {idea.platforms.map(p => PLATFORM_LABELS[p]).join(', ')}
                        </span>
                      )}
                      <span className="text-white/15 text-xs">{formatDate(idea.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {idea.growth_score != null ? (
                      <div className="text-right">
                        <div className={`text-lg font-bold tabular-nums ${
                          idea.growth_score >= 80 ? 'text-emerald-400' :
                          idea.growth_score >= 60 ? 'text-yellow-400' :
                          idea.growth_score >= 40 ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {idea.growth_score}
                        </div>
                        <div className="text-white/20 text-[10px] uppercase tracking-wider">Score</div>
                      </div>
                    ) : (
                      <span className="text-white/20 text-xs">Not scored</span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
