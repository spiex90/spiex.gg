"use client";

import { useEffect, useMemo, useState } from "react";

type Countdown = {
  target: Date;
  label: string; // e.g. "Mon 7:00 PM (Kuwait)"
  ms: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Kuwait is UTC+3. We’ll calculate the next stream time based on Kuwait local time,
// then convert it to a real Date() in the user's browser.
function getNextStreamKuwait(): Countdown {
  const now = new Date();

  // Convert "now" to Kuwait time fields using Intl
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuwait",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = fmt.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;

  const year = Number(get("year"));
  const month = Number(get("month")); // 1-12
  const day = Number(get("day"));     // 1-31
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const second = Number(get("second"));
  const weekday = get("weekday") ?? ""; // "Mon" etc

  // Map weekday short -> 0..6 (Sun..Sat)
  const wMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  // Current Kuwait weekday number
  const kuwaitWeekday = wMap[weekday] ?? 0;

  // Streams: Mon(1), Wed(3), Fri(5) at 19:00
  const streamDays = [1, 3, 5];
  const streamHour = 19;
  const streamMinute = 0;

  // Helper: build a Date in Kuwait timezone by using UTC math.
  // Kuwait is UTC+3, so "Kuwait 19:00" == UTC 16:00.
  const kuwaitToUTCDate = (y: number, m: number, d: number, h: number, min: number) => {
    // Create UTC date for Kuwait local time minus 3 hours
    return new Date(Date.UTC(y, m - 1, d, h - 3, min, 0));
  };

  // Determine how many days until next stream day/time
  const nowMinutes = hour * 60 + minute;
  const streamMinutes = streamHour * 60 + streamMinute;

  let bestDeltaDays: number | null = null;

  for (const sd of streamDays) {
    let delta = sd - kuwaitWeekday;
    if (delta < 0) delta += 7;

    // If it's the same day, but time already passed, push to next week
    if (delta === 0 && nowMinutes >= streamMinutes) delta = 7;

    if (bestDeltaDays === null || delta < bestDeltaDays) bestDeltaDays = delta;
  }

  const deltaDays = bestDeltaDays ?? 0;

  // Kuwait date (year/month/day) + deltaDays at 19:00 Kuwait
  // We can safely add deltaDays using a UTC date base at Kuwait midnight.
  const baseUTC = kuwaitToUTCDate(year, month, day, 0, 0); // Kuwait 00:00 -> UTC previous day 21:00
  const targetUTC = new Date(baseUTC.getTime() + deltaDays * 24 * 60 * 60 * 1000);
  // Set target to Kuwait 19:00 (UTC 16:00)
  targetUTC.setUTCHours(16, 0, 0, 0);

  // Label it nicely
  const labelFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuwait",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const label = `${labelFmt.format(targetUTC)} (Kuwait)`;

  return { target: targetUTC, label, ms: targetUTC.getTime() - now.getTime() };
}

export default function StreamCountdown({ className }: { className?: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => getNextStreamKuwait(), [now]);

  const ms = Math.max(0, next.ms);
  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/5 px-4 py-3",
        "shadow-[0_0_30px_rgba(0,0,0,0.35)]",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold text-white/70">
          Next stream: <span className="text-white/90">{next.label}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold text-white/80">
            <span className="h-2 w-2 rounded-full bg-white/40" />
            OFFLINE
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <div className="text-sm text-white/60">Starts in</div>
        <div className="text-2xl font-extrabold tracking-tight">
          {days > 0 ? `${days}d ` : ""}
          {pad(hours)}:{pad(mins)}:{pad(secs)}
        </div>
      </div>
    </div>
  );
}
