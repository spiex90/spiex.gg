import type { DailyMetrics } from '../../lib/types';
import { formatNumber, formatDelta } from '../../lib/formatters';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../../lib/constants';
import { clsx } from 'clsx';

export default function TodayMetrics({ metrics }: { metrics: DailyMetrics[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map(m => {
        const positive = m.delta >= 0;
        return (
          <div
            key={m.platform}
            className="bg-[#0f0f14] border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                {PLATFORM_LABELS[m.platform]}
              </span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[m.platform] }}
              />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">
              {formatNumber(m.today)}
            </div>
            <div className={clsx('text-xs mt-1 font-medium', positive ? 'text-emerald-400' : 'text-red-400')}>
              {formatDelta(m.delta)} today
            </div>
          </div>
        );
      })}
    </div>
  );
}
