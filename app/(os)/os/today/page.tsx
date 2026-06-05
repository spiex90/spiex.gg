import { getDailyMetrics, getUnreadAlerts } from '../../lib/db/metrics';
import { listIdeas } from '../../lib/db/ideas';
import { getCurrentGame } from '../../lib/db/games';
import TodayMetrics from '../../components/today/TodayMetrics';
import AIRecommendation from '../../components/today/AIRecommendation';
import { Badge, StatusBadge } from '../../components/primitives/Badge';
import { Card, CardHeader, CardBody } from '../../components/primitives/Card';
import { formatDate, scoreBg } from '../../lib/formatters';
import { Bell, Gamepad2, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PLATFORM_LABELS } from '../../lib/constants';

export default async function TodayPage() {
  const [metrics, alerts, ideas, currentGame] = await Promise.all([
    getDailyMetrics().catch(() => []),
    getUnreadAlerts(5).catch(() => []),
    listIdeas().catch(() => []),
    getCurrentGame().catch(() => null),
  ]);

  const topIdeas = ideas.filter(i => i.status !== 'archived').slice(0, 5);
  const pendingIdeas = ideas.filter(i => i.status === 'inbox' || i.status === 'scored').slice(0, 3);

  const recPayload = {
    topIdeas: topIdeas.map(i => ({
      title: i.title,
      growth_score: i.growth_score,
      status: i.status,
    })),
    metrics: metrics.map(m => ({
      platform: m.platform,
      today: m.today,
      delta: m.delta,
    })),
    alerts: alerts.map(a => ({ title: a.title, severity: a.severity })),
    currentGame: currentGame?.name ?? null,
  };

  const kuwaitHour = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kuwait',
    hour: 'numeric',
    hour12: false,
  });
  const hourNum = parseInt(kuwaitHour);
  const greeting =
    hourNum < 12 ? 'Good morning' :
    hourNum < 17 ? 'Good afternoon' :
    'Good evening';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting}, <span className="text-violet-400">Fawaz</span>
        </h1>
        <p className="text-white/30 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
          })} · {currentGame ? (
            <span className="text-violet-300">Currently playing: {currentGame.name}</span>
          ) : (
            <span>No active game — <Link href="/os/games" className="text-violet-400 hover:underline">set one</Link></span>
          )}
        </p>
      </div>

      {/* Metrics */}
      <TodayMetrics metrics={metrics} />

      {/* AI Recommendation */}
      <AIRecommendation payload={recPayload} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-white/40" />
                <span className="text-white/70 text-sm font-medium">Alerts</span>
              </div>
              {alerts.length > 0 && (
                <Badge variant="red">{alerts.length} unread</Badge>
              )}
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {alerts.length === 0 ? (
              <p className="text-white/20 text-sm">All clear. No alerts.</p>
            ) : (
              alerts.map(a => (
                <div key={a.id} className="flex items-start gap-3 py-2 border-b border-white/3 last:border-0">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    a.severity === 'critical' ? 'bg-red-400' :
                    a.severity === 'warning' ? 'bg-yellow-400' : 'bg-violet-400'
                  }`} />
                  <div>
                    <p className="text-white/70 text-sm">{a.title}</p>
                    {a.message && <p className="text-white/30 text-xs mt-0.5">{a.message}</p>}
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Top Ideas Ready */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm font-medium">Idea Vault</span>
                <Badge variant="muted">{ideas.length} total</Badge>
              </div>
              <Link href="/os/ideas/new" className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs transition-colors">
                <Plus size={12} /> New
              </Link>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {pendingIdeas.length === 0 ? (
              <p className="text-white/20 text-sm">
                Vault empty. <Link href="/os/ideas/new" className="text-violet-400">Add an idea →</Link>
              </p>
            ) : (
              pendingIdeas.map(idea => (
                <Link
                  key={idea.id}
                  href={`/os/ideas/${idea.id}`}
                  className="flex items-center justify-between py-2 border-b border-white/3 last:border-0 hover:opacity-80 transition-opacity"
                >
                  <div>
                    <p className="text-white/70 text-sm font-medium truncate max-w-[180px]">{idea.title}</p>
                    <p className="text-white/25 text-xs mt-0.5">{idea.platforms.map(p => PLATFORM_LABELS[p]).join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {idea.growth_score && (
                      <span className={`text-xs font-bold ${scoreBg(idea.growth_score)} px-2 py-0.5 rounded`}>
                        {idea.growth_score}
                      </span>
                    )}
                    <StatusBadge status={idea.status} />
                  </div>
                </Link>
              ))
            )}
            {ideas.length > 3 && (
              <Link href="/os/ideas" className="flex items-center gap-1 text-white/30 hover:text-white/60 text-xs transition-colors pt-1">
                View all {ideas.length} ideas <ArrowRight size={11} />
              </Link>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Current Game Quick Actions */}
      {currentGame ? (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600/15 rounded-xl flex items-center justify-center">
                <Gamepad2 size={18} className="text-violet-400" />
              </div>
              <div>
                <p className="text-white/90 font-semibold">{currentGame.name}</p>
                <p className="text-white/30 text-xs">Current active game</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/os/games/${currentGame.id}`}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white/80 text-xs transition-colors"
              >
                Game Intel
              </Link>
              <Link
                href="/os/ideas/new"
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors"
              >
                New Idea
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Link
          href="/os/games/new"
          className="block bg-[#0f0f14] border border-dashed border-white/10 rounded-xl p-5 text-center
                     hover:border-violet-500/30 transition-colors group"
        >
          <Gamepad2 size={24} className="text-white/20 mx-auto mb-2 group-hover:text-violet-400 transition-colors" />
          <p className="text-white/40 text-sm">Set your current game to unlock game-specific content</p>
          <p className="text-violet-400 text-xs mt-1">+ Add game →</p>
        </Link>
      )}
    </div>
  );
}
