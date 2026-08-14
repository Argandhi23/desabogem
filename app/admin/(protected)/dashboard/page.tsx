import React from 'react'
import Link from 'next/link'
import {
  Newspaper,
  CheckCircle2,
  FileEdit,
  Image as ImageIcon,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/utils/formatters'
import type { Berita } from '@/types/database'

export const revalidate = 0 // Dynamic data in admin dashboard

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Ambil total data
  const [beritaRes, galeriRes, perangkatRes, latestBeritaRes] = await Promise.all([
    supabase.from('berita').select('id, status', { count: 'exact' }),
    supabase.from('galeri').select('id', { count: 'exact', head: true }),
    supabase.from('perangkat_desa').select('id', { count: 'exact', head: true }),
    supabase.from('berita').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const totalBerita = beritaRes.count || 0
  const newsRows = beritaRes.data as { id: string; status: 'draft' | 'published' }[] | null
  const publishedCount = newsRows?.filter((b) => b.status === 'published').length || 0
  const draftCount = newsRows?.filter((b) => b.status === 'draft').length || 0
  const totalGaleri = galeriRes.count || 0
  const totalPerangkat = perangkatRes.count || 0
  const recentNews = (latestBeritaRes.data || []) as Berita[]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Selamat Datang di Panel Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pemerintah Desa Bogem
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Kelola publikasi berita, dokumentasi galeri kegiatan warga, dan profil desa dengan mudah dan cepat.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Berita */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Total Berita</p>
            <p className="text-2xl font-bold text-slate-900">{totalBerita}</p>
            <p className="text-[11px] text-slate-400">
              {publishedCount} terbit &bull; {draftCount} draf
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Newspaper className="w-6 h-6" />
          </div>
        </div>

        {/* Berita Terbit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Berita Tayang</p>
            <p className="text-2xl font-bold text-emerald-700">{publishedCount}</p>
            <p className="text-[11px] text-slate-400">Dapat dibaca warga</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Foto Galeri */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Foto Galeri</p>
            <p className="text-2xl font-bold text-slate-900">{totalGaleri}</p>
            <p className="text-[11px] text-slate-400">Dokumentasi desa</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Perangkat Desa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">Perangkat Desa</p>
            <p className="text-2xl font-bold text-slate-900">{totalPerangkat}</p>
            <p className="text-[11px] text-slate-400">Struktur aparatur</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/admin/berita/tambah"
          className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              Tulis Berita Baru
            </h3>
            <p className="text-xs text-slate-500">Publikasikan kegiatan & pengumuman</p>
          </div>
        </Link>

        <Link
          href="/admin/galeri"
          className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              Kelola Galeri Foto
            </h3>
            <p className="text-xs text-slate-500">Tambah dokumentasi kegiatan desa</p>
          </div>
        </Link>

        <Link
          href="/admin/profil"
          className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              Ubah Profil Desa
            </h3>
            <p className="text-xs text-slate-500">Edit visi misi & data perangkat</p>
          </div>
        </Link>
      </div>

      {/* Recent News List in Admin */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Berita Terbaru yang Dibuat</h2>
            <p className="text-xs text-slate-500">5 berita terakhir yang tercatat di sistem</p>
          </div>
          <Link
            href="/admin/berita"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
          >
            <span>Semua Berita</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentNews.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Newspaper className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">Belum ada berita yang ditambahkan</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Silakan buat berita atau pengumuman pertama Anda untuk dipublikasikan ke warga Desa Bogem.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/berita/tambah"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Berita Sekarang</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentNews.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status === 'published' ? 'Tayang (Published)' : 'Draf (Draft)'}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-500">{formatDate(b.created_at)}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-500 capitalize">{b.kategori}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{b.judul}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/berita/${b.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
