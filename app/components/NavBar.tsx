"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NavItem = ({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="rounded-xl px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
  >
    {label}
  </Link>
);

type LiveApiResponse = {
  live: boolean;
};

export default function NavBar() {
  const [isLive, setIsLive] = useState(false);

  // Dropdown state + animation state
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Mount/unmount with animation
  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true);
      return;
    }

    // Allow closing animation to play then unmount
    const t = setTimeout(() => setMenuMounted(false), 160);
    return () => clearTimeout(t);
  }, [menuOpen]);

  // Close on outside click + ESC
  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(e: PointerEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setMenuOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Close menu on route click (mobile)
  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      ref={wrapperRef}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/70 backdrop-blur"
    >
      <div className="mx-auto max-w-3xl px-5 py-3">
        {/* TOP ROW */}
        <div className="relative flex items-center justify-between">
          {/* Left: mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-xl p-2 text-white/80 hover:bg-white/10 hover:text-white sm:hidden"
          >
            {/* Hamburger / Close icon */}
            {menuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-90"
              >
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-90"
              >
                <path
                  d="M4 7H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* Center: LOGO (centered on mobile) */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 group"
          >
            <div
              className={[
                "relative h-9 w-9 overflow-hidden rounded-lg bg-black transition",
                isLive
                  ? "shadow-[0_0_25px_rgba(239,68,68,0.55)] group-hover:shadow-[0_0_45px_rgba(239,68,68,0.85)]"
                  : "group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)]",
              ].join(" ")}
            >
              <Image
                src="/images/logo.png"
                alt="SPIEX logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* LIVE DOT on logo */}
            {isLive && (
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </Link>

          {/* Right: LIVE badge + Desktop nav */}
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-semibold text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                LIVE
              </span>
            )}

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 sm:flex">
              <NavItem href="/" label="Home" />
              <NavItem href="/links" label="Links" />
              <NavItem href="/play" label="Play" />
              <NavItem href="/partners" label="Partners" />
            </nav>
          </div>
        </div>

        {/* MOBILE DROPDOWN (outside-click + animated) */}
        {menuMounted && (
          <div
            className={[
              "mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f]/90",
              "transition-all duration-200 ease-out",
              menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div
              className={[
                "p-2 transition-transform duration-200 ease-out",
                menuOpen ? "translate-y-0" : "-translate-y-2",
              ].join(" ")}
            >
              <div className="grid gap-1">
                <NavItem href="/" label="Home" onClick={closeMenu} />
                <NavItem href="/links" label="Links" onClick={closeMenu} />
                <NavItem href="/play" label="Play" onClick={closeMenu} />
                <NavItem href="/partners" label="Partners" onClick={closeMenu} />
              </div>

              {/* Mobile quick actions */}
              <div className="mt-2 grid grid-cols-2 gap-2 p-1">
                <a
                  href="https://live.spiex.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-red-500 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-red-500/90"
                >
                  Watch Live
                </a>
                <a
                  href="https://discord.spiex.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white/90 hover:bg-white/15"
                >
                  Discord
                </a>
              </div>

              <div className="px-2 pb-2 pt-1 text-[11px] text-white/40">
                Tip: Press <span className="text-white/60">Esc</span> to close.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
