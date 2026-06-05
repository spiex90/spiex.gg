export const dynamic = 'force-dynamic';

import { listGames } from '../../lib/db/games';
import { Card, CardBody } from '../../components/primitives/Card';
import { StatusBadge } from '../../components/primitives/Badge';
import { GameSetCurrentButton } from '../../components/games/GameSetCurrentButton';
import { Gamepad2, Plus, Zap } from 'lucide-react';
import Link from 'next/link';

export default async function GamesPage() {
  const games = await listGames().catch(() => []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Game Intelligence</h1>
          <p className="text-white/30 text-sm mt-0.5">Track your games and unlock AI-powered content opportunities</p>
        </div>
        <Link
          href="/os/games/new"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500
                     text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={14} /> Add Game
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Gamepad2 size={40} className="text-white/15 mb-4" />
          <p className="text-white/30 text-sm">No games yet</p>
          <Link href="/os/games/new" className="text-violet-400 text-sm mt-2 hover:underline">
            Add your first game →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {games.map(game => (
            <Card key={game.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    game.is_current ? 'bg-violet-600/20' : 'bg-white/5'
                  }`}>
                    <Gamepad2 size={18} className={game.is_current ? 'text-violet-400' : 'text-white/30'} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/os/games/${game.id}`} className="text-white/90 font-semibold hover:text-white transition-colors truncate">
                        {game.name}
                      </Link>
                      {game.is_current && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-400 text-[10px] font-semibold">
                          <span className="w-1 h-1 bg-violet-400 rounded-full animate-pulse" />
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={game.status} />
                      {game.genre && <span className="text-white/25 text-xs">{game.genre}</span>}
                      {game.hype_score && (
                        <span className="text-white/25 text-xs">Hype: {game.hype_score}/100</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/os/games/${game.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600/10
                               text-violet-400 hover:bg-violet-600/20 text-xs transition-colors"
                  >
                    <Zap size={11} /> AI Intel
                  </Link>
                  <GameSetCurrentButton gameId={game.id} isCurrent={game.is_current} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
