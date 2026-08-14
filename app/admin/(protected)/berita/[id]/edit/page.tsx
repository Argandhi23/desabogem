'use client'

import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Trash2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { TiptapEditor } from '@/components/admin/tiptap-editor'
import { slugify } from '@/utils/formatters'
import { validateImageFile } from '@/utils/validation'
import type { Berita, KategoriBerita, StatusBerita } from '@/types/database'

export default function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [judul, setJudul] = useState('')
  const [slug, setSlug] = useState('')
  const [isManualSlug, setIsManualSlug] = useState(false)
  const [kategori, setKategori] = useState<KategoriBerita>('umum')
  const [status, setStatus] = useState<StatusBerita>('published')
  const [konten, setKonten] = useState('')

  // State gambar
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Feedback & Loading
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadBerita() {
      setIsFetching(true)
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setErrorMessage('Berita tidak ditemukan.')
      } else {
        const b = data as Berita
        setJudul(b.judul)
        setSlug(b.slug)
        setKategori(b.kategori)
        setStatus(b.status)
        setKonten(b.konten)
        setCurrentImageUrl(b.gambar_url)
      }
      setIsFetching(false)
    }

    loadBerita()
  }, [id])

  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setJudul(val)
    if (!isManualSlug) {
      setSlug(slugify(val))
    }
  }

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
    setCurrentImageUrl(null)
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
    setIsSaving(true)

    try {
      let finalImageUrl = currentImageUrl

      // Jika ada file baru yang diunggah
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

      // Update record berita
      const { error: updateError } = await supabase
        .from('berita')
        .update({
          judul: judul.trim(),
          slug: finalSlug,
          konten,
          gambar_url: finalImageUrl,
          kategori,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error('Slug/tautan ini sudah digunakan oleh berita lain. Mohon ubah tautan/slug.')
        }
        throw new Error('Gagal memperbarui berita: ' + updateError.message)
      }

      setSuccessMessage('Perubahan berita berhasil disimpan!')
      setTimeout(() => {
        router.push('/admin/berita')
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kendala saat memperbarui berita.')
      setIsSaving(false)
    }
  }

  if (isFetching) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
        Memuat data berita...
      </div>
    )
  }

  const displayedImage = imagePreview || currentImageUrl

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
            <FileEdit className="w-4 h-4" />
            <span>Sunting Berita</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Edit Berita / Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Perbarui informasi, status publikasi, atau gambar sampul berita.
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
                {isManualSlug ? 'Kunci Otomatis' : 'Ubah Manual'}
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs sm:text-sm">
              <span className="text-slate-400">.../berita/</span>
              <input
                type="text"
                disabled={!isManualSlug}
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
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
                <option value="published">Tayang (Published)</option>
                <option value="draft">Draf (Draft)</option>
              </select>
            </div>
          </div>

          {/* Upload Foto Utama */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Foto Sampul Berita
            </label>

            {displayedImage ? (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image src={displayedImage} alt="Preview Foto" fill className="object-cover" />
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
                  Pilih file gambar untuk mengganti foto sampul
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Format didukung: JPG, PNG, WEBP (Maksimal 5MB)
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
              isLoading={isSaving}
              className="w-full sm:w-auto shadow-sm"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
