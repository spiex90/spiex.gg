import "./globals.css";
import NavBar from "./components/NavBar";
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
      <body className="min-h-screen bg-[#0b0b0f] text-white">
        <NavBar />
        <main className="mx-auto max-w-3xl px-5 py-10">{children}</main>
        <footer className="mx-auto max-w-3xl px-5 pb-10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} SPIEX — spiex.gg
        </footer>
      </body>
    </html>
  );
}
