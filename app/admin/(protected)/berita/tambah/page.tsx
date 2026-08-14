'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { TiptapEditor } from '@/components/admin/tiptap-editor'
import { slugify } from '@/utils/formatters'
import { validateImageFile } from '@/utils/validation'
import type { KategoriBerita, StatusBerita } from '@/types/database'

export default function TambahBeritaPage() {
  const [judul, setJudul] = useState('')
  const [slug, setSlug] = useState('')
  const [isManualSlug, setIsManualSlug] = useState(false)
  const [kategori, setKategori] = useState<KategoriBerita>('umum')
  const [status, setStatus] = useState<StatusBerita>('published')
  const [konten, setKonten] = useState('')

  // State gambar
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Feedback & Loading
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // Handle title change and auto-slug
  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setJudul(val)
    if (!isManualSlug) {
      setSlug(slugify(val))
    }
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setErrorMessage(validation.error || 'File tidak valid')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!judul.trim()) {
      setErrorMessage('Judul berita wajib diisi.')
      return
    }

    if (!konten.trim() || konten === '<p></p>') {
      setErrorMessage('Konten/isi berita tidak boleh kosong.')
      return
    }

    const finalSlug = slug.trim() || slugify(judul)
    setIsLoading(true)

    try {
      // 1. Upload gambar jika ada
      let finalImageUrl: string | null = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
        const filePath = `berita/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('gambar-berita')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw new Error('Gagal mengunggah foto berita: ' + uploadError.message)
        }

        const { data: publicUrlData } = supabase.storage
          .from('gambar-berita')
          .getPublicUrl(filePath)

        finalImageUrl = publicUrlData.publicUrl
      }

      // 2. Dapatkan user session
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // 3. Simpan record berita ke database
      const { error: insertError } = await supabase.from('berita').insert({
        judul: judul.trim(),
        slug: finalSlug,
        konten,
        gambar_url: finalImageUrl,
        kategori,
        status,
        dibuat_oleh: user?.id || null,
      })

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('Slug/tautan berita ini sudah digunakan oleh berita lain. Mohon ubah tautan/slug.')
        }
        throw new Error('Gagal menyimpan berita: ' + insertError.message)
      }

      setSuccessMessage('Berita berhasil disimpan dan dipublikasikan!')
      setTimeout(() => {
        router.push('/admin/berita')
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kendala saat menyimpan data berita.')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Berita</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <FileText className="w-4 h-4" />
            <span>Formulir Berita</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Tambah Berita / Pengumuman Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Isi formulir di bawah ini untuk mempublikasikan artikel atau pengumuman desa.
          </p>
        </div>

        {/* Feedback Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Judul Berita */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Judul Berita <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kerja Bakti Massal dan Penyaluran Bantuan Pertanian"
              value={judul}
              onChange={handleJudulChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Slug URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Tautan URL (Slug)
              </label>
              <button
                type="button"
                onClick={() => setIsManualSlug(!isManualSlug)}
                className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
              >
                {isManualSlug ? 'Buat Otomatis' : 'Ubah Manual'}
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs sm:text-sm">
              <span className="text-slate-400">.../berita/</span>
              <input
                type="text"
                disabled={!isManualSlug}
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="judul-berita-otomatis"
                className="flex-1 bg-transparent border-none text-slate-800 focus:outline-none disabled:text-slate-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Kategori Berita
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as KategoriBerita)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="umum">Umum</option>
                <option value="pengumuman">Pengumuman</option>
                <option value="kegiatan">Kegiatan Warga</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusBerita)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="published">Tayangkan Langsung (Published)</option>
                <option value="draft">Simpan sebagai Draf (Draft)</option>
              </select>
            </div>
          </div>

          {/* Upload Foto Utama */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Foto Sampul Berita (Opsional, Maks 5MB)
            </label>

            {imagePreview ? (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image src={imagePreview} alt="Preview Foto" fill className="object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-colors cursor-pointer"
                  title="Hapus Foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Pilih file gambar atau klik untuk mengunggah
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Format didukung: JPG, PNG, WEBP (Ukuran maksimal 5MB)
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Rich Text Editor Konten Berita */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Isi Konten Berita <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-400">
              Gunakan bilah alat di atas editor untuk memformat tulisan (tebal, miring, judul bab, daftar poin).
            </p>
            <TiptapEditor
              content={konten}
              onChange={(html) => setKonten(html)}
              placeholder="Tuliskan isi berita lengkap di sini..."
            />
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link href="/admin/berita" className="w-full sm:w-auto">
              <Button type="button" variant="outline" size="md" className="w-full sm:w-auto">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full sm:w-auto shadow-sm"
            >
              Simpan & Publikasikan
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
