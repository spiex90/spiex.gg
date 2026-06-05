import 'server-only';
import { sb } from '../supabase';
import type { FollowerSnapshot, Goal, Alert, DailyMetrics, Platform } from '../types';

export async function getFollowerSnapshots(
  platform: Platform,
  days = 30,
): Promise<FollowerSnapshot[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await sb()
    .from('follower_snapshots')
    .select('*')
    .eq('platform', platform)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as FollowerSnapshot[];
}

export async function getAllPlatformSnapshots(days = 30): Promise<FollowerSnapshot[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await sb()
    .from('follower_snapshots')
    .select('*')
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as FollowerSnapshot[];
}

export async function getDailyMetrics(): Promise<DailyMetrics[]> {
  const platforms: Platform[] = ['instagram', 'youtube', 'twitch', 'tiktok'];
  const results: DailyMetrics[] = [];

  for (const platform of platforms) {
    const { data } = await sb()
      .from('follower_snapshots')
      .select('follower_count, date')
      .eq('platform', platform)
      .order('date', { ascending: false })
      .limit(2);

    if (!data || data.length === 0) {
      results.push({ platform, today: 0, yesterday: 0, delta: 0, delta_pct: 0 });
      continue;
    }

    const today = data[0]?.follower_count ?? 0;
    const yesterday = data[1]?.follower_count ?? today;
    const delta = today - yesterday;
    const delta_pct = yesterday > 0 ? (delta / yesterday) * 100 : 0;
    results.push({ platform, today, yesterday, delta, delta_pct });
  }

  return results;
}

export async function getGoals(): Promise<Goal[]> {
  const { data, error } = await sb()
    .from('goals')
    .select('*')
    .is('completed_at', null)
    .order('deadline', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as Goal[];
}

export async function getUnreadAlerts(limit = 10): Promise<Alert[]> {
  const { data, error } = await sb()
    .from('alerts')
    .select('*')
    .eq('read', false)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Alert[];
}

export async function markAlertRead(id: number): Promise<void> {
  await sb().from('alerts').update({ read: true }).eq('id', id);
}
