'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Building2,
  Users,
  Save,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  User,
  ArrowUpDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/modal'
import { validateImageFile } from '@/utils/validation'
import type { ProfilDesa, PerangkatDesa } from '@/types/database'

export default function AdminProfilPage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'perangkat'>('profil')

  // --- STATE PROFIL DESA ---
  const [sejarah, setSejarah] = useState('')
  const [visi, setVisi] = useState('')
  const [misi, setMisi] = useState('')
  const [sambutan, setSambutan] = useState('')
  const [alamat, setAlamat] = useState('')
  const [telepon, setTelepon] = useState('')
  const [isSavingProfil, setIsSavingProfil] = useState(false)
  const [isFetchingProfil, setIsFetchingProfil] = useState(true)

  // --- STATE PERANGKAT DESA ---
  const [perangkatList, setPerangkatList] = useState<PerangkatDesa[]>([])
  const [isFetchingPerangkat, setIsFetchingPerangkat] = useState(true)
  const [isPerangkatModalOpen, setIsPerangkatModalOpen] = useState(false)
  const [editingPerangkat, setEditingPerangkat] = useState<PerangkatDesa | null>(null)

  // Form Perangkat State
  const [namaPerangkat, setNamaPerangkat] = useState('')
  const [jabatanPerangkat, setJabatanPerangkat] = useState('')
  const [urutanPerangkat, setUrutanPerangkat] = useState<number>(1)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [currentFotoUrl, setCurrentFotoUrl] = useState<string | null>(null)
  const [isSavingPerangkat, setIsSavingPerangkat] = useState(false)

  // Delete State Perangkat
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPerangkatDelete, setSelectedPerangkatDelete] = useState<PerangkatDesa | null>(null)
  const [isDeletingPerangkat, setIsDeletingPerangkat] = useState(false)

  // Toast & Alert State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const supabase = createClient()

  // Fetch Profil Data (id=1)
  const loadProfil = async () => {
    setIsFetchingProfil(true)
    const { data, error } = await supabase
      .from('profil_desa')
      .select('*')
      .eq('id', 1)
      .single()

    if (data) {
      const p = data as ProfilDesa
      setSejarah(p.sejarah || '')
      setVisi(p.visi || '')
      setMisi(p.misi || '')
      setSambutan(p.sambutan_kepala_desa || '')
      setAlamat(p.alamat_kantor || '')
      setTelepon(p.nomor_telepon || '')
    }
    setIsFetchingProfil(false)
  }

  // Fetch Perangkat Data
  const loadPerangkat = async () => {
    setIsFetchingPerangkat(true)
    const { data, error } = await supabase
      .from('perangkat_desa')
      .select('*')
      .order('urutan', { ascending: true })

    if (data) {
      setPerangkatList(data)
    }
    setIsFetchingPerangkat(false)
  }

  useEffect(() => {
    loadProfil()
    loadPerangkat()
  }, [])

  // Simpan Update Profil Desa
  const handleSaveProfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSavingProfil(true)

    try {
      const { error } = await supabase
        .from('profil_desa')
        .update({
          sejarah: sejarah.trim() || null,
          visi: visi.trim() || null,
          misi: misi.trim() || null,
          sambutan_kepala_desa: sambutan.trim() || null,
          alamat_kantor: alamat.trim() || null,
          nomor_telepon: telepon.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1)

      if (error) {
        throw new Error('Gagal memperbarui profil desa: ' + error.message)
      }

      setToastMessage({
        text: 'Data Profil Desa berhasil disimpan!',
        type: 'success',
      })
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kendala saat menyimpan profil.')
    } finally {
      setIsSavingProfil(false)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  // Handle Foto Perangkat
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Format foto tidak didukung')
      return
    }

    setErrorMessage(null)
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  const handleOpenAddPerangkat = () => {
    setEditingPerangkat(null)
    setNamaPerangkat('')
    setJabatanPerangkat('')
    setUrutanPerangkat(perangkatList.length + 1)
    setFotoFile(null)
    setFotoPreview(null)
    setCurrentFotoUrl(null)
    setErrorMessage(null)
    setIsPerangkatModalOpen(true)
  }

  const handleOpenEditPerangkat = (item: PerangkatDesa) => {
    setEditingPerangkat(item)
    setNamaPerangkat(item.nama)
    setJabatanPerangkat(item.jabatan)
    setUrutanPerangkat(item.urutan)
    setFotoFile(null)
    setFotoPreview(null)
    setCurrentFotoUrl(item.foto_url)
    setErrorMessage(null)
    setIsPerangkatModalOpen(true)
  }

  const handleSavePerangkat = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!namaPerangkat.trim()) {
      setErrorMessage('Nama lengkap perangkat desa wajib diisi.')
      return
    }

    if (!jabatanPerangkat.trim()) {
      setErrorMessage('Jabatan perangkat desa wajib diisi.')
      return
    }

    setIsSavingPerangkat(true)

    try {
      let finalFotoUrl = currentFotoUrl

      if (fotoFile) {
        const fileExt = fotoFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
        const filePath = `perangkat/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('foto-perangkat-desa')
          .upload(filePath, fotoFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw new Error('Gagal mengunggah foto perangkat desa: ' + uploadError.message)
        }

        const { data: publicUrlData } = supabase.storage
          .from('foto-perangkat-desa')
          .getPublicUrl(filePath)

        finalFotoUrl = publicUrlData.publicUrl
      }

      if (editingPerangkat) {
        // Update
        const { error: updateError } = await supabase
          .from('perangkat_desa')
          .update({
            nama: namaPerangkat.trim(),
            jabatan: jabatanPerangkat.trim(),
            foto_url: finalFotoUrl,
            urutan: Number(urutanPerangkat),
          })
          .eq('id', editingPerangkat.id)

        if (updateError) throw updateError

        setToastMessage({
          text: `Data perangkat desa "${namaPerangkat}" berhasil diperbarui.`,
          type: 'success',
        })
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('perangkat_desa')
          .insert({
            nama: namaPerangkat.trim(),
            jabatan: jabatanPerangkat.trim(),
            foto_url: finalFotoUrl,
            urutan: Number(urutanPerangkat),
          })

        if (insertError) throw insertError

        setToastMessage({
          text: `Perangkat desa baru "${namaPerangkat}" berhasil ditambahkan.`,
          type: 'success',
        })
      }

      setIsPerangkatModalOpen(false)
      loadPerangkat()
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kendala saat menyimpan data perangkat desa.')
    } finally {
      setIsSavingPerangkat(false)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  const handleDeletePerangkatClick = (item: PerangkatDesa) => {
    setSelectedPerangkatDelete(item)
    setDeleteModalOpen(true)
  }

  const handleConfirmDeletePerangkat = async () => {
    if (!selectedPerangkatDelete) return
    setIsDeletingPerangkat(true)

    try {
      const { error } = await supabase
        .from('perangkat_desa')
        .delete()
        .eq('id', selectedPerangkatDelete.id)

      if (error) {
        setToastMessage({
          text: 'Gagal menghapus data perangkat: ' + error.message,
          type: 'error',
        })
      } else {
        setToastMessage({
          text: `Data "${selectedPerangkatDelete.nama}" berhasil dihapus.`,
          type: 'success',
        })
        setPerangkatList((prev) => prev.filter((p) => p.id !== selectedPerangkatDelete.id))
      }
    } catch {
      setToastMessage({
        text: 'Terjadi kesalahan sistem saat menghapus perangkat desa.',
        type: 'error',
      })
    } finally {
      setIsDeletingPerangkat(false)
      setDeleteModalOpen(false)
      setSelectedPerangkatDelete(null)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <Building2 className="w-4 h-4" />
          <span>Pengaturan Konten</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Kelola Profil & Perangkat Desa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Ubah informasi profil desa, sejarah, visi misi, serta susunan aparatur perangkat desa.
        </p>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-1">
          <button
            onClick={() => setActiveTab('profil')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'profil'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Profil & Visi Misi</span>
          </button>
          <button
            onClick={() => setActiveTab('perangkat')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'perangkat'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Struktur Perangkat Desa ({perangkatList.length})</span>
          </button>
        </div>
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

      {/* TAB 1: FORM EDIT PROFIL DESA */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-lg text-slate-900">Pengaturan Teks Profil Desa</h2>
            <p className="text-xs text-slate-500">
              Informasi ini akan langsung ditampilkan di halaman beranda dan halaman profil publik.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isFetchingProfil ? (
            <div className="p-12 text-center text-slate-400 text-sm">Memuat profil desa...</div>
          ) : (
            <form onSubmit={handleSaveProfil} className="space-y-6">
              {/* Sambutan Kepala Desa */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kata Sambutan Kepala Desa
                </label>
                <p className="text-xs text-slate-400">
                  Ditampilkan pada bagian utama halaman beranda website.
                </p>
                <textarea
                  rows={3}
                  value={sambutan}
                  onChange={(e) => setSambutan(e.target.value)}
                  placeholder="Tuliskan kata sambutan kepala desa..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Sejarah Desa */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Sejarah & Asal-usul Desa
                </label>
                <textarea
                  rows={5}
                  value={sejarah}
                  onChange={(e) => setSejarah(e.target.value)}
                  placeholder="Ceritakan sejarah berdirinya Desa Bogem..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                />
              </div>

              {/* Visi Desa */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Visi Desa
                </label>
                <textarea
                  rows={2}
                  value={visi}
                  onChange={(e) => setVisi(e.target.value)}
                  placeholder="Contoh: Terwujudnya Desa Bogem yang Maju, Mandiri, dan Sejahtera..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Misi Desa */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Misi Desa
                </label>
                <p className="text-xs text-slate-400">
                  Tuliskan poin-poin misi desa. Pisahkan setiap poin misi dengan baris baru (Enter).
                </p>
                <textarea
                  rows={5}
                  value={misi}
                  onChange={(e) => setMisi(e.target.value)}
                  placeholder="Meningkatkan pelayanan masyarakat...&#10;Membangun infrastruktur pertanian...&#10;Mengembangkan perekonomian warga..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                />
              </div>

              {/* Alamat & Telepon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Alamat Kantor Balai Desa
                  </label>
                  <input
                    type="text"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Contoh: Balai Desa Bogem, Kec. Kawedanan, Magetan"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="Contoh: 08123456789 / (0351) 123456"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSavingProfil}
                  className="shadow-sm"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Simpan Perubahan Profil</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: KELOLA PERANGKAT DESA */}
      {activeTab === 'perangkat' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                Daftar Struktur Perangkat Desa
              </h2>
              <p className="text-xs text-slate-500">
                Susunan aparatur pemerintah desa akan tampil terurut berdasarkan nomor urut.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddPerangkat}
              className="cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Tambah Perangkat</span>
            </Button>
          </div>

          {isFetchingPerangkat ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Memuat data perangkat desa...
            </div>
          ) : perangkatList.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Belum ada data perangkat desa</p>
              <p className="text-xs text-slate-500">
                Klik tombol &quot;Tambah Perangkat&quot; di atas untuk mendaftarkan Kepala Desa dan aparatur lainnya.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {perangkatList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {item.foto_url ? (
                      <Image
                        src={item.foto_url}
                        alt={item.nama}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-1">
                          <User className="w-6 h-6" />
                        </div>
                        <span className="text-[11px]">Tanpa Foto</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-white shadow-xs">
                        Urutan #{item.urutan}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {item.nama}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {item.jabatan}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPerangkat(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Sunting Perangkat"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePerangkatClick(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Perangkat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Form Tambah/Edit Perangkat Desa */}
      {isPerangkatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {editingPerangkat ? 'Sunting Data Perangkat Desa' : 'Tambah Perangkat Desa Baru'}
              </h3>
              <button
                onClick={() => setIsPerangkatModalOpen(false)}
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

            <form onSubmit={handleSavePerangkat} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Supardi, S.Sos."
                  value={namaPerangkat}
                  onChange={(e) => setNamaPerangkat(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kepala Desa / Kaur Keuangan"
                    value={jabatanPerangkat}
                    onChange={(e) => setJabatanPerangkat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={urutanPerangkat}
                    onChange={(e) => setUrutanPerangkat(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Upload Foto Perangkat */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Foto Perangkat (Opsional, Maks 5MB)
                </label>

                {fotoPreview || currentFotoUrl ? (
                  <div className="relative w-32 h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mx-auto">
                    <Image
                      src={fotoPreview || currentFotoUrl!}
                      alt="Preview Foto"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFotoFile(null)
                        setFotoPreview(null)
                        setCurrentFotoUrl(null)
                      }}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full cursor-pointer"
                      title="Hapus Foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      Pilih Foto Perangkat
                    </span>
                    <span className="text-[11px] text-slate-400">JPG, PNG, WEBP</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsPerangkatModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSavingPerangkat}
                >
                  Simpan Data
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog Hapus Perangkat */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDeletePerangkat}
        title="Hapus Perangkat Desa"
        message={`Apakah Anda yakin ingin menghapus "${selectedPerangkatDelete?.nama}" (${selectedPerangkatDelete?.jabatan}) dari susunan perangkat desa?`}
        confirmText="Ya, Hapus Data"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeletingPerangkat}
      />
    </div>
  )
}
