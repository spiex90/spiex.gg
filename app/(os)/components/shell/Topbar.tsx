'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { OS_NAV } from '../../lib/constants';

interface TopbarProps {
  currentGame?: string | null;
  unreadAlerts?: number;
}

export default function Topbar({ currentGame, unreadAlerts = 0 }: TopbarProps) {
  const pathname = usePathname();
  const active = OS_NAV.find(n => pathname === n.href || pathname.startsWith(n.href + '/'));

  return (
    <header className="h-14 bg-[#050508]/80 backdrop-blur border-b border-white/5
                       flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
      {/* Left: page title */}
      <div className="flex items-center gap-2">
        <span className="text-white/30 text-sm">SPIEX OS</span>
        {active && (
          <>
            <span className="text-white/15 text-sm">/</span>
            <span className="text-white/80 text-sm font-medium">{active.label}</span>
          </>
        )}
      </div>

      {/* Right: pills + actions */}
      <div className="flex items-center gap-3">
        {currentGame && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full
                          bg-violet-600/15 border border-violet-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-violet-300 text-xs font-medium">{currentGame}</span>
          </div>
        )}

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5
                     text-white/30 hover:text-white/60 text-xs transition-colors border border-white/5"
          onClick={() => {
            const event = new CustomEvent('os:cmd-palette');
            window.dispatchEvent(event);
          }}
        >
          <Search size={12} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-white/10 text-white/30">⌘K</kbd>
        </button>

        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-white/30 hover:text-white/60">
          <Bell size={16} />
          {unreadAlerts > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>
      </div>
    </header>
  );
}
