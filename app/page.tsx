"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SITE } from "./lib/site";
import StreamCountdown from "./components/StreamCountdown";

type LiveApiResponse = {
  live: boolean;
  title?: string;
  game_name?: string;
  viewer_count?: number;
  error?: string;
};

function getKuwaitNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuwait" }));
}

function minutesUntilNextStream(now: Date) {
  const streamDays = new Set([1, 3, 5]); // Mon, Wed, Fri
  const targetHour = 19; // 7:00 PM
  const targetMin = 0;

  const candidates: Date[] = [];

  for (let add = 0; add <= 7; add++) {
    const d = new Date(now);
    d.setDate(now.getDate() + add);
    const dow = d.getDay();

    if (streamDays.has(dow)) {
      const t = new Date(d);
      t.setHours(targetHour, targetMin, 0, 0);
      if (t.getTime() >= now.getTime()) candidates.push(t);
    }
  }

  if (candidates.length === 0) return null;
  const next = candidates.sort((a, b) => a.getTime() - b.getTime())[0];
  return Math.round((next.getTime() - now.getTime()) / 60000);
}

export default function Home() {
  const [status, setStatus] = useState<LiveApiResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/twitch/live", { cache: "no-store" });
        const data = (await res.json()) as LiveApiResponse;
        if (!cancelled) setStatus(data);
      } catch {
        if (!cancelled) setStatus({ live: false, error: "status_unavailable" });
      }
    }

    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const isLive = status?.live === true;

  const soonMins = useMemo(() => {
    if (isLive) return null;
    return minutesUntilNextStream(getKuwaitNow());
  }, [isLive]);

  const goingLiveSoon = !isLive && soonMins !== null && soonMins <= 30;

  const statusBoxClass = [
    "mt-4 rounded-2xl border px-4 py-3 text-sm transition",
    isLive
      ? "border-red-500/30 bg-red-500/10 shadow-[0_0_60px_rgba(239,68,68,0.25)]"
      : goingLiveSoon
      ? "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_60px_rgba(16,185,129,0.18)]"
      : "border-white/10 bg-white/5",
  ].join(" ");

  return (
    <>
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black">
            <Image
              src="/images/logo.png"
              alt="SPIEX logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">{SITE.brand}</h1>
            <p className="text-sm text-white/70">
              {SITE.tagline_en} · {SITE.tagline_ar}
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-[160px,1fr] sm:items-center">
          <div className="relative h-40 w-40 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <Image
              src="/images/spiex.png"
              alt="SPIEX (Kuwait Twitch Partner)"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Kuwait-based Twitch Partner & Variety Gamer
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/70">
              I’m Fawaz <span className="text-white font-semibold">(SPIEX)</span>, a Kuwait-based{" "}
              <span className="text-white font-semibold">Twitch Partner</span> and variety streamer.
              I focus on high-energy live streams, community-first gameplay, and content built around
              action games, co-op sessions, and challenge runs — mixing Arabic and English vibes.
            </p>

            <p className="mt-3 text-sm leading-6 text-white/70">
              This is my official hub for Twitch and Discord.
            </p>

            <p className="mt-4 text-sm leading-7 text-white/70" dir="rtl">
              أنا <span className="text-white font-semibold">(سبايكس) فواز</span>،
              ستريمر تويتش رسمي من الكويت.
              أقدّم بثوث متنوعة مليئة بالطاقة وتفاعل قوي مع المجتمع،
              وألعاب تشمل الأكشن، التحديات، واللعب الجماعي.
              <br />
              <br />
              هذا الموقع هو المكان الرسمي لكل شيء يخص البث المباشر والديسكورد
              — تجربة تجمع اللاعبين والمجتمع في مكان واحد.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href={SITE.urls.live}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(239,68,68,0.18)] hover:bg-red-500/90"
              >
                WATCH LIVE
              </a>

              <a
                href={SITE.urls.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/15"
              >
                JOIN DISCORD
              </a>

              <Link
                href="/links"
                className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/15"
              >
                ALL LINKS
              </Link>

              <Link
                href="/play"
                className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/15"
              >
                MINECRAFT
              </Link>
            </div>

            {/* STATUS BOX */}
            <div className={statusBoxClass}>
              {status === null ? (
                <span className="text-white/50">Checking stream status…</span>
              ) : isLive ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
                    <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                    LIVE NOW
                  </span>

                  <span className="text-white/80">
                    {status.title ? (
                      <>
                        <span className="font-semibold text-white">{status.title}</span>
                        {status.game_name ? ` · ${status.game_name}` : ""}
                        {typeof status.viewer_count === "number"
                          ? ` · ${status.viewer_count} watching`
                          : ""}
                      </>
                    ) : (
                      "I’m live on Twitch."
                    )}
                  </span>
                </div>
              ) : goingLiveSoon ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                      GOING LIVE SOON
                    </span>

                    <span className="text-white/80">
                      Stream starts in{" "}
                      <span className="font-semibold text-white">{soonMins}</span> min —{" "}
                      <span className="font-semibold text-white">{SITE.schedule}</span>
                    </span>
                  </div>

                  <div className="text-xs text-white/60" dir="rtl">
                    البث:{" "}
                    <span className="text-white">
                      الإثنين / الأربعاء / الجمعة — 7:00 مساءً (الكويت)
                    </span>
                  </div>
                </div>
              ) : (
                <>
             {/* ✅ OFFLINE = SHOW COUNTDOWN */}
<StreamCountdown
  isLive={isLive}
  className="mt-1"
  scheduleText="الإثنين / الأربعاء / الجمعة — 7:00 مساءً (الكويت)"
/>

<div className="mt-2 text-xs text-white/60" dir="rtl">
  البث:{" "}
  <span className="text-white">
    الإثنين / الأربعاء / الجمعة — 7:00 مساءً (الكويت)
  </span>
</div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
