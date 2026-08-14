import { createClient } from '@/lib/supabase/server'
import type { Berita, Galeri, ProfilDesa, PerangkatDesa, StatistikDesa } from '@/types/database'

/**
 * Mengambil data profil desa (single row, id = 1)
 */
export async function getProfilDesa(): Promise<ProfilDesa | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profil_desa')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    console.error('Error fetching profil desa:', error.message)
    return null
  }
  return data
}

/**
 * Mengambil daftar perangkat desa terurut berdasarkan kolom `urutan`
 */
export async function getPerangkatDesa(): Promise<PerangkatDesa[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('perangkat_desa')
    .select('*')
    .order('urutan', { ascending: true })

  if (error) {
    console.error('Error fetching perangkat desa:', error.message)
    return []
  }
  return data || []
}

/**
 * Mengambil daftar berita yang berstatus published dengan pagination opsional
 */
export async function getBeritaPublished(limit = 6, offset = 0): Promise<{ data: Berita[]; count: number }> {
  const supabase = await createClient()
  const { data, error, count } = await supabase
    .from('berita')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching berita:', error.message)
    return { data: [], count: 0 }
  }
  return { data: data || [], count: count || 0 }
}

/**
 * Mengambil detail satu berita published berdasarkan slug
 */
export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching berita detail:', error.message)
    return null
  }
  return data
}

/**
 * Mengambil galeri foto desa
 */
export async function getGaleri(limit = 20): Promise<Galeri[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('galeri')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching galeri:', error.message)
    return []
  }
  return data || []
}

/**
 * Mengambil data statistik desa
 */
export async function getStatistikDesa(): Promise<StatistikDesa[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('statistik_desa')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching statistik desa:', error.message)
    return []
  }
  return data || []
}
