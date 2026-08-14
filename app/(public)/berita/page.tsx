import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Newspaper,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, stripHtml, truncateText } from '@/utils/formatters'
import type { Berita, KategoriBerita } from '@/types/database'

export const metadata: Metadata = {
  title: 'Berita & Pengumuman',
  description:
    'Kumpulan berita terkini, dokumentasi kegiatan kemasyarakatan, dan pengumuman resmi Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan.',
}

export const revalidate = 60 // ISR revalidation

const fallbackBerita: Berita[] = [
  {
    id: '1',
    judul: 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Desa Bogem Tahun 2026',
    slug: 'musrenbangdes-desa-bogem-2026',
    konten: 'Pemerintah Desa Bogem bersama BPD dan tokoh masyarakat menggelar Musyawarah Perencanaan Pembangunan Desa guna merumuskan prioritas pembangunan infrastruktur dan pemberdayaan ekonomi warga.',
    gambar_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800',
    kategori: 'kegiatan',
    status: 'published',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    judul: 'Jadwal Pelayanan Posyandu Balita dan Lansia Serentak di Balai Desa Bogem',
    slug: 'jadwal-pelayanan-posyandu-bogem',
    konten: 'Diberitahukan kepada seluruh warga Desa Bogem bahwa pelayanan kesehatan gratis posyandu balita dan lansia akan dilaksanakan pada hari Rabu pekan depan di Balai Desa.',
    gambar_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    kategori: 'pengumuman',
    status: 'published',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    judul: 'Kerja Bakti Gotong Royong Pembersihan Saluran Irigasi Pertanian',
    slug: 'kerja-bakti-irigasi-pertanian-bogem',
    konten: 'Warga petani Desa Bogem bergotong royong membersihkan saluran irigasi tersier demi kelancaran pasokan air sawah menjelang musim tanam padi.',
    gambar_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&q=80&w=800',
    kategori: 'kegiatan',
    status: 'published',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; cari?: string; hal?: string }>
}) {
  const resolvedParams = await searchParams
  const selectedKategori = resolvedParams.kategori
  const searchQuery = resolvedParams.cari || ''
  const currentPage = parseInt(resolvedParams.hal || '1', 10)
  const pageSize = 6
  const offset = (currentPage - 1) * pageSize

  const supabase = await createClient()

  let query = supabase
    .from('berita')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (selectedKategori && ['umum', 'pengumuman', 'kegiatan'].includes(selectedKategori)) {
    query = query.eq('kategori', selectedKategori as KategoriBerita)
  }

  if (searchQuery) {
    query = query.ilike('judul', `%${searchQuery}%`)
  }

  const { data, count, error } = await query.range(offset, offset + pageSize - 1)

  let items: Berita[] = data || []
  let totalCount = count || 0

  // Fallback jika database masih kosong dan belum ada filter pencarian spesifik
  if (items.length === 0 && !searchQuery && !selectedKategori && offset === 0) {
    items = fallbackBerita
    totalCount = fallbackBerita.length
  }

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Header Banner */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-medium mb-4">
            <Link href="/" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            <span>/</span>
            <span className="text-white">Berita & Pengumuman</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Pusat Informasi Desa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Kabar & Pengumuman Desa Bogem
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Informasi terkini mengenai agenda kegiatan, program pembangunan, dan pengumuman resmi Pemerintah Desa Bogem.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 2. Filter Bar & Search */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Link
              href="/berita"
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                !selectedKategori
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua
            </Link>
            <Link
              href="/berita?kategori=pengumuman"
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedKategori === 'pengumuman'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pengumuman
            </Link>
            <Link
              href="/berita?kategori=kegiatan"
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedKategori === 'kegiatan'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kegiatan Warga
            </Link>
            <Link
              href="/berita?kategori=umum"
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedKategori === 'umum'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Umum
            </Link>
          </div>

          {/* Search Form */}
          <form method="GET" action="/berita" className="relative w-full md:w-80">
            {selectedKategori && (
              <input type="hidden" name="kategori" value={selectedKategori} />
            )}
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="cari"
              defaultValue={searchQuery}
              placeholder="Cari berita..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </form>
        </div>

        {/* 3. News Grid */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Newspaper className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Tidak ada berita yang sesuai
            </p>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Silakan coba kata kunci lain atau pilih kategori yang berbeda.
            </p>
            <div className="pt-2">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
              >
                Reset Filter
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((berita) => {
              const categoryBadge =
                berita.kategori === 'pengumuman'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : berita.kategori === 'kegiatan'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-sky-100 text-sky-800 border-sky-200'

              return (
                <article
                  key={berita.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={
                        berita.gambar_url ||
                        'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={berita.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${categoryBadge}`}
                      >
                        {berita.kategori}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <time dateTime={berita.created_at}>{formatDate(berita.created_at)}</time>
                      </div>

                      <h3 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                        <Link href={`/berita/${berita.slug}`}>{berita.judul}</Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {truncateText(stripHtml(berita.konten), 120)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href={`/berita/${berita.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-800"
                      >
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* 4. Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            {currentPage > 1 && (
              <Link
                href={`/berita?hal=${currentPage - 1}${
                  selectedKategori ? `&kategori=${selectedKategori}` : ''
                }${searchQuery ? `&cari=${encodeURIComponent(searchQuery)}` : ''}`}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </Link>
            )}

            <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
              Halaman {currentPage} dari {totalPages}
            </div>

            {currentPage < totalPages && (
              <Link
                href={`/berita?hal=${currentPage + 1}${
                  selectedKategori ? `&kategori=${selectedKategori}` : ''
                }${searchQuery ? `&cari=${encodeURIComponent(searchQuery)}` : ''}`}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 inline-flex items-center gap-1"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
