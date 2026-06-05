'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  gameId: number;
  isCurrent: boolean;
}

export function GameSetCurrentButton({ gameId, isCurrent }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (isCurrent) return;
    setLoading(true);
    try {
      await fetch('/api/os/games/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gameId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || isCurrent}
      title={isCurrent ? 'Currently active' : 'Set as current game'}
      className={clsx(
        'p-1.5 rounded-lg transition-colors',
        isCurrent
          ? 'text-yellow-400 bg-yellow-400/10 cursor-default'
          : 'text-white/20 hover:text-white/50 hover:bg-white/5',
      )}
    >
      <Star size={14} fill={isCurrent ? 'currentColor' : 'none'} />
    </button>
  );
}
