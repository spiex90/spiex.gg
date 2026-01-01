import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "SPIEX — spiex.gg",
  description: "SPIEX official hub — Twitch, Discord, Minecraft, and partners.",
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
