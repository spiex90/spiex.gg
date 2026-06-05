import { SITE } from "@/app/lib/site";

export const metadata = {
  title: "Partners",
  description:
    "Collaboration and partnership contact for SPIEX (Kuwait Twitch Partner). Email and Discord DM links.",
};

const DISCORD_USER_LINK = "https://discord.com/users/spiex";

export default function PartnersPage() {
  return (
    <div className="space-y-10 pt-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Partners</span>
        </h1>
        <p className="mt-3 text-sm text-white/50">
          Collaboration & partnership contact for{" "}
          <span className="font-semibold text-white/80">{SITE.brand}</span>.
        </p>
        <p className="mt-2 text-sm text-white/40" dir="rtl">
          للتعاون والشراكات — تواصل معي بشكل خاص
        </p>
      </header>

      <div className="glass-card gradient-border p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Want to collaborate?</h2>
        </div>

        <p className="text-sm leading-7 text-white/60">
          I&apos;m open to brand collaborations, community events, and creator
          partnerships. Send me the details and I&apos;ll reply.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="mailto:spiex@live.com?subject=Collaboration%20Request%20(Spiex.gg)&body=Hi%20SPIEX%2C%0D%0A%0D%0ACompany%2FBrand%3A%0D%0AGoal%3A%0D%0ABudget%3A%0D%0ATimeline%3A%0D%0ALinks%3A%0D%0A%0D%0AThanks%2C%0D%0A"
            className="btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email me
          </a>

          <a
            href={DISCORD_USER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.36-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
            </svg>
            DM me on Discord
          </a>
        </div>

        <div className="mt-4 text-xs text-white/40" dir="rtl">
          ملاحظة: التواصل بالديسكورد يكون خاص (DM).
        </div>
      </div>
    </div>
  );
}
