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
  // Mon/Wed/Fri at 7:00 PM Kuwait time
  const streamDays = new Set([1, 3, 5]); // Mon=1, Wed=3, Fri=5
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

export default function StreamCountdown({
  isLive,
  scheduleText,
  className,
}: Props) {
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

  const boxClass = [
    "rounded-2xl border px-4 py-3 text-sm transition",
    isLive
      ? "border-red-500/30 bg-red-500/10 shadow-[0_0_60px_rgba(239,68,68,0.25)]"
      : goingLiveSoon
      ? "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_60px_rgba(16,185,129,0.18)]"
      : "border-white/10 bg-white/5",
    className ?? "",
  ].join(" ");

  return (
    <div className={boxClass}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-white/80">
          <span className="font-semibold text-white">Next stream:</span>{" "}
          {nextLabel} (Kuwait)
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          {isLive ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      {!isLive && nextStream && (
        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="text-white/60">Starts in</div>
          <div className="font-mono text-2xl font-bold tracking-wider text-white">
            {pad(hh)}:{pad(mm)}:{pad(ss)}
          </div>
        </div>
      )}

      {scheduleText && (
        <div className="mt-2 text-xs text-white/60" dir="rtl">
          {scheduleText}
        </div>
      )}
    </div>
  );
}
