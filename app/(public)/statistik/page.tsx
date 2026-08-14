import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BarChart3,
  Users,
  Home,
  MapPin,
  Briefcase,
  GraduationCap,
  Building,
  HeartPulse,
  ArrowLeft,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { getStatistikDesa } from '@/lib/supabase/queries/public'
import { formatDate } from '@/utils/formatters'
import type { StatistikDesa } from '@/types/database'

export const metadata: Metadata = {
  title: 'Data & Statistik Desa',
  description:
    'Data statistik kependudukan, demografi wilayah, potensi ekonomi pertanian, serta sarana dan prasarana umum Desa Bogem, Kec. Kawedanan, Kab. Magetan.',
}

export const revalidate = 60 // ISR revalidation

const defaultStats: StatistikDesa[] = [
  { id: '1', label: 'Jumlah Penduduk Total', nilai: '1.850', satuan: 'Jiwa', updated_at: new Date().toISOString() },
  { id: '2', label: 'Jumlah Kepala Keluarga (KK)', nilai: '540', satuan: 'KK', updated_at: new Date().toISOString() },
  { id: '3', label: 'Jumlah Laki-laki', nilai: '915', satuan: 'Jiwa', updated_at: new Date().toISOString() },
  { id: '4', label: 'Jumlah Perempuan', nilai: '935', satuan: 'Jiwa', updated_at: new Date().toISOString() },
  { id: '5', label: 'Jumlah Dusun', nilai: '2', satuan: 'Dusun', updated_at: new Date().toISOString() },
  { id: '6', label: 'Jumlah Rukun Tetangga (RT)', nilai: '8', satuan: 'RT', updated_at: new Date().toISOString() },
  { id: '7', label: 'Luas Wilayah Pertanian', nilai: '95', satuan: 'Hektar', updated_at: new Date().toISOString() },
  { id: '8', label: 'Kelompok Tani Aktif', nilai: '4', satuan: 'Kelompok', updated_at: new Date().toISOString() },
]

export default async function PublicStatistikPage() {
  const dataDb = await getStatistikDesa()
  const statsList = dataDb.length > 0 ? dataDb : defaultStats

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Header Banner */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-medium mb-4">
            <Link href="/" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            <span>/</span>
            <span className="text-white">Data & Statistik</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Transparansi Data Desa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Statistik & Demografi Desa Bogem
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Ringkasan data kependudukan, potensi pertanian, dan fasilitas publik di Desa Bogem, Kec. Kawedanan, Kab. Magetan.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. Grid Indikator Statistik Utama */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Indikator Kependudukan
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Data Statistik Utama
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900">
                    {item.nilai}{' '}
                    {item.satuan && (
                      <span className="text-xs font-normal text-slate-500">{item.satuan}</span>
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  Pemerintah Desa Bogem
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Sektor Mata Pencaharian & Potensi Desa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Mata Pencaharian */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Mata Pencaharian Warga</h3>
                <p className="text-xs text-slate-500">Distribusi sektor pekerjaan utama di Desa Bogem</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Petani & Buruh Tani</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-[65%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Pedagang & Pelaku UMKM</span>
                  <span>18%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full w-[18%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Pegawai Negeri / Swasta / Guru</span>
                  <span>10%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full w-[10%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Jasa, Pertukangan & Lainnya</span>
                  <span>7%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[7%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Sarana & Prasarana */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Sarana & Prasarana Desa</h3>
                <p className="text-xs text-slate-500">Fasilitas umum penunjang aktivitas warga</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Building className="w-4 h-4" />
                  <span className="font-bold text-xs">Balai Desa</span>
                </div>
                <p className="text-lg font-extrabold text-slate-900">1 Unit</p>
                <p className="text-[11px] text-slate-500">Pusat pelayanan warga</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-sky-700">
                  <HeartPulse className="w-4 h-4" />
                  <span className="font-bold text-xs">Posyandu / Polindes</span>
                </div>
                <p className="text-lg font-extrabold text-slate-900">2 Pos</p>
                <p className="text-[11px] text-slate-500">Layanan kesehatan dasar</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-amber-600">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-bold text-xs">PAUD & TK</span>
                </div>
                <p className="text-lg font-extrabold text-slate-900">2 Unit</p>
                <p className="text-[11px] text-slate-500">Pendidikan usia dini</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-teal-700">
                  <Home className="w-4 h-4" />
                  <span className="font-bold text-xs">Masjid & Mushola</span>
                </div>
                <p className="text-lg font-extrabold text-slate-900">6 Unit</p>
                <p className="text-[11px] text-slate-500">Sarana peribadatan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
