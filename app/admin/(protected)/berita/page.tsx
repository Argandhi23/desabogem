'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Newspaper,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/modal'
import { formatDate } from '@/utils/formatters'
import type { Berita } from '@/types/database'

export default function AdminBeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  // State untuk modal konfirmasi hapus
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const supabase = createClient()

  const fetchBerita = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching berita:', error)
    } else {
      setBeritaList(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBerita()
  }, [])

  const handleDeleteClick = (berita: Berita) => {
    setSelectedBerita(berita)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedBerita) return
    setIsDeleting(true)

    try {
      const { error } = await supabase.from('berita').delete().eq('id', selectedBerita.id)

      if (error) {
        setToastMessage({
          text: 'Gagal menghapus berita: ' + error.message,
          type: 'error',
        })
      } else {
        setToastMessage({
          text: `Berita "${selectedBerita.judul}" berhasil dihapus.`,
          type: 'success',
        })
        // Refresh list
        setBeritaList((prev) => prev.filter((b) => b.id !== selectedBerita.id))
      }
    } catch {
      setToastMessage({
        text: 'Terjadi kesalahan sistem saat menghapus berita.',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setSelectedBerita(null)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  const filteredBerita = beritaList.filter((b) => {
    const matchesSearch =
      b.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ? true : b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Newspaper className="w-4 h-4" />
            <span>Manajemen Konten</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Kelola Berita & Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Tambah, sunting, atau hapus publikasi informasi untuk warga Desa Bogem.
          </p>
        </div>

        <Link href="/admin/berita/tambah">
          <Button variant="primary" size="md" className="shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tulis Berita Baru</span>
          </Button>
        </Link>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-in fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Filter & Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>

        {/* Status Tab Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({beritaList.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tayang ({beritaList.filter((b) => b.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Draf ({beritaList.filter((b) => b.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Tabel Konten Berita */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Memuat daftar berita...
          </div>
        ) : filteredBerita.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Newspaper className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Tidak ada berita yang ditemukan</p>
            <p className="text-xs text-slate-500">
              {searchQuery
                ? 'Tidak ada hasil untuk kata kunci pencarian Anda.'
                : 'Belum ada data berita. Klik tombol di bawah untuk membuat berita baru.'}
            </p>
            {!searchQuery && (
              <div className="pt-2">
                <Link href="/admin/berita/tambah">
                  <Button variant="primary" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    <span>Tambah Berita Baru</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Berita</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tanggal Buat</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBerita.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {b.gambar_url ? (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <Image
                              src={b.gambar_url}
                              alt={b.judul}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <Newspaper className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1 hover:text-emerald-700">
                            {b.judul}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            /berita/{b.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {b.kategori}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status === 'published' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tayang</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Draf</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {formatDate(b.created_at)}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'published' && (
                          <Link
                            href={`/berita/${b.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Pratinjau Halaman Publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/berita/${b.id}/edit`}
                          className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Sunting Berita"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(b)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus Berita"
        message={`Apakah Anda yakin ingin menghapus berita "${selectedBerita?.judul}"? Berita yang dihapus tidak dapat dipulihkan kembali.`}
        confirmText="Ya, Hapus Berita"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
