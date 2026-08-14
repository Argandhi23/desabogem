import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://desabogem.id'

  // Rute Publik Statis
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/profil`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/galeri`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/statistik`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Rute Dinamis Berita Published
  try {
    const supabase = await createClient()
    const { data: news } = await supabase
      .from('berita')
      .select('slug, updated_at')
      .eq('status', 'published')

    const newsRoutes: MetadataRoute.Sitemap = (news || []).map((item) => ({
      url: `${baseUrl}/berita/${item.slug}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticRoutes, ...newsRoutes]
  } catch {
    return staticRoutes
  }
}
