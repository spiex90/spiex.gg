import { sb } from '../../lib/supabase';
import { Card, CardBody } from '../../components/primitives/Card';
import { Badge } from '../../components/primitives/Badge';
import { formatDate, formatNumber } from '../../lib/formatters';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../../lib/constants';
import { Trophy, Plus } from 'lucide-react';
import type { Win } from '../../lib/types';

async function listWins(): Promise<Win[]> {
  const { data, error } = await sb()
    .from('os_wins')
    .select('*')
    .order('occurred_on', { ascending: false })
    .limit(50);
  if (error) return [];
  return data as Win[];
}

export default async function WinsPage() {
  const wins = await listWins().catch(() => []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Win Database</h1>
          <p className="text-white/30 text-sm mt-0.5">Every milestone tracked for learning</p>
        </div>
      </div>

      {wins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trophy size={40} className="text-white/15 mb-4" />
          <p className="text-white/30 text-sm">No wins logged yet</p>
          <p className="text-white/15 text-xs mt-1">Wins will appear here when tracked</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wins.map(win => (
            <Card key={win.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${PLATFORM_COLORS[win.platform] ?? '#7c3aed'}20` }}
                >
                  <Trophy size={16} style={{ color: PLATFORM_COLORS[win.platform] ?? '#7c3aed' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white/90 font-medium">{win.title}</p>
                    <Badge variant="muted">{PLATFORM_LABELS[win.platform] ?? win.platform}</Badge>
                  </div>
                  {win.description && (
                    <p className="text-white/40 text-sm mt-0.5">{win.description}</p>
                  )}
                  {win.metric_value && (
                    <p className="text-emerald-400 text-sm font-bold mt-1">
                      {formatNumber(win.metric_value)} {win.metric_type}
                    </p>
                  )}
                  {win.lessons && (
                    <p className="text-white/30 text-xs mt-2 italic">Lesson: {win.lessons}</p>
                  )}
                </div>
                {win.occurred_on && (
                  <span className="text-white/25 text-xs flex-shrink-0">{formatDate(win.occurred_on)}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
