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

function CopyRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {}
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold text-white/60">{label}</div>
        <div className="truncate text-sm font-semibold text-white">{value}</div>
      </div>
      <button
        onClick={copy}
        className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/15"
      >
        Copy
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
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const online = data?.online === true;
  const playersOnline = data?.players?.online ?? null;
  const playersMax = data?.players?.max ?? null;

  const javaAddress = "play.spiex.gg";
  const bedrockAddress = "play.spiex.gg";
  const bedrockPort = "25606";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Minecraft — The HUB</h1>
        <p className="mt-2 text-sm text-white/70">
          Join the official SPIEX community server. Java & Bedrock supported.
        </p>
      </header>

      {/* STATUS CARD */}
      <div
        className={[
          "rounded-2xl border px-4 py-4",
          online
            ? "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_60px_rgba(16,185,129,0.18)]"
            : "border-white/10 bg-white/5",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                online ? "bg-emerald-500/15 text-emerald-200" : "bg-white/10 text-white/70",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  online ? "bg-emerald-300 animate-pulse" : "bg-white/40",
                ].join(" ")}
              />
              {online ? "ONLINE" : "OFFLINE"}
            </span>

            {online && (
              <span className="text-xs text-white/70">
                {typeof playersOnline === "number" ? (
                  <>
                    Players: <span className="font-semibold text-white">{playersOnline}</span>
                    {typeof playersMax === "number" ? ` / ${playersMax}` : ""}
                  </>
                ) : (
                  "Server is up."
                )}
              </span>
            )}
          </div>

          <div className="text-xs text-white/60">
            {data?.version ? (
              <>
                Version: <span className="text-white/80">{data.version}</span>
              </>
            ) : (
              <span className="text-white/40">Status updates every 60s</span>
            )}
          </div>
        </div>

        {data?.motd?.clean?.[0] && (
          <div className="mt-3 text-sm text-white/70">
            <span className="text-white/50">MOTD:</span>{" "}
            <span className="text-white/80">{data.motd.clean.join(" ")}</span>
          </div>
        )}
      </div>

      {/* COPY CARDS */}
      <div className="grid gap-3">
        <CopyRow label="Java Address" value={javaAddress} />
        <CopyRow label="Bedrock Address" value={bedrockAddress} />
        <CopyRow label="Bedrock Port" value={bedrockPort} />
      </div>

      {/* HOW TO JOIN */}
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        <h2 className="text-lg font-bold">How to Join</h2>

        <div className="mt-3 space-y-4 text-sm text-white/70">
          <div>
            <div className="font-semibold text-white">Java (PC)</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Open Minecraft → <span className="text-white">Multiplayer</span></li>
              <li>Click <span className="text-white">Add Server</span></li>
              <li>
                Server Address: <span className="text-white font-semibold">{javaAddress}</span>
                <span className="text-white/60"> (if needed: :{bedrockPort})</span>
              </li>
              <li>Click <span className="text-white">Done</span> → Join</li>
            </ol>
          </div>

          <div>
            <div className="font-semibold text-white">Bedrock (Console / Mobile)</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Open Minecraft → <span className="text-white">Play</span></li>
              <li>Go to <span className="text-white">Servers</span> → Add Server</li>
              <li>
                Address: <span className="text-white font-semibold">{bedrockAddress}</span>
              </li>
              <li>
                Port: <span className="text-white font-semibold">{bedrockPort}</span>
              </li>
              <li>Save → Join</li>
            </ol>
          </div>

          <div className="text-xs text-white/50" dir="rtl">
            <span className="text-white/70 font-semibold">ملاحظة:</span>{" "}
            إذا ما ضبطت معاك، جرّب تكتب البورت (25606) مع السيرفر أو ادخل الديسكورد ونساعدك.
          </div>
        </div>
      </div>
    </div>
  );
}
