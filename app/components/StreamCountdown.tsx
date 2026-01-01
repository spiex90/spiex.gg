"use client";

import { useEffect, useMemo, useState } from "react";

const KUWAIT_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC+3 (no DST)
const STREAM_DAYS = new Set([1, 3, 5]); // Mon=1, Wed=3, Fri=5 (Sun=0)
const STREAM_HOUR = 19; // 7:00 PM
const STREAM_MIN = 0;

type NextStreamInfo = {
  nextUtcMs: number;
  label: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Build "Kuwait time" by shifting UTC and reading it via UTC getters (stable on all PCs)
function getNextStreamUtcMs(nowUtcMs: number): NextStreamInfo | null {
  const nowKuwaitPseudoMs = nowUtcMs + KUWAIT_OFFSET_MS;
  const nowKuwait = new Date(nowKuwaitPseudoMs);

  let bestUtcMs: number | null = null;
  let bestLabel = "";

  for (let addDays = 0; addDays <= 7; addDays++) {
    const d = new Date(nowKuwaitPseudoMs + addDays * 24 * 60 * 60 * 1000);

    const dow = d.getUTCDay(); // day in Kuwait pseudo-time
    if (!STREAM_DAYS.has(dow)) continue;

    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const day = d.getUTCDate();

    // Candidate time in Kuwait pseudo-time:
    const candidateKuwaitPseudoMs = Date.UTC(y, m, day, STREAM_HOUR, STREAM_MIN, 0);

    // Convert Kuwait pseudo-time back to real UTC time:
    const candidateUtcMs = candidateKuwaitPseudoMs - KUWAIT_OFFSET_MS;

    if (candidateUtcMs >= nowUtcMs && (bestUtcMs === null || candidateUtcMs < bestUtcMs)) {
      bestUtcMs = candidateUtcMs;

      const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      bestLabel = `${weekdayNames[dow]} 7:00 PM (Kuwait)`;
    }
  }

  if (bestUtcMs === null) return null;
  return { nextUtcMs: bestUtcMs, label: bestLabel };
}

function formatHMS(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function StreamCountdown({ isLive }: { isLive: boolean }) {
  const [nowUtcMs, setNowUtcMs] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowUtcMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => getNextStreamUtcMs(nowUtcMs), [nowUtcMs]);

  if (isLive) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm shadow-[0_0_60px_rgba(239,68,68,0.18)]">
        <div className="flex items-center justify-between">
          <span className="text-white/80">You are live now</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    );
  }

  if (!next) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <div className="text-white/60">Countdown unavailable</div>
      </div>
    );
  }

  const remainingMs = next.nextUtcMs - nowUtcMs;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_0_60px_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white/85">
          Next stream: {next.label}
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          OFFLINE
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-sm text-white/60">Starts in</span>
        <span className="text-3xl font-extrabold tracking-tight text-white">
          {formatHMS(remainingMs)}
        </span>
      </div>

      
    </div>
  );
}
