"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  isLive: boolean;
  scheduleText?: string;
  className?: string;
};

const KUWAIT_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC+3
const STREAM_DAYS = new Set([1, 3, 5]); // Mon/Wed/Fri (in Kuwait)
const STREAM_HOUR = 19; // 7:00 PM
const STREAM_MIN = 0;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function nowKuwaitMs() {
  // "Kuwait time" represented in a UTC-based ms value by shifting UTC now by +3h
  return Date.now() + KUWAIT_OFFSET_MS;
}

function getNextStreamKuwaitMs(nowKwMs: number) {
  // Work in "Kuwait-ms space" and use UTC getters so local machine timezone never matters
  const now = new Date(nowKwMs);
  const startDay = now.getUTCDate();

  for (let add = 0; add <= 7; add++) {
    const d = new Date(nowKwMs);
    d.setUTCDate(startDay + add);

    const dow = d.getUTCDay();
    if (!STREAM_DAYS.has(dow)) continue;

    const t = new Date(d);
    t.setUTCHours(STREAM_HOUR, STREAM_MIN, 0, 0);

    if (t.getTime() > nowKwMs) return t.getTime();
    if (t.getTime() === nowKwMs) return t.getTime();
  }

  // fallback (shouldn't happen)
  const f = new Date(nowKwMs);
  f.setUTCDate(f.getUTCDate() + 1);
  f.setUTCHours(STREAM_HOUR, STREAM_MIN, 0, 0);
  return f.getTime();
}

function formatHMS(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatNextLabel(nextKwMs: number) {
  const d = new Date(nextKwMs);
  const dow = WEEKDAYS[d.getUTCDay()];
  // Always 7:00 PM Kuwait, but keep it explicit:
  return `${dow} 7:00 PM`;
}

export default function StreamCountdown({ isLive, scheduleText }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (isLive) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [isLive]);

  const { nextLabel, secondsLeft, goingLiveSoon } = useMemo(() => {
    const nowMs = nowKuwaitMs();
    const nextMs = getNextStreamKuwaitMs(nowMs);
    const diffSec = Math.ceil((nextMs - nowMs) / 1000);

    return {
      nextLabel: formatNextLabel(nextMs),
      secondsLeft: diffSec,
      goingLiveSoon: diffSec > 0 && diffSec <= 30 * 60, // 30 min
    };
  }, [tick, isLive]);

  if (isLive) return null;

  const boxClass = [
  "rounded-2xl border p-4 transition",
  goingLiveSoon
    ? "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_60px_rgba(16,185,129,0.18)]"
    : "border-white/10 bg-white/5",
  className ?? "",
].join(" ");


  return (
    <div className={boxClass}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-white/80">
          <span className="font-semibold text-white">Next stream:</span>{" "}
          {nextLabel} <span className="text-white/50">(Kuwait)</span>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          OFFLINE
        </span>
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="text-xs text-white/50">
            {goingLiveSoon ? "Going live soon" : "Starts in"}
          </div>
          <div className="mt-1 text-3xl font-extrabold tracking-tight">
            {formatHMS(secondsLeft)}
          </div>
        </div>

        {scheduleText ? (
          <div className="text-xs text-white/60" dir="rtl">
            {scheduleText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
