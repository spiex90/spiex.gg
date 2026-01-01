import SectionCard from "../components/SectionCard";
import { SITE } from "../lib/site";

export default function PlayPage() {
  const host = "play.spiex.gg";
  const port = "25606"; // update if it changes

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Minecraft: The HUB</h1>
        <p className="mt-2 text-white/70">
          Join the server in under 60 seconds. Works for Java & Bedrock.
        </p>
      </header>

      <div className="grid gap-6">
        <SectionCard title="Server details">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold text-white/60">SERVER ADDRESS (IP)</div>
              <div className="mt-2 rounded-xl bg-white/10 px-4 py-3 font-semibold text-white">
                {host}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-white/60">PORT</div>
              <div className="mt-2 rounded-xl bg-white/10 px-4 py-3 font-semibold text-white">
                {port}
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/60">
            Tip: If it doesn’t connect, double-check spelling and make sure you’re on the latest Minecraft version.
          </p>
        </SectionCard>

        <SectionCard title="How to join (Java Edition - PC)">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-white/70">
            <li>Open <span className="text-white font-semibold">Minecraft Java Edition</span>.</li>
            <li>Click <span className="text-white font-semibold">Multiplayer</span>.</li>
            <li>Click <span className="text-white font-semibold">Add Server</span>.</li>
            <li>
              In <span className="text-white font-semibold">Server Address</span>, paste:
              <div className="mt-2 rounded-xl bg-white/10 px-4 py-3 font-semibold text-white">
                {host}:{port}
              </div>
            </li>
            <li>Click <span className="text-white font-semibold">Done</span> → then click the server → <span className="text-white font-semibold">Join Server</span>.</li>
          </ol>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
            If your server list already shows it, you can skip “Add Server” and just click Join.
          </div>
        </SectionCard>

        <SectionCard title="How to join (Bedrock - Console / Mobile / Windows)">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-white/70">
            <li>Open <span className="text-white font-semibold">Minecraft Bedrock</span>.</li>
            <li>Go to <span className="text-white font-semibold">Play</span>.</li>
            <li>Go to the <span className="text-white font-semibold">Servers</span> tab.</li>
            <li>Scroll down and click <span className="text-white font-semibold">Add Server</span> (or “Add External Server”).</li>
            <li>
              Fill the fields like this:
              <div className="mt-3 grid gap-2">
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <div className="text-xs text-white/60">Server Name</div>
                  <div className="font-semibold text-white">The HUB</div>
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <div className="text-xs text-white/60">Server Address</div>
                  <div className="font-semibold text-white">{host}</div>
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <div className="text-xs text-white/60">Port</div>
                  <div className="font-semibold text-white">{port}</div>
                </div>
              </div>
            </li>
            <li>Save → click the server → <span className="text-white font-semibold">Join</span>.</li>
          </ol>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
            Bedrock sometimes needs the correct port to connect — if it fails, tell me the exact error message and I’ll fix it fast.
          </div>
        </SectionCard>

        <SectionCard title="Need help?">
          <p className="text-sm text-white/70">
            Join Discord and post a screenshot of the error if you get stuck — we’ll sort it quickly.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a
              className="rounded-xl bg-white/10 px-4 py-3 text-center font-semibold hover:bg-white/15"
              href={SITE.urls.discord}
            >
              Join Discord
            </a>
            <a
              className="rounded-xl bg-red-500 px-4 py-3 text-center font-semibold hover:bg-red-500/90"
              href={SITE.urls.live}
            >
              Watch Live
            </a>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
