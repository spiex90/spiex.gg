export const dynamic = 'force-dynamic';

import { getAllPlatformSnapshots, getGoals, getUnreadAlerts } from '../../lib/db/metrics';
import { FollowerChart } from '../../components/analytics/FollowerChart';
import { Card, CardHeader, CardBody } from '../../components/primitives/Card';
import { Badge } from '../../components/primitives/Badge';
import { formatNumber, formatDate } from '../../lib/formatters';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../../lib/constants';
import type { Platform } from '../../lib/types';

const PLATFORMS: Platform[] = ['instagram', 'tiktok', 'youtube', 'twitch'];

export default async function AnalyticsPage() {
  const [snapshots, goals, alerts] = await Promise.all([
    getAllPlatformSnapshots(30).catch(() => []),
    getGoals().catch(() => []),
    getUnreadAlerts(20).catch(() => []),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <p className="text-white/30 text-sm mt-0.5">30-day growth across all platforms</p>
      </div>

      {/* Follower Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PLATFORMS.map(platform => {
          const data = snapshots.filter(s => s.platform === platform);
          const latest = data[data.length - 1]?.follower_count ?? 0;
          const first = data[0]?.follower_count ?? latest;
          const gain = latest - first;

          return (
            <Card key={platform}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[platform] }} />
                    <span className="text-white/70 text-sm font-medium">{PLATFORM_LABELS[platform]}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold tabular-nums">{formatNumber(latest)}</div>
                    <div className={`text-xs ${gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {gain >= 0 ? '+' : ''}{formatNumber(gain)} (30d)
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-2">
                {data.length > 0 ? (
                  <FollowerChart
                    data={data.map(d => ({ date: d.date, value: d.follower_count }))}
                    color={PLATFORM_COLORS[platform]}
                  />
                ) : (
                  <div className="h-24 flex items-center justify-center">
                    <p className="text-white/20 text-sm">No data yet</p>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Goals */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-medium">Goals</span>
              <Badge variant="muted">{goals.length}</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {goals.map(goal => {
              const pct = Math.min(100, (goal.current_value / goal.target_value) * 100);
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-white/70 font-medium">{goal.title}</span>
                    <span className="text-white/40 tabular-nums">
                      {formatNumber(goal.current_value)} / {formatNumber(goal.target_value)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/25 mt-1">
                    <span>{Math.round(pct)}% complete</span>
                    {goal.deadline && <span>Due {formatDate(goal.deadline)}</span>}
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      )}

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-medium">Recent Alerts</span>
              <Badge variant="red">{alerts.filter(a => !a.read).length} unread</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 py-2 border-b border-white/3 last:border-0">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-400' :
                  alert.severity === 'warning' ? 'bg-yellow-400' : 'bg-violet-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-sm">{alert.title}</p>
                  {alert.message && <p className="text-white/30 text-xs mt-0.5 truncate">{alert.message}</p>}
                </div>
                <span className="text-white/20 text-xs flex-shrink-0">{formatDate(alert.created_at)}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
