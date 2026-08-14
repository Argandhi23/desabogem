import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'
import {
  Calendar,
  ArrowLeft,
  Building2,
  ChevronRight,
  Newspaper,
} from 'lucide-react'
import { getBeritaBySlug, getBeritaPublished } from '@/lib/supabase/queries/public'
import { formatDate, stripHtml, truncateText } from '@/utils/formatters'
import type { Berita } from '@/types/database'

const fallbackArticles: Record<string, Berita> = {
  'musrenbangdes-desa-bogem-2026': {
    id: '1',
    judul: 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Desa Bogem Tahun 2026',
    slug: 'musrenbangdes-desa-bogem-2026',
    konten: `
      <p>Pemerintah Desa Bogem bersama Badan Permusyawaratan Desa (BPD), perwakilan tokoh masyarakat, tokoh pemuda, dan kelompok tani telah berhasil menyelenggarakan Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Tahun Anggaran 2026 bertempat di Balai Desa Bogem, Kecamatan Kawedanan.</p>
      <h2>Fokus Utama Pembangunan Tahun 2026</h2>
      <p>Dalam forum musyawarah tersebut disepakati beberapa prioritas strategis pembangunan desa, antara lain:</p>
      <ul>
        <li><strong>Peningkatan Sarana Irigasi Pertanian:</strong> Normalisasi dan pembangunan talud saluran air sawah demi mendukung ketahanan pangan lokal warga petani Desa Bogem.</li>
        <li><strong>Pemberdayaan UMKM Warga:</strong> Pelatihan pengolahan hasil pertanian dan pemasaran digital produk rumahan.</li>
        <li><strong>Kesehatan Masyarakat:</strong> Peningkatan fasilitas dan sarana posyandu balita serta lansia.</li>
      </ul>
      <p>Kepala Desa Bogem menegaskan bahwa partisipasi aktif seluruh warga sangat dibutuhkan agar pembangunan desa berjalan tepat sasaran, akuntabel, dan berkeadilan sosial.</p>
    `,
    gambar_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200',
    kategori: 'kegiatan',
    status: 'published',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  'jadwal-pelayanan-posyandu-bogem': {
    id: '2',
    judul: 'Jadwal Pelayanan Posyandu Balita dan Lansia Serentak di Balai Desa Bogem',
    slug: 'jadwal-pelayanan-posyandu-bogem',
    konten: `
      <p>Diberitahukan kepada seluruh warga Desa Bogem, khususnya para ibu yang memiliki balita dan warga lanjut usia, bahwa kegiatan Pos Pelayanan Terpadu (Posyandu) rutin akan kembali dilaksanakan serentak pada pekan depan.</p>
      <h2>Rincian Kegiatan Posyandu</h2>
      <ul>
        <li><strong>Hari/Tanggal:</strong> Rabu pekan depan</li>
        <li><strong>Waktu:</strong> Pukul 08.30 - 11.30 WIB</li>
        <li><strong>Tempat:</strong> Balai Desa Bogem, Kec. Kawedanan</li>
      </ul>
      <p>Pelayanan yang disediakan meliputi penimbangan berat badan balita, pengukuran tinggi badan, imunisasi rutin, pemberian vitamin dan makanan tambahan (PMT), serta pemeriksaan tekanan darah dan gula darah gratis untuk lansia.</p>
    `,
    gambar_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    kategori: 'pengumuman',
    status: 'published',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  'kerja-bakti-irigasi-pertanian-bogem': {
    id: '3',
    judul: 'Kerja Bakti Gotong Royong Pembersihan Saluran Irigasi Pertanian',
    slug: 'kerja-bakti-irigasi-pertanian-bogem',
    konten: `
      <p>Menyambut musim tanam padi tahun ini, puluhan petani dan warga Desa Bogem bergotong royong membersihkan saluran irigasi tersier yang mengairi lahan persawahan seluas puluhan hektar di kawasan Desa Bogem.</p>
      <p>Kegiatan gotong royong ini merupakan tradisi guyub rukun yang senantiasa dipelihara oleh masyarakat pedesaan. Dengan saluran air yang bersih dan bebas endapan lumpur, pasokan air ke petak-petak sawah diharapkan lancar sehingga hasil panen para petani semakin melimpah.</p>
    `,
    gambar_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&q=80&w=1200',
    kategori: 'kegiatan',
    status: 'published',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    updated_at: new Date().toISOString(),
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  let berita = await getBeritaBySlug(slug)
  if (!berita && fallbackArticles[slug]) {
    berita = fallbackArticles[slug]
  }

  if (!berita) {
    return { title: 'Berita Tidak Ditemukan' }
  }

  return {
    title: berita.judul,
    description: truncateText(stripHtml(berita.konten), 160),
    openGraph: {
      title: berita.judul,
      description: truncateText(stripHtml(berita.konten), 160),
      images: berita.gambar_url ? [{ url: berita.gambar_url }] : [],
    },
  }
}

export const revalidate = 60 // ISR revalidation

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let berita = await getBeritaBySlug(slug)
  if (!berita && fallbackArticles[slug]) {
    berita = fallbackArticles[slug]
  }

  if (!berita) {
    notFound()
  }

  const { data: otherNews } = await getBeritaPublished(4)
  const relatedList = otherNews.filter((b) => b.slug !== slug).slice(0, 3)
  const cleanHtml = DOMPurify.sanitize(berita.konten)

  const categoryBadge =
    berita.kategori === 'pengumuman'
      ? 'bg-[#FDF6E2] text-[#C89726] border-[#F2DE9C]'
      : berita.kategori === 'kegiatan'
      ? 'bg-[#EAF2EB] text-[#1F4D2C] border-[#B9D9BD]'
      : 'bg-slate-100 text-[#1A261D] border-slate-200'

  return (
    <div className="space-y-10 pb-24">
      {/* 1. Header Breadcrumb */}
      <section className="bg-[#173C22] text-white py-10 border-b border-[#1F4D2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#D3E2D6]">
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/berita" className="hover:text-white transition-colors">
              Berita
            </Link>
            <span>/</span>
            <span className="text-[#C89726] truncate max-w-xs">{berita.judul}</span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${categoryBadge}`}
            >
              {berita.kategori}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#D3E2D6]">
              <Calendar className="w-3.5 h-3.5 text-[#C89726]" />
              <time dateTime={berita.created_at}>{formatDate(berita.created_at)}</time>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-4xl">
            {berita.judul}
          </h1>

          <div className="flex items-center gap-2 text-xs text-[#D3E2D6] pt-1">
            <Building2 className="w-4 h-4 text-[#C89726]" />
            <span>Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan</span>
          </div>
        </div>
      </section>

      {/* 2. Article Body & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8 bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-10 shadow-xs">
            {/* Featured Image */}
            {berita.gambar_url && (
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#F8F7F2] shadow-2xs">
                <Image
                  src={berita.gambar_url}
                  alt={berita.judul}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Sanitized HTML Content */}
            <div
              className="prose prose-slate max-w-none text-[#1A261D] text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-[#E2E0D4] flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F8F7F2] hover:bg-[#EAF2EB] text-[#1F4D2C] text-xs sm:text-sm font-bold border border-[#E2E0D4] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Daftar Berita</span>
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Widget Berita Terkait */}
            <div className="bg-white rounded-3xl border border-[#E2E0D4] p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-[#E2E0D4]/60 pb-3">
                <Newspaper className="w-5 h-5 text-[#1F4D2C]" />
                <h2 className="font-bold text-[#1A261D] text-base">Berita Terkait Lainnya</h2>
              </div>

              {relatedList.length === 0 ? (
                <p className="text-xs text-[#526356]">Belum ada berita lainnya.</p>
              ) : (
                <div className="space-y-4">
                  {relatedList.map((item) => (
                    <Link
                      key={item.id}
                      href={`/berita/${item.slug}`}
                      className="group flex items-start gap-3 hover:bg-[#F8F7F2] p-2.5 rounded-xl transition-colors"
                    >
                      {item.gambar_url ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={item.gambar_url}
                            alt={item.judul}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center shrink-0">
                          <Newspaper className="w-6 h-6" />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0">
                        <p className="text-[11px] text-[#526356] font-medium">
                          {formatDate(item.created_at)}
                        </p>
                        <h3 className="font-bold text-xs sm:text-sm text-[#1A261D] line-clamp-2 group-hover:text-[#1F4D2C] transition-colors leading-snug">
                          {item.judul}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Widget Balai Desa */}
            <div className="bg-[#173C22] text-white rounded-3xl p-6 shadow-xs space-y-4 border border-[#296338]">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1F4D2C] text-[11px] font-bold uppercase tracking-wider text-[#C89726] border border-[#3D6E4B]">
                Pemerintah Desa Bogem
              </span>
              <h3 className="font-bold text-lg text-white">Pusat Layanan Warga</h3>
              <p className="text-xs text-[#D3E2D6] leading-relaxed">
                Butuh surat pengantar atau pelayanan administrasi? Kunjungi kantor balai desa pada jam kerja (Senin – Jumat 08:00 – 15:00 WIB).
              </p>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C89726] hover:text-white"
              >
                <span>Lihat Informasi Kontak Balai Desa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
