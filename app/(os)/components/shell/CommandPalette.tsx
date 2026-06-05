'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, Gamepad2, Lightbulb, Zap, BarChart3, Trophy, Plus } from 'lucide-react';

const COMMANDS = [
  { label: 'Command Center', href: '/os/today',      icon: LayoutDashboard, group: 'Navigate' },
  { label: 'Games',          href: '/os/games',      icon: Gamepad2,        group: 'Navigate' },
  { label: 'Idea Vault',     href: '/os/ideas',      icon: Lightbulb,       group: 'Navigate' },
  { label: 'AI Factory',     href: '/os/factory',    icon: Zap,             group: 'Navigate' },
  { label: 'Analytics',      href: '/os/analytics',  icon: BarChart3,       group: 'Navigate' },
  { label: 'Wins',           href: '/os/wins',       icon: Trophy,          group: 'Navigate' },
  { label: 'New Idea',       href: '/os/ideas/new',  icon: Plus,            group: 'Create'   },
  { label: 'New Game',       href: '/os/games/new',  icon: Plus,            group: 'Create'   },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onCustom = () => setOpen(o => !o);
    window.addEventListener('keydown', onKey);
    window.addEventListener('os:cmd-palette', onCustom);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('os:cmd-palette', onCustom);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.group.toLowerCase().includes(query.toLowerCase()),
  );

  const groups = [...new Set(filtered.map(c => c.group))];

  function select(href: string) {
    setOpen(false);
    router.push(href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg bg-[#0f0f14] border border-white/10 rounded-2xl
                   shadow-2xl shadow-black/50 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
          <Search size={15} className="text-white/30 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-white/90 text-sm placeholder:text-white/20 outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-white/30">ESC</kbd>
        </div>

        {/* Results */}
        <div className="py-2 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-white/20 text-sm py-6">No results</p>
          ) : (
            groups.map(group => (
              <div key={group}>
                <div className="px-4 py-1.5 text-[10px] font-semibold text-white/20 uppercase tracking-widest">
                  {group}
                </div>
                {filtered.filter(c => c.group === group).map(cmd => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.href}
                      onClick={() => select(cmd.href)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70
                                 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <Icon size={14} className="text-white/30" />
                      {cmd.label}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
