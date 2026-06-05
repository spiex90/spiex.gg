export const dynamic = 'force-dynamic';

import { getGame } from '../../../lib/db/games';
import { GameAnalysisPanel } from '../../../components/games/GameAnalysisPanel';
import { GameSetCurrentButton } from '../../../components/games/GameSetCurrentButton';
import { StatusBadge } from '../../../components/primitives/Badge';
import { Card, CardHeader, CardBody } from '../../../components/primitives/Card';
import { ArrowLeft, Gamepad2, Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await getGame(parseInt(id));
  if (!game) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/os/games" className="text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-violet-600/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Gamepad2 size={16} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">{game.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={game.status} />
              {game.genre && <span className="text-white/25 text-xs">{game.genre}</span>}
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <GameSetCurrentButton gameId={game.id} isCurrent={game.is_current} />
          <Link
            href={`/os/ideas/new?game=${game.id}`}
            className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500
                       text-white text-xs font-medium rounded-xl transition-colors"
          >
            <Plus size={12} /> New Idea
          </Link>
        </div>
      </div>

      {/* Scores */}
      {(game.hype_score || game.arabic_audience_fit) && (
        <div className="grid grid-cols-2 gap-3">
          {game.hype_score && (
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-white">{game.hype_score}</div>
              <div className="text-white/30 text-xs mt-1 uppercase tracking-wider">Hype Score</div>
            </Card>
          )}
          {game.arabic_audience_fit && (
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-violet-400">{game.arabic_audience_fit}</div>
              <div className="text-white/30 text-xs mt-1 uppercase tracking-wider">Arab Audience Fit</div>
            </Card>
          )}
        </div>
      )}

      {/* Notes */}
      {game.notes && (
        <Card>
          <CardHeader>
            <span className="text-white/50 text-sm font-medium">Notes</span>
          </CardHeader>
          <CardBody>
            <p className="text-white/60 text-sm leading-relaxed">{game.notes}</p>
          </CardBody>
        </Card>
      )}

      {/* AI Analysis */}
      <GameAnalysisPanel game={game} />
    </div>
  );
}
