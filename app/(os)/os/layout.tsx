import { getCurrentGame } from '../lib/db/games';
import { getUnreadAlerts } from '../lib/db/metrics';
import Sidebar from '../components/shell/Sidebar';
import Topbar from '../components/shell/Topbar';
import CommandPalette from '../components/shell/CommandPalette';

export default async function OSLayout({ children }: { children: React.ReactNode }) {
  const [currentGame, alerts] = await Promise.all([
    getCurrentGame().catch(() => null),
    getUnreadAlerts(20).catch(() => []),
  ]);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="flex h-screen bg-[#050508] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          currentGame={currentGame?.name ?? null}
          unreadAlerts={unreadCount}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
