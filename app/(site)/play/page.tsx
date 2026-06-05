"use client";

import { useEffect, useState } from "react";

type McStatus = {
  online: boolean;
  host: string;
  port: number;
  version?: string;
  players?: { online?: number; max?: number; list?: string[] } | null;
  motd?: { clean?: string[]; raw?: string[] } | null;
  error?: string;
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="glass-card flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">{label}</div>
        <div className="truncate text-sm font-bold text-white mt-0.5">{value}</div>
      </div>
      <button
        onClick={copy}
        className={[
          "shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300",
          copied
            ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
            : "bg-white/[0.06] text-white/70 hover:bg-white/10 hover:text-white",
        ].join(" ")}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function PlayPage() {
  const [data, setData] = useState<McStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/minecraft/status", { cache: "no-store" });
        const json = (await res.json()) as McStatus;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ online: false, host: "play.spiex.gg", port: 25606, error: "status_unavailable" });
      }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const online = data?.online === true;
  const playersOnline = data?.players?.online ?? null;
  const playersMax = data?.players?.max ?? null;

  const javaAddress = "play.spiex.gg";
  const bedrockAddress = "play.spiex.gg";
  const bedrockPort = "25606";

  return (
    <div className="space-y-8 pt-4">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Minecraft — <span className="gradient-text">The HUB</span>
        </h1>
        <p className="mt-3 text-sm text-white/50">
          Join the official SPIEX community server. Java & Bedrock supported.
        </p>
      </header>

      {/* Status Card */}
      <div
        className={[
          "glass-card gradient-border p-5 transition-all duration-500",
          online ? "shadow-[0_0_60px_rgba(16,185,129,0.12)]" : "",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1",
                online
                  ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/20"
                  : "bg-white/[0.06] text-white/50 ring-white/10",
              ].join(" ")}
            >
              <span className={[
                "h-2 w-2 rounded-full",
                online ? "bg-emerald-300 live-dot" : "bg-white/30",
              ].join(" ")} />
              {data === null ? "CHECKING..." : online ? "ONLINE" : "OFFLINE"}
            </span>

            {online && typeof playersOnline === "number" && (
              <span className="text-xs text-white/50">
                <span className="font-bold text-white">{playersOnline}</span>
                {typeof playersMax === "number" ? ` / ${playersMax}` : ""} players
              </span>
            )}
          </div>

          {data?.version && (
            <span className="text-xs text-white/40">
              v<span className="text-white/60">{data.version}</span>
            </span>
          )}
        </div>

        {data?.motd?.clean?.[0] && (
          <div className="mt-3 text-sm text-white/60">
            <span className="text-white/30">MOTD:</span>{" "}
            <span className="text-white/70">{data.motd.clean.join(" ")}</span>
          </div>
        )}
      </div>

      {/* Copy Cards */}
      <div className="grid gap-3">
        <CopyRow label="Java Address" value={javaAddress} />
        <CopyRow label="Bedrock Address" value={bedrockAddress} />
        <CopyRow label="Bedrock Port" value={bedrockPort} />
      </div>

      {/* How to Join */}
      <div className="glass-card p-5 sm:p-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-400">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          How to Join
        </h2>

        <div className="mt-5 space-y-6 text-sm text-white/60">
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs text-white/70">PC</span>
              Java
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Open Minecraft → <span className="text-white/80">Multiplayer</span></li>
              <li>Click <span className="text-white/80">Add Server</span></li>
              <li>Server Address: <span className="font-bold text-white">{javaAddress}</span>
                <span className="text-white/40"> (if needed: :{bedrockPort})</span></li>
              <li>Click <span className="text-white/80">Done</span> → Join</li>
            </ol>
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs text-white/70">📱</span>
              Bedrock (Console / Mobile)
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Open Minecraft → <span className="text-white/80">Play</span></li>
              <li>Go to <span className="text-white/80">Servers</span> → Add Server</li>
              <li>Address: <span className="font-bold text-white">{bedrockAddress}</span></li>
              <li>Port: <span className="font-bold text-white">{bedrockPort}</span></li>
              <li>Save → Join</li>
            </ol>
          </div>
        </div>

        <div className="mt-5 text-xs text-white/40 glass-card p-3" dir="rtl">
          <span className="text-white/60 font-semibold">ملاحظة:</span>{" "}
          إذا ما ضبطت معاك، جرّب تكتب البورت (25606) مع السيرفر أو ادخل الديسكورد ونساعدك.
        </div>
      </div>
    </div>
  );
}
