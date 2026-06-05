"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SITE } from "@/app/lib/site";
import StreamCountdown from "@/app/components/StreamCountdown";
import ScrollReveal from "@/app/components/ScrollReveal";

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
  const streamDays = new Set([1, 3, 5]);
  const targetHour = 19;
  const targetMin = 0;
  const candidates: Date[] = [];

  for (let add = 0; add <= 7; add++) {
    const d = new Date(now);
    d.setDate(now.getDate() + add);
    if (streamDays.has(d.getDay())) {
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
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const isLive = status?.live === true;

  const soonMins = useMemo(() => {
    if (isLive) return null;
    return minutesUntilNextStream(getKuwaitNow());
  }, [isLive]);

  const goingLiveSoon = !isLive && soonMins !== null && soonMins <= 30;

  return (
    <div className="space-y-16">
      {/* ═══ HERO ═══ */}
      <header className="pt-8 sm:pt-16">
        <ScrollReveal variant="scale">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className={[
                  "relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-3xl ring-2 transition-all duration-500",
                  isLive
                    ? "ring-red-500/50 shadow-[0_0_80px_rgba(239,68,68,0.3)]"
                    : "ring-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)]",
                ].join(" ")}
              >
                <Image
                  src="/images/spiex.png"
                  alt="SPIEX"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-[2rem] border border-white/[0.04] pointer-events-none" />
              <div className="absolute -inset-6 rounded-[2.5rem] border border-white/[0.02] pointer-events-none" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="text-center">
            {/* Glitch title */}
            <h1
              className="glitch text-5xl sm:text-7xl font-black tracking-tighter text-glow-red"
              data-text="SPIEX"
            >
              SPIEX
            </h1>

            <p className="mt-4 text-sm sm:text-base font-medium text-white/50 tracking-wide">
              {SITE.tagline_en}{" "}
              <span className="text-white/30">·</span>{" "}
              <span className="text-white/40">{SITE.tagline_ar}</span>
            </p>
          </div>
        </ScrollReveal>

        {/* CTA buttons */}
        <ScrollReveal delay={200}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={SITE.urls.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z" />
              </svg>
              WATCH LIVE
            </a>

            <a
              href={SITE.urls.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.36-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
              JOIN DISCORD
            </a>

            <Link href="/links" className="btn-secondary">
              ALL LINKS
            </Link>
          </div>
        </ScrollReveal>
      </header>

      {/* ═══ LIVE STATUS ═══ */}
      <ScrollReveal>
        <div
          className={[
            "glass-card gradient-border p-5 sm:p-6 transition-all duration-500",
            isLive ? "shadow-[0_0_80px_rgba(239,68,68,0.15)]" : "",
            goingLiveSoon ? "shadow-[0_0_80px_rgba(16,185,129,0.12)]" : "",
          ].join(" ")}
        >
          {status === null ? (
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-white/20 animate-pulse" />
              <span className="text-sm text-white/40">Checking stream status...</span>
            </div>
          ) : isLive ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3.5 py-1.5 text-xs font-bold text-red-300 ring-1 ring-red-500/20">
                  <span className="h-2 w-2 rounded-full bg-red-400 live-dot" />
                  LIVE NOW
                </span>
                {typeof status.viewer_count === "number" && (
                  <span className="text-xs text-white/50">{status.viewer_count.toLocaleString()} watching</span>
                )}
              </div>
              <div className="text-white/80">
                {status.title && <span className="font-semibold text-white">{status.title}</span>}
                {status.game_name && <span className="text-white/50"> · {status.game_name}</span>}
              </div>
              <a
                href={SITE.urls.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2 px-4 inline-flex"
              >
                Join Stream →
              </a>
            </div>
          ) : goingLiveSoon ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold text-emerald-200 ring-1 ring-emerald-500/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 live-dot" />
                  GOING LIVE SOON
                </span>
                <span className="text-sm text-white/70">
                  in <span className="font-bold text-white">{soonMins}</span> min
                </span>
              </div>
              <p className="text-xs text-white/40">{SITE.schedule}</p>
              <div className="text-xs text-white/50" dir="rtl">
                البث: <span className="text-white/70">الإثنين / الأربعاء / الجمعة — 7:00 مساءً (الكويت)</span>
              </div>
            </div>
          ) : (
            <StreamCountdown
              isLive={isLive}
              scheduleText="الإثنين / الأربعاء / الجمعة — 7:00 مساءً (الكويت)"
            />
          )}
        </div>
      </ScrollReveal>

      {/* ═══ ABOUT ═══ */}
      <section>
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              About <span className="gradient-text">SPIEX</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2">
          <ScrollReveal variant="left">
            <div className="glass-card p-6 h-full">
              <p className="text-sm leading-7 text-white/70">
                I&apos;m Fawaz{" "}
                <span className="font-bold text-white">(SPIEX)</span>, a Kuwait-based{" "}
                <span className="font-bold text-white">Twitch Partner</span> and variety
                streamer. I focus on high-energy live streams, community-first gameplay,
                and content built around action games, co-op sessions, and challenge runs
                — mixing Arabic and English vibes.
              </p>
              <p className="mt-4 text-sm text-white/50">
                This is my official hub for everything Twitch, Discord, and gaming.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="right">
            <div className="glass-card p-6 h-full" dir="rtl">
              <p className="text-sm leading-7 text-white/70">
                أنا <span className="font-bold text-white">(سبايكس) فواز</span>،
                ستريمر تويتش رسمي من الكويت.
                أقدّم بثوث متنوعة مليئة بالطاقة وتفاعل قوي مع المجتمع،
                وألعاب تشمل الأكشن، التحديات، واللعب الجماعي.
              </p>
              <p className="mt-4 text-sm text-white/50">
                هذا الموقع هو المكان الرسمي لكل شيء يخص البث المباشر والديسكورد
                — تجربة تجمع اللاعبين والمجتمع في مكان واحد.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ STATS / HIGHLIGHTS ═══ */}
      <ScrollReveal variant="stagger">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="stat-card">
            <div className="stat-value text-red-500">KW</div>
            <div className="stat-label">Based in Kuwait</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-white">
              <svg className="inline w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z" />
              </svg>
            </div>
            <div className="stat-label">Twitch Partner</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-red-400">3x</div>
            <div className="stat-label">Weekly Streams</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-white/80">
              <svg className="inline w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
              </svg>
            </div>
            <div className="stat-label">TikTok</div>
          </div>
        </div>
      </ScrollReveal>

      {/* ═══ QUICK LINKS ═══ */}
      <section>
        <ScrollReveal>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Connect</h2>
            <p className="mt-2 text-sm text-white/40">Find me everywhere</p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="stagger">
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={SITE.urls.live}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitch"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z" />
              </svg>
              Twitch
            </a>

            <a
              href={SITE.urls.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link discord"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.36-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
              Discord
            </a>

            <a
              href={SITE.urls.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link youtube"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73z" />
              </svg>
              YouTube
            </a>

            <a
              href={SITE.urls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter / X
            </a>

            <a
              href={SITE.urls.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z" />
              </svg>
              Instagram
            </a>

            <a
              href={SITE.urls.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link tiktok"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
              </svg>
              TikTok
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
