export const dynamic = 'force-dynamic';

import { listIdeas } from '../../lib/db/ideas';
import { Card, CardBody } from '../../components/primitives/Card';
import { StatusBadge } from '../../components/primitives/Badge';
import { PLATFORM_LABELS } from '../../lib/constants';
import { Zap, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default async function FactoryPage() {
  const ideas = await listIdeas().catch(() => []);
  const eligible = ideas.filter(i => !['archived', 'published'].includes(i.status));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">AI Content Factory</h1>
        <p className="text-white/30 text-sm mt-0.5">
          Select an idea from your vault to generate a full content package
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { step: '1', label: 'Pick an idea', desc: 'Choose from your Idea Vault' },
          { step: '2', label: 'Select formats', desc: 'IG, TikTok, YouTube, or all' },
          { step: '3', label: 'Generate & copy', desc: 'Bilingual content, instant' },
        ].map(s => (
          <div key={s.step} className="bg-[#0f0f14] border border-white/5 rounded-xl p-4 text-center">
            <div className="w-7 h-7 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-violet-400 font-bold text-sm">{s.step}</span>
            </div>
            <p className="text-white/70 text-sm font-medium">{s.label}</p>
            <p className="text-white/30 text-xs mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Idea list */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Choose an idea</p>
        {eligible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lightbulb size={32} className="text-white/15 mb-3" />
            <p className="text-white/30 text-sm">No ideas in vault</p>
            <Link href="/os/ideas/new" className="text-violet-400 text-sm mt-2 hover:underline">
              Add an idea first →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {eligible.map(idea => (
              <Link key={idea.id} href={`/os/ideas/${idea.id}`}>
                <Card hover className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-violet-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap size={14} className="text-violet-400/60" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/80 text-sm font-medium truncate">{idea.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {idea.platforms.map(p => (
                            <span key={p} className="text-white/25 text-xs">{PLATFORM_LABELS[p]}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {idea.growth_score != null && (
                        <span className="text-sm font-bold text-violet-400">{idea.growth_score}</span>
                      )}
                      <StatusBadge status={idea.status} />
                      <span className="text-violet-400 text-xs">Generate →</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
