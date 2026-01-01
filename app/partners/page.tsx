import { SITE } from "../lib/site";

export const metadata = {
  title: "Partners",
  description:
    "Collaboration and partnership contact for SPIEX (Kuwait Twitch Partner). Email and Discord DM links.",
};

// ✅ Put your Discord user profile link here (see step 2 below)
const DISCORD_USER_LINK = "https://discord.com/users/spiex";

export default function PartnersPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
        <p className="text-sm text-white/70">
          Collaboration & partnership contact for{" "}
          <span className="text-white font-semibold">{SITE.brand}</span>.
        </p>

        <p className="text-sm text-white/60" dir="rtl">
          للتعاون والشراكات — تواصل معي بشكل خاص 👇
        </p>
      </header>

      {/* ✅ ONLY KEEP THIS TILE */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Want to collaborate?</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          I’m open to brand collaborations, community events, and creator
          partnerships. Send me the details and I’ll reply.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* EMAIL */}
          <a
            href="mailto:spiex@live.com?subject=Collaboration%20Request%20(Spiex.gg)&body=Hi%20SPIEX%2C%0D%0A%0D%0ACompany%2FBrand%3A%0D%0AGoal%3A%0D%0ABudget%3A%0D%0ATimeline%3A%0D%0ALinks%3A%0D%0A%0D%0AThanks%2C%0D%0A"
            className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500/90"
          >
            Email me
          </a>

          {/* DISCORD DM */}
          <a
            href={DISCORD_USER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/15"
          >
            DM me on Discord
          </a>
        </div>

        <div className="mt-3 text-xs text-white/50" dir="rtl">
          ملاحظة: التواصل بالديسكورد يكون خاص (DM).
        </div>
      </section>
    </div>
  );
}
