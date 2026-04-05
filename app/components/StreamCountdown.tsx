"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  isLive: boolean;
  scheduleText?: string;
  className?: string;
};

function getKuwaitNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuwait" }));
}

function getNextStreamDate(now: Date) {
  const streamDays = new Set([1, 3, 5]);
  const targetHour = 19;
  const targetMin = 0;

  for (let add = 0; add <= 7; add++) {
    const d = new Date(now);
    d.setDate(now.getDate() + add);
    if (streamDays.has(d.getDay())) {
      const t = new Date(d);
      t.setHours(targetHour, targetMin, 0, 0);
      if (t.getTime() > now.getTime()) return t;
    }
  }
  return null;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function StreamCountdown({ isLive, scheduleText, className }: Props) {
  const [now, setNow] = useState<Date>(() => getKuwaitNow());

  useEffect(() => {
    const id = setInterval(() => setNow(getKuwaitNow()), 1000);
    return () => clearInterval(id);
  }, []);

  const nextStream = useMemo(() => getNextStreamDate(now), [now]);

  const diffMs = nextStream ? nextStream.getTime() - now.getTime() : 0;
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;

  const minsUntil = Math.floor(totalSeconds / 60);
  const goingLiveSoon = !isLive && minsUntil <= 30;

  const nextLabel = nextStream
    ? nextStream.toLocaleString("en-US", {
        timeZone: "Asia/Kuwait",
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Next stream";

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-white/70 text-sm">
          <span className="font-bold text-white">Next stream:</span>{" "}
          {nextLabel} (Kuwait)
        </div>

        <span
          className={[
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1",
            goingLiveSoon
              ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/20"
              : isLive
              ? "bg-red-500/15 text-red-200 ring-red-500/20"
              : "bg-white/[0.06] text-white/50 ring-white/10",
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 rounded-full",
              goingLiveSoon
                ? "bg-emerald-300 live-dot"
                : isLive
                ? "bg-red-400 live-dot"
                : "bg-white/30",
            ].join(" ")}
          />
          {isLive ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      {!isLive && nextStream && (
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="text-xs text-white/40 uppercase tracking-wider">Starts in</div>
          <div className="font-mono text-3xl font-black tracking-wider text-white">
            <span className="text-red-500">{pad(hh)}</span>
            <span className="text-white/20 mx-0.5">:</span>
            <span className="text-white">{pad(mm)}</span>
            <span className="text-white/20 mx-0.5">:</span>
            <span className="text-red-400">{pad(ss)}</span>
          </div>
        </div>
      )}

      {scheduleText && (
        <div className="mt-3 text-xs text-white/40" dir="rtl">
          {scheduleText}
        </div>
      )}
    </div>
  );
}
