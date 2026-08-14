import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  Home as HomeIcon,
  Map,
  FileText,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Phone,
  Building,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react'
import { getProfilDesa, getBeritaPublished, getStatistikDesa } from '@/lib/supabase/queries/public'
import { formatDate, stripHtml, truncateText } from '@/utils/formatters'
import type { Berita, StatistikDesa } from '@/types/database'

// Data fallback realistis jika tabel Supabase belum diisi
const defaultStats: StatistikDesa[] = [
  { id: '1', label: 'Jumlah Penduduk', nilai: '1.850', satuan: 'Jiwa', updated_at: new Date().toISOString() },
  { id: '2', label: 'Kepala Keluarga', nilai: '540', satuan: 'KK', updated_at: new Date().toISOString() },
  { id: '3', label: 'Wilayah Dusun', nilai: '2', satuan: 'Dusun', updated_at: new Date().toISOString() },
  { id: '4', label: 'Rukun Tetangga', nilai: '8', satuan: 'RT', updated_at: new Date().toISOString() },
]

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

export const revalidate = 60 // Revalidate setiap 60 detik (ISR)

export default async function HomePage() {
  // Fetch data dari layer queries
  const [profilData, beritaResult, statsData] = await Promise.all([
    getProfilDesa(),
    getBeritaPublished(3),
    getStatistikDesa(),
  ])

  const beritaList = beritaResult.data.length > 0 ? beritaResult.data : fallbackBerita
  const statsList = statsData.length > 0 ? statsData : defaultStats

  const sambutanText =
    profilData?.sambutan_kepala_desa ||
    'Selamat datang di website resmi Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan. Website ini kami hadirkan sebagai media komunikasi, transparansi informasi pembangunan desa, serta kemudahan akses layanan bagi seluruh warga masyarakat Desa Bogem maupun khalayak umum.'

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 text-xs sm:text-sm font-medium shadow-inner">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Website Resmi Pemerintah Desa</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Selamat Datang di <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                  Desa Bogem
                </span>
              </h1>

              <p className="text-emerald-100/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur. Mewujudkan tata kelola desa yang transparan, mandiri, sejahtera, dan berbudaya.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Profil & Sejarah Desa</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all"
                >
                  <span>Berita & Kegiatan</span>
                </Link>
              </div>

              {/* Quick Info Badges */}
              <div className="pt-6 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                {statsList.slice(0, 4).map((stat, idx) => (
                  <div key={stat.id || idx} className="bg-emerald-900/40 rounded-xl p-3 border border-emerald-700/30">
                    <p className="text-xs text-emerald-300 font-medium">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {stat.nilai} <span className="text-xs font-normal text-emerald-200">{stat.satuan}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/20 shadow-2xl">
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"
                    alt="Panorama Alam dan Pertanian Desa Bogem"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600/90 text-[11px] font-semibold tracking-wide uppercase mb-1">
                      Identitas Desa
                    </span>
                    <h3 className="font-bold text-base sm:text-lg leading-snug">
                      Desa Bogem, Kawedanan
                    </h3>
                    <p className="text-xs text-emerald-200">Kabupaten Magetan, Jawa Timur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SAMBUTAN KEPALA DESA & SEKILAS PROFIL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Foto / Ilustrasi Kepala Desa */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-4 border-emerald-100 shadow-md bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
                  alt="Kepala Desa Bogem"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Kepala Desa Bogem</h3>
                <p className="text-sm font-medium text-emerald-700">Pemerintah Desa Bogem</p>
                <p className="text-xs text-slate-500 mt-0.5">Kec. Kawedanan, Kab. Magetan</p>
              </div>
            </div>

            {/* Isi Sambutan */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kata Sambutan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Membangun Desa Bogem yang Maju, Transparan, dan Guyub Rukun
              </h2>
              <blockquote className="text-slate-600 text-sm sm:text-base leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
                &ldquo;{sambutanText}&rdquo;
              </blockquote>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
                >
                  <span>Baca Visi, Misi & Struktur Organisasi</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FITUR LAYANAN & AKSES CEPAT WARGA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Layanan & Akses Cepat
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kemudahan Informasi untuk Warga Desa
          </p>
          <p className="text-sm text-slate-600">
            Akses cepat informasi administrasi, berita pembangunan, dan kegiatan kemasyarakatan di Desa Bogem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Profil */}
          <Link
            href="/profil"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                Profil Desa
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ketahui sejarah asal-usul, visi-misi, dan bagan struktur pemerintahan Desa Bogem.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-emerald-700 gap-1 group-hover:gap-2 transition-all">
              <span>Lihat Profil</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Berita */}
          <Link
            href="/berita"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                Kabar & Pengumuman
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Informasi terbaru seputar kegiatan desa, program bantuan, dan pengumuman resmi.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-emerald-700 gap-1 group-hover:gap-2 transition-all">
              <span>Baca Berita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Galeri */}
          <Link
            href="/galeri"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center group-hover:bg-sky-700 group-hover:text-white transition-colors">
                <HomeIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                Galeri Kegiatan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dokumentasi foto kegiatan warga, pembangunan fasilitas, dan agenda sosial desa.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-emerald-700 gap-1 group-hover:gap-2 transition-all">
              <span>Lihat Foto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4: Kontak & Lokasi */}
          <Link
            href="/kontak"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                Kontak & Pelayanan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Alamat kantor balai desa, jam pelayanan administrasi, dan nomor telepon kontak perangkat.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-emerald-700 gap-1 group-hover:gap-2 transition-all">
              <span>Hubungi Kami</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. BERITA & PENGUMUMAN TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Informasi Terkini
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Berita & Pengumuman Desa
            </h2>
          </div>
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beritaList.map((berita) => {
            const categoryColor =
              berita.kategori === 'pengumuman'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : berita.kategori === 'kegiatan'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-sky-100 text-sky-800 border-sky-200'

            return (
              <article
                key={berita.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={
                      berita.gambar_url ||
                      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={berita.judul}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${categoryColor}`}
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

                    <h3 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-2 hover:text-emerald-700 transition-colors">
                      <Link href={`/berita/${berita.slug}`}>{berita.judul}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {truncateText(stripHtml(berita.konten), 120)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href={`/berita/${berita.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
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
      </section>

      {/* 5. WILAYAH & LOKASI KANTOR DESA BOGEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-block px-3 py-1 rounded-lg bg-emerald-900/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
                Lokasi Kantor Pelayanan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Kantor Balai Desa Bogem
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Pemerintah Desa Bogem siap melayani kebutuhan administrasi warga dan masyarakat dengan ramah, transparan, dan tepat waktu.
              </p>

              <div className="space-y-2.5 pt-2 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pelayanan surat pengantar & administrasi kependudukan</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Konsultasi program bantuan sosial dan pemberdayaan</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Jam operasional: Senin - Jumat (08:00 - 15:00 WIB)</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
                >
                  <Map className="w-4 h-4" />
                  <span>Petunjuk Arah & Kontak Lengkap</span>
                </Link>
              </div>
            </div>

            {/* Map Preview Placeholder / Embed Info */}
            <div className="lg:col-span-6">
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3">
                <div className="h-64 rounded-xl overflow-hidden relative bg-slate-700 flex items-center justify-center">
                  <iframe
                    title="Peta Lokasi Kantor Desa Bogem"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.18432367746!2d111.45!3d-7.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79bf8c8e19c0b1%3A0x6295324bbbe8192a!2sBogem%2C%20Kawedanan%2C%20Magetan%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  ></iframe>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur 63382
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
