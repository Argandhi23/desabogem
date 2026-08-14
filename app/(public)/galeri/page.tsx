'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Image as ImageIcon,
  ArrowLeft,
  Calendar,
  X,
  Maximize2,
  FolderOpen,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/utils/formatters'
import type { Galeri } from '@/types/database'

// Data cadangan jika galeri di database masih kosong
const defaultGaleri: Galeri[] = [
  {
    id: '1',
    judul_album: 'Kerja Bakti Desa',
    gambar_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&q=80&w=1200',
    deskripsi: 'Gotong royong warga membersihkan saluran irigasi dan lingkungan desa.',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '2',
    judul_album: 'Pelayanan Posyandu',
    gambar_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    deskripsi: 'Pemeriksaan kesehatan balita dan lansia secara berkala di Balai Desa Bogem.',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: '3',
    judul_album: 'Musrenbangdes 2026',
    gambar_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200',
    deskripsi: 'Musyawarah perencanaan pembangunan desa bersama tokoh masyarakat.',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: '4',
    judul_album: 'Potensi Pertanian',
    gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    deskripsi: 'Hamparan persawahan subur yang menjadi penopang utama perekonomian Desa Bogem.',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
  {
    id: '5',
    judul_album: 'Kegiatan Keagamaan',
    gambar_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1200',
    deskripsi: 'Pengajian rutin warga dan santunan sosial mempererat kerukunan masyarakat.',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: '6',
    judul_album: 'Penyuluhan Pertanian',
    gambar_url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=1200',
    deskripsi: 'Pelatihan pembuatan pupuk organik bersama kelompok tani Desa Bogem.',
    dibuat_oleh: null,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
]

export default function PublicGaleriPage() {
  const [photos, setPhotos] = useState<Galeri[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all')
  const [activePhoto, setActivePhoto] = useState<Galeri | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchPhotos() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setPhotos(defaultGaleri)
      } else {
        setPhotos(data)
      }
      setIsLoading(false)
    }

    fetchPhotos()
  }, [])

  // Dapatkan daftar album unik
  const albumList = Array.from(new Set(photos.map((p) => p.judul_album)))

  const filteredPhotos =
    selectedAlbum === 'all'
      ? photos
      : photos.filter((p) => p.judul_album === selectedAlbum)

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
            <span className="text-white">Galeri Kegiatan</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Dokumentasi Desa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Galeri Kegiatan Desa Bogem
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Kumpulan dokumentasi foto pembangunan, kegiatan sosial kemasyarakatan, serta potensi alam dan budaya di Desa Bogem, Kec. Kawedanan.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 2. Album Filter Tabs */}
        {albumList.length > 1 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedAlbum('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                selectedAlbum === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua Foto ({photos.length})
            </button>
            {albumList.map((album) => (
              <button
                key={album}
                onClick={() => setSelectedAlbum(album)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedAlbum === album
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {album} ({photos.filter((p) => p.judul_album === album).length})
              </button>
            ))}
          </div>
        )}

        {/* 3. Photos Grid */}
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
            Memuat galeri foto...
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FolderOpen className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-slate-800">Belum ada foto dalam album ini</p>
            <p className="text-xs text-slate-500">Pilih album lain untuk melihat dokumentasi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={photo.gambar_url}
                    alt={photo.judul_album}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm shadow-xs">
                      {photo.judul_album}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-white">
                  <p className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-2 leading-relaxed">
                    {photo.deskripsi || 'Dokumentasi kegiatan Pemerintah Desa Bogem.'}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <time dateTime={photo.created_at}>{formatDate(photo.created_at)}</time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-20 p-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Container */}
            <div className="relative h-80 sm:h-[480px] w-full bg-slate-950">
              <Image
                src={activePhoto.gambar_url}
                alt={activePhoto.judul_album}
                fill
                className="object-contain"
              />
            </div>

            {/* Description Bar */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white">
                  {activePhoto.judul_album}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDate(activePhoto.created_at)}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {activePhoto.deskripsi || 'Dokumentasi kegiatan resmi Pemerintah Desa Bogem.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
