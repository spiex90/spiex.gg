import 'server-only';
import { sb } from '../supabase';
import type { Game } from '../types';

export async function listGames(): Promise<Game[]> {
  const { data, error } = await sb()
    .from('os_games')
    .select('*')
    .order('is_current', { ascending: false })
    .order('hype_score', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Game[];
}

export async function getGame(id: number): Promise<Game | null> {
  const { data, error } = await sb().from('os_games').select('*').eq('id', id).single();
  if (error) return null;
  return data as Game;
}

export async function getCurrentGame(): Promise<Game | null> {
  const { data, error } = await sb()
    .from('os_games')
    .select('*')
    .eq('is_current', true)
    .single();
  if (error) return null;
  return data as Game;
}

export async function createGame(input: Partial<Game>): Promise<Game> {
  const { data, error } = await sb().from('os_games').insert(input).select().single();
  if (error) throw error;
  return data as Game;
}

export async function updateGame(id: number, input: Partial<Game>): Promise<Game> {
  const { data, error } = await sb()
    .from('os_games')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Game;
}

export async function setCurrentGame(id: number): Promise<void> {
  // Clear all first
  await sb().from('os_games').update({ is_current: false }).neq('id', 0);
  // Set this one
  await sb().from('os_games').update({ is_current: true }).eq('id', id);
}

export async function deleteGame(id: number): Promise<void> {
  const { error } = await sb().from('os_games').delete().eq('id', id);
  if (error) throw error;
}
