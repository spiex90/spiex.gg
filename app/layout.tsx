import "./globals.css";
import NavBar from "./components/NavBar";
import AnimatedBackground from "./components/AnimatedBackground";
import Particles from "./components/Particles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://spiex.gg"),

  title: {
    default: "SPIEX — Twitch Partner from Kuwait",
    template: "%s — SPIEX",
  },

  description:
    "SPIEX (Fawaz) is a Kuwait-based Twitch Partner & variety gamer. Official hub for Twitch live streams, Discord community, Minecraft: The HUB, and partners.",

  keywords: [
    "SPIEX",
    "Spiex",
    "Kuwait streamer",
    "Twitch Partner Kuwait",
    "Arabic streamer",
    "variety gamer",
    "gaming Kuwait",
    "Minecraft server Kuwait",
    "The HUB Minecraft",
    "spiex.gg",
  ],

  alternates: {
    canonical: "https://spiex.gg",
  },

  openGraph: {
    type: "website",
    url: "https://spiex.gg",
    title: "SPIEX — Twitch Partner from Kuwait",
    description:
      "Official SPIEX hub: Twitch live streams, Discord community, Minecraft: The HUB, and partners.",
    siteName: "SPIEX",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SPIEX — Twitch Partner from Kuwait",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SPIEX — Twitch Partner from Kuwait",
    description:
      "Official SPIEX hub: Twitch live streams, Discord community, Minecraft: The HUB, and partners.",
    images: ["/og.png"],
  },

  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050508] text-white antialiased">
        {/* Animated background layers */}
        <AnimatedBackground />
        <Particles />

        {/* Nav */}
        <NavBar />

        {/* Main content */}
        <main className="relative z-10 mx-auto max-w-4xl px-5 py-10 page-enter">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 mx-auto max-w-4xl px-5 pb-10 pt-6">
          <div className="divider-glow" />
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-semibold text-white/50">SPIEX</span> — spiex.gg
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://live.spiex.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white/60 transition"
              >
                Twitch
              </a>
              <a
                href="https://discord.spiex.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white/60 transition"
              >
                Discord
              </a>
              <a
                href="https://x.com/spiex90"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white/60 transition"
              >
                Twitter
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
