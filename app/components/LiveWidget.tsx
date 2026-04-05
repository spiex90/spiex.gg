"use client";

import { useEffect, useState } from "react";

type LiveData =
  | { live: false; username?: string; error?: string }
  | {
      live: true;
      username: string;
      title?: string;
      game?: string;
      viewers?: number;
    };

export default function LiveWidget() {
  const [data, setData] = useState<LiveData>({ live: false });
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/twitch/live", { cache: "no-store" });
      const json = (await res.json()) as LiveData;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 90_000);
    return () => clearInterval(id);
  }, []);

  const isLive = data.live === true;

  return (
    <div className={[
      "glass-card gradient-border p-5 transition-all duration-500",
      isLive ? "shadow-[0_0_60px_rgba(239,68,68,0.12)]" : "",
    ].join(" ")}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1",
                isLive
                  ? "bg-red-500/15 text-red-200 ring-red-500/20"
                  : "bg-white/[0.06] text-white/50 ring-white/10",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  isLive ? "bg-red-400 live-dot" : "bg-white/30",
                ].join(" ")}
              />
              {loading ? "CHECKING..." : isLive ? "LIVE NOW" : "OFFLINE"}
            </span>

            {isLive && typeof data.viewers === "number" && (
              <span className="text-xs text-white/50">{data.viewers.toLocaleString()} watching</span>
            )}
          </div>

          <h3 className="mt-3 text-lg font-bold text-white">
            {isLive ? "Spiex is live on Twitch" : "Next streams"}
          </h3>

          <p className="mt-1 text-sm text-white/60">
            {isLive
              ? `${data.game ? `${data.game} · ` : ""}${data.title ?? "Live now"}`
              : "Mon / Wed / Fri — 7:00 PM (Kuwait) · Join Discord for alerts"}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <a
            href="https://live.spiex.gg"
            target="_blank"
            rel="noopener noreferrer"
            className={isLive ? "btn-primary text-xs py-2 px-4" : "btn-secondary text-xs py-2 px-4"}
          >
            {isLive ? "WATCH" : "TWITCH"}
          </a>
          <a
            href="https://discord.spiex.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs py-2 px-4"
          >
            DISCORD
          </a>
        </div>
      </div>
    </div>
  );
}
