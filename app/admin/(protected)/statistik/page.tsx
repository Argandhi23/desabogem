'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  TrendingUp,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/modal'
import type { StatistikDesa } from '@/types/database'

export default function AdminStatistikPage() {
  const [stats, setStats] = useState<StatistikDesa[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<StatistikDesa | null>(null)
  const [label, setLabel] = useState('')
  const [nilai, setNilai] = useState('')
  const [satuan, setSatuan] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDelete, setSelectedDelete] = useState<StatistikDesa | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const supabase = createClient()

  const fetchStats = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('statistik_desa')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching statistik:', error)
    } else {
      setStats(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleOpenAdd = () => {
    setEditingStat(null)
    setLabel('')
    setNilai('')
    setSatuan('')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: StatistikDesa) => {
    setEditingStat(item)
    setLabel(item.label)
    setNilai(item.nilai)
    setSatuan(item.satuan || '')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!label.trim()) {
      setErrorMessage('Label / nama statistik wajib diisi.')
      return
    }

    if (!nilai.trim()) {
      setErrorMessage('Nilai statistik wajib diisi.')
      return
    }

    setIsSaving(true)

    try {
      if (editingStat) {
        // Update
        const { error: updateError } = await supabase
          .from('statistik_desa')
          .update({
            label: label.trim(),
            nilai: nilai.trim(),
            satuan: satuan.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingStat.id)

        if (updateError) throw updateError

        setToastMessage({
          text: `Data statistik "${label}" berhasil diperbarui.`,
          type: 'success',
        })
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('statistik_desa')
          .insert({
            label: label.trim(),
            nilai: nilai.trim(),
            satuan: satuan.trim() || null,
          })

        if (insertError) throw insertError

        setToastMessage({
          text: `Data statistik "${label}" berhasil ditambahkan.`,
          type: 'success',
        })
      }

      setIsModalOpen(false)
      fetchStats()
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan data.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  const handleDeleteClick = (item: StatistikDesa) => {
    setSelectedDelete(item)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedDelete) return
    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('statistik_desa')
        .delete()
        .eq('id', selectedDelete.id)

      if (error) {
        setToastMessage({
          text: 'Gagal menghapus data statistik: ' + error.message,
          type: 'error',
        })
      } else {
        setToastMessage({
          text: `Data statistik "${selectedDelete.label}" berhasil dihapus.`,
          type: 'success',
        })
        setStats((prev) => prev.filter((s) => s.id !== selectedDelete.id))
      }
    } catch {
      setToastMessage({
        text: 'Terjadi kesalahan sistem saat menghapus statistik.',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setSelectedDelete(null)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <BarChart3 className="w-4 h-4" />
            <span>Kependudukan & Data</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Kelola Data & Statistik Desa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola angka data statistik kependudukan yang ditampilkan di beranda dan halaman statistik.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          className="shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tambah Angka Statistik</span>
        </Button>
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

      {/* Tabel Data Statistik */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-base">
            Daftar Indikator Statistik ({stats.length})
          </h2>
          <span className="text-xs text-slate-400">
            Tampil di widget beranda dan menu statistik publik
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Memuat data statistik...
          </div>
        ) : stats.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Belum ada data statistik tersimpan</p>
            <p className="text-xs text-slate-500">
              Klik tombol &quot;Tambah Angka Statistik&quot; di atas untuk menginput jumlah penduduk, KK, dusun, dll.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-500 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {item.nilai}{' '}
                    {item.satuan && (
                      <span className="text-xs font-normal text-slate-500">{item.satuan}</span>
                    )}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Sunting"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {editingStat ? 'Sunting Data Statistik' : 'Tambah Angka Statistik'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nama Indikator / Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jumlah Penduduk / Luas Sawah"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Nilai / Angka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1.850 / 95"
                    value={nilai}
                    onChange={(e) => setNilai(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Satuan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jiwa / KK / Ha"
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                >
                  Simpan Data
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog Hapus Statistik */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Statistik"
        message={`Apakah Anda yakin ingin menghapus indikator "${selectedDelete?.label}"?`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
