import 'server-only';
import { sb } from '../supabase';
import type { ContentPackage, ContentFormat, ContentPayload } from '../types';

export async function listPackages(ideaId?: number): Promise<ContentPackage[]> {
  let query = sb()
    .from('os_packages')
    .select('*, idea:os_ideas(id, title)')
    .order('created_at', { ascending: false });

  if (ideaId) query = query.eq('idea_id', ideaId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as ContentPackage[];
}

export async function getPackage(id: number): Promise<ContentPackage | null> {
  const { data, error } = await sb()
    .from('os_packages')
    .select('*, idea:os_ideas(id, title)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as unknown as ContentPackage;
}

export async function createPackage(input: {
  idea_id: number;
  format: ContentFormat;
  payload: ContentPayload;
  best_posting_time?: string;
  language?: 'en' | 'ar' | 'bilingual';
}): Promise<ContentPackage> {
  const { data, error } = await sb()
    .from('os_packages')
    .insert({ ...input, status: 'draft', ai_model: 'claude-haiku-4-5' })
    .select()
    .single();
  if (error) throw error;
  return data as ContentPackage;
}

export async function updatePackageStatus(
  id: number,
  status: ContentPackage['status'],
): Promise<void> {
  await sb()
    .from('os_packages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function deletePackage(id: number): Promise<void> {
  await sb().from('os_packages').delete().eq('id', id);
}
