'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const GENRES = ['Action', 'RPG', 'FPS', 'Horror', 'Adventure', 'Sports', 'Racing', 'Strategy', 'Indie', 'Other'];
const STATUSES = ['considering', 'playing', 'current', 'completed', 'dropped'];

export default function NewGamePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    genre: '',
    status: 'considering',
    notes: '',
    hype_score: '',
    arabic_audience_fit: '',
    cover_url: '',
  });

  function set(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    setError('');
    try {
      const res = await fetch('/api/os/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          genre: form.genre || null,
          status: form.status,
          notes: form.notes || null,
          hype_score: form.hype_score ? parseInt(form.hype_score) : null,
          arabic_audience_fit: form.arabic_audience_fit ? parseInt(form.arabic_audience_fit) : null,
          cover_url: form.cover_url || null,
          slug: form.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? `Server error ${res.status}`);
        return;
      }
      router.push(`/os/games/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/os/games" className="text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-bold text-white">Add Game</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#0f0f14] border border-white/5 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Game Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Resident Evil 9"
              autoFocus
              required
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white
                         text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Genre</label>
              <select
                value={form.genre}
                onChange={e => set('genre', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-3 py-2.5 text-white/80
                           text-sm focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="">Select genre</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-3 py-2.5 text-white/80
                           text-sm focus:outline-none focus:border-violet-500 transition-colors"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Hype Score (0-100)
              </label>
              <input
                type="number" min="0" max="100"
                value={form.hype_score}
                onChange={e => set('hype_score', e.target.value)}
                placeholder="75"
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white
                           text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Arab Audience Fit (0-100)
              </label>
              <input
                type="number" min="0" max="100"
                value={form.arabic_audience_fit}
                onChange={e => set('arabic_audience_fit', e.target.value)}
                placeholder="60"
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white
                           text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              placeholder="Story notes, personal thoughts, content angles..."
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white
                         text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500
                         transition-colors resize-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Link
            href="/os/games"
            className="flex-1 text-center py-2.5 rounded-xl border border-white/10 text-white/40
                       hover:text-white/60 text-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/40
                       text-white font-semibold text-sm transition-colors"
          >
            {saving ? 'Adding...' : 'Add Game →'}
          </button>
        </div>
      </form>
    </div>
  );
}
