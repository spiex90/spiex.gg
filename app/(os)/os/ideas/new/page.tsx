'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'twitch'];
const FORMATS = ['carousel', 'reel', 'short', 'clip', 'post'];
const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitch: 'Twitch',
};
const FORMAT_LABELS: Record<string, string> = {
  carousel: 'Carousel', reel: 'Reel', short: 'Short', clip: 'Clip', post: 'Post',
};

function NewIdeaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const gameIdParam = params.get('game');

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    game_id: gameIdParam ?? '',
    platforms: [] as string[],
    format_hints: [] as string[],
  });

  function toggleArr(field: 'platforms' | 'format_hints', val: string) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/os/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description || null,
          game_id: form.game_id ? parseInt(form.game_id) : null,
          platforms: form.platforms,
          format_hints: form.format_hints,
          status: 'inbox',
        }),
      });
      const idea = await res.json();
      router.push(`/os/ideas/${idea.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/os/ideas" className="text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-bold text-white">New Idea</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#0f0f14] border border-white/5 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Idea *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Should You Play Resident Evil 9?"
              autoFocus
              required
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white
                         text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="What's the angle? What makes this unique?"
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white
                         text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500
                         transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p} type="button"
                  onClick={() => toggleArr('platforms', p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.platforms.includes(p)
                      ? 'bg-violet-600/25 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/60'
                  }`}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">Format</label>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map(f => (
                <button
                  key={f} type="button"
                  onClick={() => toggleArr('format_hints', f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.format_hints.includes(f)
                      ? 'bg-violet-600/25 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/60'
                  }`}
                >
                  {FORMAT_LABELS[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/os/ideas"
            className="flex-1 text-center py-2.5 rounded-xl border border-white/10
                       text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !form.title.trim()}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/40
                       text-white font-semibold text-sm transition-colors"
          >
            {saving ? 'Saving...' : 'Add to Vault →'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewIdeaPage() {
  return <Suspense><NewIdeaForm /></Suspense>;
}
