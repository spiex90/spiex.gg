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
    const id = setInterval(load, 90_000); // every 90s
    return () => clearInterval(id);
  }, []);

  const isLive = data.live === true;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                isLive
                  ? "bg-red-500/15 text-red-200 ring-1 ring-red-500/30"
                  : "bg-white/10 text-white/70 ring-1 ring-white/10",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  isLive ? "bg-red-400 animate-pulseGlow" : "bg-white/40",
                ].join(" ")}
              />
              {loading ? "CHECKING…" : isLive ? "LIVE NOW" : "OFFLINE"}
            </span>

            {isLive && typeof data.viewers === "number" && (
              <span className="text-xs text-white/60">{data.viewers} watching</span>
            )}
          </div>

          <h3 className="mt-3 text-lg font-semibold text-white">
            {isLive ? "Spiex is live on Twitch" : "Next streams"}
          </h3>

          <p className="mt-1 text-sm text-white/70">
            {isLive
              ? `${data.game ? `${data.game} · ` : ""}${data.title ?? "Live now"}`
              : "Mon / Wed / Fri — 7:00 PM (Kuwait) · Join Discord for alerts"}
          </p>

          {!isLive && data.error && (
            <p className="mt-2 text-xs text-white/40">(Live check note: {data.error})</p>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <a
            href="https://live.spiex.gg"
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold text-center",
              isLive
                ? "bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.25)] hover:bg-red-500/90"
                : "bg-white/10 text-white hover:bg-white/15",
            ].join(" ")}
          >
            {isLive ? "WATCH LIVE" : "GO TO TWITCH"}
          </a>

          <a
            href="https://discord.spiex.gg"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-center text-white hover:bg-white/15"
          >
            DISCORD
          </a>
        </div>
      </div>
    </div>
  );
}
