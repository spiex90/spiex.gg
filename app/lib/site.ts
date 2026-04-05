export const SITE = {
  brand: "SPIEX",
  tagline_en: "Twitch Partner · Variety Gamer",
  tagline_ar: "الكويت",
  schedule: "Mon / Wed / Fri — 7:00 PM (Kuwait)",
  urls: {
    live: "https://live.spiex.gg",
    discord: "https://discord.spiex.gg",
    // External Minecraft direct (optional use)
    playExternal: "https://play.spiex.gg",

    instagram: "https://instagram.com/spiex90",
    twitter: "https://x.com/spiex90",

    youtube: "https://www.youtube.com/@spiex90",
    tiktok: "https://www.tiktok.com/@spiex90",
  },
};

// ✅ LINKS page should send people to internal pages where you want
export const LINKS = [
  { label: "🔴 WATCH LIVE", href: "/live", primary: true, external: false },
  { label: "💬 DISCORD", href: "/discord", external: false },
  { label: "📸 INSTAGRAM", href: SITE.urls.instagram, external: true },
  { label: "𝕏 TWITTER", href: SITE.urls.twitter, external: true },
  { label: "🎥 YOUTUBE", href: SITE.urls.youtube, external: true },
  { label: "🎵 TIKTOK", href: SITE.urls.tiktok, external: true },
];
