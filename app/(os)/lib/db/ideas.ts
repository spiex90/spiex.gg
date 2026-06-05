import 'server-only';
import { sb } from '../supabase';
import type { Idea, IdeaScores } from '../types';

export async function listIdeas(filters?: { status?: string; game_id?: number }): Promise<Idea[]> {
  let query = sb()
    .from('os_ideas')
    .select('*, game:os_games(id, name, is_current)')
    .order('growth_score', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.game_id) query = query.eq('game_id', filters.game_id);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Idea[];
}

export async function getIdea(id: number): Promise<Idea | null> {
  const { data, error } = await sb()
    .from('os_ideas')
    .select('*, game:os_games(id, name, is_current)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as unknown as Idea;
}

export async function createIdea(input: Partial<Idea>): Promise<Idea> {
  const { data, error } = await sb().from('os_ideas').insert(input).select().single();
  if (error) throw error;
  return data as Idea;
}

export async function updateIdea(id: number, input: Partial<Idea>): Promise<Idea> {
  const { data, error } = await sb()
    .from('os_ideas')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Idea;
}

export async function saveIdeaScores(id: number, scores: IdeaScores): Promise<void> {
  const { error } = await sb()
    .from('os_ideas')
    .update({
      ...scores,
      status: 'scored',
      scored_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteIdea(id: number): Promise<void> {
  const { error } = await sb().from('os_ideas').delete().eq('id', id);
  if (error) throw error;
}
