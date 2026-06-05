import LiveWidget from "@/app/components/LiveWidget";
import { LINKS, SITE } from "@/app/lib/site";
import Link from "next/link";

export default function LinksPage() {
  return (
    <div className="space-y-8">
      <header className="text-center pt-4">
        <h1 className="text-3xl font-bold tracking-tight">
          All <span className="gradient-text">Links</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Everything in one place — clean, fast, branded.
        </p>
      </header>

      <LiveWidget />

      <div className="space-y-3">
        {LINKS.map((l) => {
          const isPrimary = l.primary;
          const className = isPrimary
            ? "btn-primary w-full justify-center py-4 text-base"
            : "social-link w-full justify-center py-4";

          if (l.external) {
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {l.label}
              </a>
            );
          }

          return (
            <Link key={l.label} href={l.href} className={className}>
              {l.label}
            </Link>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/30">
        Official hub: <span className="text-white/50">{SITE.brand}</span> — spiex.gg
      </p>
    </div>
  );
}
