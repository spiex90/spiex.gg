import NavBar from "../components/NavBar";
import AnimatedBackground from "../components/AnimatedBackground";
import Particles from "../components/Particles";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
    </>
  );
}
