'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Copy, Check, Package } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import type { ContentPackage, ContentFormat } from '../../lib/types';
import { FORMAT_LABELS } from '../../lib/constants';

const FORMAT_OPTIONS: ContentFormat[] = ['ig_carousel', 'tt_carousel', 'ig_reel', 'tt_video', 'yt_short'];

interface Props {
  ideaId: number;
  packages: ContentPackage[];
}

export function IdeaPackages({ ideaId, packages: initialPackages }: Props) {
  const [packages, setPackages] = useState(initialPackages);
  const [selected, setSelected] = useState<ContentFormat[]>(['ig_carousel', 'tt_carousel']);
  const [generating, setGenerating] = useState(false);
  const [activePackage, setActivePackage] = useState<ContentPackage | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  function toggle(f: ContentFormat) {
    setSelected(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f]);
  }

  async function generate() {
    if (selected.length === 0) return;
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/os/ai/generate-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, formats: selected }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const { packages: newPkgs } = await res.json();
      setPackages(p => [...newPkgs, ...p]);
      setActivePackage(newPkgs[0]);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const display = activePackage ?? packages[0];

  return (
    <div className="space-y-4">
      {/* Generator controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package size={14} className="text-violet-400" />
            <span className="text-white/70 text-sm font-medium">AI Content Factory</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Select formats</p>
              <div className="flex flex-wrap gap-2">
                {FORMAT_OPTIONS.map(f => (
                  <button
                    key={f}
                    onClick={() => toggle(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selected.includes(f)
                        ? 'bg-violet-600/25 text-violet-300 border border-violet-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/60'
                    }`}
                  >
                    {FORMAT_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={generate}
              disabled={generating || selected.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-500
                         disabled:bg-violet-600/40 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              <Zap size={14} className={generating ? 'animate-pulse' : ''} />
              {generating ? 'Generating content...' : `Generate ${selected.length} Package${selected.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Package output */}
      {packages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm font-medium">Generated Packages</span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {packages.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePackage(pkg)}
                    className={`px-2 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                      display?.id === pkg.id
                        ? 'bg-violet-600/25 text-violet-300'
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    {FORMAT_LABELS[pkg.format]}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          {display && (
            <CardBody className="space-y-4">
              {/* Hook */}
              {display.payload.hook && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest">Hook</p>
                    <button onClick={() => copyText(display.payload.hook, 'hook')} className="text-white/20 hover:text-white/50 transition-colors">
                      {copied === 'hook' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                  <p className="text-white/80 text-sm font-semibold">{display.payload.hook}</p>
                </div>
              )}

              {/* Slides */}
              {display.payload.slides && display.payload.slides.length > 0 && (
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Slides</p>
                  <div className="space-y-2">
                    {display.payload.slides.map((slide, i) => (
                      <div key={i} className="bg-white/3 border border-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/30 text-[10px] font-mono">SLIDE {slide.slide_number}</span>
                          <button onClick={() => copyText(`${slide.en}\n${slide.ar}`, `slide-${i}`)} className="text-white/20 hover:text-white/50 transition-colors">
                            {copied === `slide-${i}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          </button>
                        </div>
                        <p className="text-white/70 text-sm">{slide.en}</p>
                        <p className="text-white/50 text-sm mt-1" dir="rtl">{slide.ar}</p>
                        {slide.visual_note && (
                          <p className="text-white/25 text-xs mt-1 italic">{slide.visual_note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Captions */}
              <div className="grid grid-cols-1 gap-3">
                {display.payload.caption_en && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white/30 text-[10px] uppercase tracking-widest">Caption (EN)</p>
                      <button onClick={() => copyText(display.payload.caption_en, 'cap_en')} className="text-white/20 hover:text-white/50 transition-colors">
                        {copied === 'cap_en' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      </button>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{display.payload.caption_en}</p>
                  </div>
                )}
                {display.payload.caption_ar && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white/30 text-[10px] uppercase tracking-widest">Caption (AR)</p>
                      <button onClick={() => copyText(display.payload.caption_ar, 'cap_ar')} className="text-white/20 hover:text-white/50 transition-colors">
                        {copied === 'cap_ar' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      </button>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed" dir="rtl">{display.payload.caption_ar}</p>
                  </div>
                )}
              </div>

              {/* Hashtags */}
              {display.payload.hashtags?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest">Hashtags</p>
                    <button onClick={() => copyText(display.payload.hashtags.map(h => `#${h}`).join(' '), 'hashtags')} className="text-white/20 hover:text-white/50 transition-colors">
                      {copied === 'hashtags' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {display.payload.hashtags.map((h, i) => (
                      <Badge key={i} variant="muted">#{h}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {display.payload.cta && (
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">CTA</p>
                  <p className="text-violet-300 text-sm">{display.payload.cta}</p>
                </div>
              )}
            </CardBody>
          )}
        </Card>
      )}
    </div>
  );
}
