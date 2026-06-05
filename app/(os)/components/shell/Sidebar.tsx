'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { OS_NAV } from '../../lib/constants';
import { clsx } from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/os/auth/logout', { method: 'POST' });
    window.location.href = '/os/login';
  }

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#0a0a0f] border-r border-white/5
                      flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xs">S</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight leading-none">SPIEX OS</div>
            <div className="text-white/25 text-[10px] leading-none mt-0.5">Creator OS</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {OS_NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                active
                  ? 'bg-violet-600/15 text-violet-300 font-medium'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5',
              )}
            >
              <Icon size={15} className={active ? 'text-violet-400' : ''} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                     text-white/30 hover:text-white/60 hover:bg-white/5 transition-all w-full"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
