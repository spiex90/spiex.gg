import LiveWidget from "../components/LiveWidget";
import SectionCard from "../components/SectionCard";
import { LINKS, SITE } from "../lib/site";
import Link from "next/link";

export default function LinksPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Links</h1>
        <p className="mt-2 text-white/70">
          Everything in one place — clean, fast, branded.
        </p>
      </header>

      <LiveWidget />

      <div className="mt-6">
        <SectionCard title="All links">
          <div className="grid gap-3">
            {LINKS.map((l) => {
              const baseClass = [
                "w-full rounded-2xl px-4 py-4 text-center text-sm font-semibold transition",
                l.primary
                  ? "bg-red-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.22)] hover:bg-red-500/90"
                  : "bg-white/10 text-white hover:bg-white/15",
              ].join(" ");

              // ✅ External links open new tab
              if (l.external) {
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={baseClass}
                  >
                    {l.label}
                  </a>
                );
              }

              // ✅ Internal links stay on your domain (no new tab)
              return (
                <Link key={l.label} href={l.href} className={baseClass}>
                  {l.label}
                </Link>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-white/40">
            Official hub: {SITE.brand} — spiex.gg
          </p>
        </SectionCard>
      </div>
    </>
  );
}
