'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  FolderOpen,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/modal'
import { formatDate } from '@/utils/formatters'
import { validateImageFile } from '@/utils/validation'
import type { Galeri } from '@/types/database'

export default function AdminGaleriPage() {
  const [photos, setPhotos] = useState<Galeri[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // State Form Upload
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [judulAlbum, setJudulAlbum] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Galeri | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const supabase = createClient()

  const fetchPhotos = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching galeri:', error)
    } else {
      setPhotos(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Format file tidak didukung')
      return
    }

    setErrorMessage(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!judulAlbum.trim()) {
      setErrorMessage('Nama kegiatan / judul album wajib diisi.')
      return
    }

    if (!imageFile) {
      setErrorMessage('Silakan pilih file gambar yang ingin diunggah.')
      return
    }

    setIsUploading(true)

    try {
      // 1. Upload ke storage Supabase
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `galeri/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gambar-galeri')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error('Gagal mengunggah foto ke storage: ' + uploadError.message)
      }

      const { data: publicUrlData } = supabase.storage
        .from('gambar-galeri')
        .getPublicUrl(filePath)

      const finalImageUrl = publicUrlData.publicUrl

      // 2. Dapatkan sesi admin
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // 3. Simpan record ke tabel galeri
      const { data: newRow, error: insertError } = await supabase
        .from('galeri')
        .insert({
          judul_album: judulAlbum.trim(),
          gambar_url: finalImageUrl,
          deskripsi: deskripsi.trim() || null,
          dibuat_oleh: user?.id || null,
        })
        .select()
        .single()

      if (insertError) {
        throw new Error('Gagal menyimpan data foto ke database: ' + insertError.message)
      }

      setToastMessage({
        text: 'Foto dokumentasi berhasil ditambahkan ke galeri!',
        type: 'success',
      })

      // Reset form
      setJudulAlbum('')
      setDeskripsi('')
      setImageFile(null)
      setImagePreview(null)
      setIsFormOpen(false)

      if (newRow) {
        setPhotos((prev) => [newRow as Galeri, ...prev])
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat mengunggah foto.')
    } finally {
      setIsUploading(false)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  const handleDeleteClick = (photo: Galeri) => {
    setSelectedPhoto(photo)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPhoto) return
    setIsDeleting(true)

    try {
      const { error } = await supabase.from('galeri').delete().eq('id', selectedPhoto.id)

      if (error) {
        setToastMessage({
          text: 'Gagal menghapus foto: ' + error.message,
          type: 'error',
        })
      } else {
        setToastMessage({
          text: 'Foto dokumentasi berhasil dihapus dari galeri.',
          type: 'success',
        })
        setPhotos((prev) => prev.filter((p) => p.id !== selectedPhoto.id))
      }
    } catch {
      setToastMessage({
        text: 'Terjadi kesalahan sistem saat menghapus foto.',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setSelectedPhoto(null)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <ImageIcon className="w-4 h-4" />
            <span>Dokumentasi Desa</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Kelola Galeri Foto Kegiatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unggah dan kelola foto kegiatan pembangunan dan kemasyarakatan di Desa Bogem.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="shadow-sm cursor-pointer"
        >
          {isFormOpen ? <X className="w-4 h-4 mr-1.5" /> : <Plus className="w-4 h-4 mr-1.5" />}
          <span>{isFormOpen ? 'Tutup Formulir' : 'Unggah Foto Baru'}</span>
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

      {/* Form Upload Foto (Collapsible) */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs animate-in slide-in-from-top-2 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-lg text-slate-900">Formulir Unggah Foto Dokumentasi</h2>
            <p className="text-xs text-slate-500">
              Isi nama album dan pilih file foto untuk ditambahkan ke galeri publik.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nama Kegiatan / Judul Album <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kerja Bakti Dusun I"
                  value={judulAlbum}
                  onChange={(e) => setJudulAlbum(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Keterangan Foto (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pembersihan saluran irigasi bersama warga kelompok tani"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* File Upload Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Pilih File Foto (Maksimal 5MB) <span className="text-red-500">*</span>
              </label>

              {imagePreview ? (
                <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    Klik untuk memilih foto dari komputer
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Format: JPG, PNG, WEBP (Ukuran maks 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isUploading}
                className="shadow-sm"
              >
                Unggah & Publikasikan
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Foto Admin */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-base">
            Daftar Foto Galeri ({photos.length})
          </h2>
          <span className="text-xs text-slate-400">
            Foto yang ada di sini langsung tampil di halaman publik
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Memuat data galeri...
          </div>
        ) : photos.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FolderOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Belum ada foto galeri</p>
            <p className="text-xs text-slate-500">
              Klik tombol &quot;Unggah Foto Baru&quot; di atas untuk menambahkan dokumentasi pertama desa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={photo.gambar_url}
                    alt={photo.judul_album}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm">
                      {photo.judul_album}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      {photo.deskripsi || 'Dokumentasi kegiatan desa.'}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                      <Calendar className="w-3 h-3" />
                      <time>{formatDate(photo.created_at)}</time>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(photo)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Foto</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog Hapus Foto */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Foto Galeri"
        message={`Apakah Anda yakin ingin menghapus foto dari album "${selectedPhoto?.judul_album}"? Foto yang dihapus tidak dapat dipulihkan.`}
        confirmText="Ya, Hapus Foto"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
