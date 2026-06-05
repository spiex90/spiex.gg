export type Platform = 'instagram' | 'youtube' | 'twitch' | 'tiktok';

export type GameStatus = 'considering' | 'playing' | 'current' | 'dropped' | 'completed';

export interface Game {
  id: number;
  name: string;
  slug: string | null;
  genre: string | null;
  release_date: string | null;
  cover_url: string | null;
  notes: string | null;
  hype_score: number | null;
  arabic_audience_fit: number | null;
  status: GameStatus;
  ai_analysis: GameAnalysis | null;
  ai_analyzed_at: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameAnalysis {
  opportunities: string[];
  trending_topics: string[];
  content_angles: string[];
  competitor_gap: string;
  best_formats: string[];
  arabic_hooks: string[];
  summary: string;
}

export type IdeaStatus = 'inbox' | 'scored' | 'approved' | 'in_production' | 'published' | 'archived';

export interface Idea {
  id: number;
  title: string;
  description: string | null;
  game_id: number | null;
  game?: Game;
  platforms: Platform[];
  format_hints: string[];
  status: IdeaStatus;
  growth_score: number | null;
  score_reach: number | null;
  score_share: number | null;
  score_save: number | null;
  score_follow: number | null;
  score_twitch_conversion: number | null;
  score_roi: number | null;
  score_rationale: string | null;
  scored_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IdeaScores {
  growth_score: number;
  score_reach: number;
  score_share: number;
  score_save: number;
  score_follow: number;
  score_twitch_conversion: number;
  score_roi: number;
  score_rationale: string;
}

export type ContentFormat = 'ig_carousel' | 'tt_carousel' | 'ig_reel' | 'tt_video' | 'yt_short';

export interface CarouselSlide {
  slide_number: number;
  en: string;
  ar: string;
  visual_note: string;
}

export interface ContentPayload {
  hook: string;
  slides?: CarouselSlide[];
  script?: string;
  caption_en: string;
  caption_ar: string;
  hashtags: string[];
  cta: string;
  seo_keywords?: string[];
  title?: string;
}

export interface ContentPackage {
  id: number;
  idea_id: number;
  idea?: Idea;
  format: ContentFormat;
  language: 'en' | 'ar' | 'bilingual';
  payload: ContentPayload;
  best_posting_time: string | null;
  status: 'draft' | 'approved' | 'scheduled' | 'published';
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Win {
  id: number;
  title: string;
  description: string | null;
  platform: Platform | 'cross';
  metric_type: string | null;
  metric_value: number | null;
  occurred_on: string | null;
  related_idea_id: number | null;
  related_game_id: number | null;
  evidence_url: string | null;
  lessons: string | null;
  created_at: string;
}

export interface FollowerSnapshot {
  id: number;
  platform: Platform;
  date: string;
  follower_count: number;
}

export interface Goal {
  id: number;
  platform: Platform | 'all';
  metric: string;
  target_value: number;
  current_value: number;
  title: string;
  deadline: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Alert {
  id: number;
  type: string;
  platform: Platform | null;
  title: string;
  message: string | null;
  severity: 'info' | 'warning' | 'critical';
  post_id: string | null;
  read: boolean;
  created_at: string;
}

export interface DailyMetrics {
  platform: Platform;
  today: number;
  yesterday: number;
  delta: number;
  delta_pct: number;
}
