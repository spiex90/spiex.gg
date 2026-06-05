import {
  LayoutDashboard,
  Gamepad2,
  Lightbulb,
  Zap,
  BarChart3,
  Trophy,
  Settings,
  LogOut,
} from 'lucide-react';

export const OS_NAV = [
  { href: '/os/today',     label: 'Command Center', icon: LayoutDashboard, shortcut: 'g t' },
  { href: '/os/games',     label: 'Games',          icon: Gamepad2,        shortcut: 'g g' },
  { href: '/os/ideas',     label: 'Idea Vault',     icon: Lightbulb,       shortcut: 'g i' },
  { href: '/os/factory',   label: 'AI Factory',     icon: Zap,             shortcut: 'g f' },
  { href: '/os/analytics', label: 'Analytics',      icon: BarChart3,       shortcut: 'g a' },
  { href: '/os/wins',      label: 'Wins',           icon: Trophy,          shortcut: 'g w' },
  { href: '/os/settings',  label: 'Settings',       icon: Settings,        shortcut: '' },
] as const;

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  youtube:   '#FF0000',
  twitch:    '#9147FF',
  tiktok:    '#FFFFFF',
};

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube:   'YouTube',
  twitch:    'Twitch',
  tiktok:    'TikTok',
};

export const FORMAT_LABELS: Record<string, string> = {
  ig_carousel: 'Instagram Carousel',
  tt_carousel: 'TikTok Carousel',
  ig_reel:     'Instagram Reel',
  tt_video:    'TikTok Video',
  yt_short:    'YouTube Short',
};

export const SCORE_LABELS: Record<string, string> = {
  score_reach:             'Reach',
  score_share:             'Share Potential',
  score_save:              'Save Potential',
  score_follow:            'Follow Conversion',
  score_twitch_conversion: 'Twitch Conversion',
  score_roi:               'ROI',
};

export const SPIEX_BRAND = {
  name: 'SPIEX',
  real_name: 'Fawaz',
  nationality: 'Kuwaiti',
  platforms: ['Twitch', 'Instagram', 'TikTok', 'YouTube'],
  twitch: 'twitch.tv/spiex90',
  schedule: 'Mon / Wed / Fri — 7:00 PM Kuwait',
  voice: `Direct, funny, honest, slightly sarcastic. Kuwaiti dialect when writing Arabic.
Talks like a real gamer chatting with friends. Never corporate, never influencer-speak,
never fake enthusiasm, never motivational garbage. Short, punchy sentences.`,
  series: ['Should You Play?', 'SPIEX Score', 'Games That...', 'Rankings', 'Hidden Details', 'Before You Buy'],
};
