"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/links", label: "Links" },
  { href: "/play", label: "Play" },
  { href: "/partners", label: "Partners" },
];

type LiveApiResponse = { live: boolean };

export default function NavBar() {
  const [isLive, setIsLive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Check live status
  useEffect(() => {
    let cancelled = false;

    async function checkLive() {
      try {
        const res = await fetch("/api/twitch/live", { cache: "no-store" });
        const data = (await res.json()) as LiveApiResponse;
        if (!cancelled) setIsLive(Boolean(data?.live));
      } catch {
        if (!cancelled) setIsLive(false);
      }
    }

    checkLive();
    const id = setInterval(checkLive, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Scroll detection for nav glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu animation
  useEffect(() => {
    if (menuOpen) { setMenuMounted(true); return; }
    const t = setTimeout(() => setMenuMounted(false), 200);
    return () => clearTimeout(t);
  }, [menuOpen]);

  // Close on outside click + ESC
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      ref={wrapperRef}
      className={[
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-4xl px-5 py-3">
        <div className="relative flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white transition sm:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-90">
              {menuOpen ? (
                <>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 group">
            <div className="relative flex items-center gap-2.5">
              <div
                className={[
                  "relative h-9 w-9 overflow-hidden rounded-xl bg-black/50 ring-1 transition-all duration-300",
                  isLive
                    ? "ring-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.4)] group-hover:shadow-[0_0_40px_rgba(239,68,68,0.6)]"
                    : "ring-white/10 group-hover:ring-white/20 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                ].join(" ")}
              >
                <Image src="/images/logo.png" alt="SPIEX" fill className="object-contain" priority />
                {isLive && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 live-dot ring-2 ring-[#050508]" />
                )}
              </div>
              <span className="hidden sm:block text-lg font-bold tracking-tight">
                SPIEX
              </span>
            </div>
          </Link>

          {/* Right side: Live badge + Nav */}
          <div className="flex items-center gap-3">
            {isLive && (
              <a
                href="https://live.spiex.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-300 ring-1 ring-red-500/20 hover:bg-red-500/20 transition"
              >
                <span className="h-2 w-2 rounded-full bg-red-400 live-dot" />
                LIVE
              </a>
            )}

            <nav className="hidden items-center gap-1 sm:flex">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative rounded-xl px-3.5 py-2 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuMounted && (
          <div
            className={[
              "mt-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a10]/95 backdrop-blur-xl",
              "transition-all duration-200 ease-out",
              menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className={[
              "p-3 transition-transform duration-200 ease-out",
              menuOpen ? "translate-y-0" : "-translate-y-2",
            ].join(" ")}>
              <div className="grid gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/[0.06] hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href="https://live.spiex.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary justify-center text-xs py-2.5"
                >
                  Watch Live
                </a>
                <a
                  href="https://discord.spiex.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary justify-center text-xs py-2.5"
                >
                  Discord
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
