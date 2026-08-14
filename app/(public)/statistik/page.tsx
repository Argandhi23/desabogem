import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BarChart3,
  Briefcase,
  GraduationCap,
  Building,
  HeartPulse,
  ArrowLeft,
  TrendingUp,
  Home,
} from 'lucide-react'
import { getStatistikDesa } from '@/lib/supabase/queries/public'
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
      <section className="relative bg-gradient-to-br from-[#173C22] via-[#1F4D2C] to-[#122E1A] text-white py-16 sm:py-20 overflow-hidden border-b border-[#296338]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-[#D3E2D6] text-xs sm:text-sm font-medium mb-4">
            <Link href="/" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            <span>/</span>
            <span className="text-[#C89726]">Data & Statistik</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173C22]/90 border border-[#3D6E4B] text-[#EAF2EB] text-xs font-semibold">
              <BarChart3 className="w-3.5 h-3.5 text-[#C89726]" />
              <span>Transparansi Data & Demografi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Statistik Kependudukan Desa Bogem
            </h1>
            <p className="text-[#EAF2EB]/90 text-sm sm:text-base leading-relaxed">
              Ringkasan data kependudukan, potensi agraris pertanian, dan fasilitas publik di Desa Bogem, Kec. Kawedanan, Kab. Magetan.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. Grid Indikator Statistik Utama */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2C]">
              Indikator Kependudukan
            </span>
            <h2 className="text-2xl font-extrabold text-[#1A261D] tracking-tight mt-1">
              Data Statistik Utama
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-[#E2E0D4] shadow-xs flex flex-col justify-between space-y-3 hover:border-[#1F4D2C] hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#526356]">{item.label}</span>
                  <div className="w-8 h-8 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[#1A261D]">
                    {item.nilai}{' '}
                    {item.satuan && (
                      <span className="text-xs font-semibold text-[#C89726]">{item.satuan}</span>
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E2E0D4]/60 text-[11px] text-[#526356]">
                  Pemerintah Desa Bogem
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Sektor Mata Pencaharian & Potensi Desa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Mata Pencaharian */}
          <div className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A261D]">Mata Pencaharian Warga</h3>
                <p className="text-xs text-[#526356]">Distribusi sektor pekerjaan utama di Desa Bogem</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A261D] mb-1.5">
                  <span>Petani & Buruh Tani</span>
                  <span className="text-[#1F4D2C] font-extrabold">65%</span>
                </div>
                <div className="w-full h-3 bg-[#F8F7F2] border border-[#E2E0D4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1F4D2C] rounded-full w-[65%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A261D] mb-1.5">
                  <span>Pedagang & Pelaku UMKM</span>
                  <span className="text-[#3D6E4B] font-extrabold">18%</span>
                </div>
                <div className="w-full h-3 bg-[#F8F7F2] border border-[#E2E0D4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3D6E4B] rounded-full w-[18%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A261D] mb-1.5">
                  <span>Pegawai Negeri / Swasta / Guru</span>
                  <span className="text-[#526356] font-extrabold">10%</span>
                </div>
                <div className="w-full h-3 bg-[#F8F7F2] border border-[#E2E0D4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#526356] rounded-full w-[10%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A261D] mb-1.5">
                  <span>Jasa, Pertukangan & Lainnya</span>
                  <span className="text-[#C89726] font-extrabold">7%</span>
                </div>
                <div className="w-full h-3 bg-[#F8F7F2] border border-[#E2E0D4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C89726] rounded-full w-[7%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Sarana & Prasarana */}
          <div className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A261D]">Sarana & Fasilitas Desa</h3>
                <p className="text-xs text-[#526356]">Fasilitas umum penunjang aktivitas masyarakat</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#E2E0D4] space-y-1">
                <div className="flex items-center gap-2 text-[#1F4D2C]">
                  <Building className="w-4 h-4" />
                  <span className="font-bold text-xs">Balai Desa</span>
                </div>
                <p className="text-xl font-extrabold text-[#1A261D]">1 Unit</p>
                <p className="text-[11px] text-[#526356]">Pusat pelayanan warga</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#E2E0D4] space-y-1">
                <div className="flex items-center gap-2 text-[#1F4D2C]">
                  <HeartPulse className="w-4 h-4" />
                  <span className="font-bold text-xs">Posyandu / Polindes</span>
                </div>
                <p className="text-xl font-extrabold text-[#1A261D]">2 Pos</p>
                <p className="text-[11px] text-[#526356]">Layanan kesehatan dasar</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#E2E0D4] space-y-1">
                <div className="flex items-center gap-2 text-[#1F4D2C]">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-bold text-xs">PAUD & TK</span>
                </div>
                <p className="text-xl font-extrabold text-[#1A261D]">2 Unit</p>
                <p className="text-[11px] text-[#526356]">Pendidikan usia dini</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#E2E0D4] space-y-1">
                <div className="flex items-center gap-2 text-[#1F4D2C]">
                  <Home className="w-4 h-4" />
                  <span className="font-bold text-xs">Masjid & Mushola</span>
                </div>
                <p className="text-xl font-extrabold text-[#1A261D]">6 Unit</p>
                <p className="text-[11px] text-[#526356]">Sarana peribadatan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
