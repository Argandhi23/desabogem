import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  MessageCircle,
  FileCheck,
  Building,
  HelpCircle,
  CheckCircle2,
  Navigation,
} from 'lucide-react'
import { getProfilDesa } from '@/lib/supabase/queries/public'

export const metadata: Metadata = {
  title: 'Kontak & Pelayanan Warga',
  description:
    'Informasi kontak resmi Pemerintah Desa Bogem, alamat Balai Desa, jam operasional pelayanan administrasi kependudukan, dan panduan pengurusan surat warga.',
}

export const revalidate = 60 // ISR revalidation

const layananSurat = [
  {
    nama: 'Surat Keterangan Usaha (SKU)',
    deskripsi: 'Untuk keperluan pengajuan modal usaha, pinjaman bank, atau izin usaha mikro warga.',
  },
  {
    nama: 'Surat Pengantar SKCK',
    deskripsi: 'Syarat penerbitan Surat Keterangan Catatan Kepolisian di Polsek Kawedanan.',
  },
  {
    nama: 'Surat Keterangan Domisili',
    deskripsi: 'Keterangan tempat tinggal resmi warga di wilayah administratif Desa Bogem.',
  },
  {
    nama: 'Surat Keterangan Tidak Mampu (SKTM)',
    deskripsi: 'Untuk keperluan beasiswa pendidikan, keringanan biaya pengobatan, atau bantuan sosial.',
  },
  {
    nama: 'Surat Keterangan Kelahiran / Kematian',
    deskripsi: 'Pengantar administrasi pembuatan Akta Kelahiran atau Akta Kematian di Dispendukcapil.',
  },
  {
    nama: 'Surat Keterangan Pindah / Datang',
    deskripsi: 'Pengantar mutasi administrasi kependudukan antar RT, desa, kecamatan, atau kabupaten.',
  },
]

export default async function KontakPage() {
  const profil = await getProfilDesa()

  const alamat = profil?.alamat_kantor || 'Balai Desa Bogem, Kec. Kawedanan, Kab. Magetan, Jawa Timur 63382'
  const telepon = profil?.nomor_telepon || '(0351) Kantor Desa Bogem'

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
            <span className="text-white">Kontak & Layanan</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Building className="w-3.5 h-3.5" />
              <span>Pusat Pelayanan Publik</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Kontak & Informasi Layanan
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Hubungi Pemerintah Desa Bogem atau kunjungi Kantor Balai Desa untuk kebutuhan administrasi kependudukan dan konsultasi layanan masyarakat.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. Kartu Kontak & Jam Pelayanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Alamat */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Alamat Kantor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{alamat}</p>
            </div>
            <div className="pt-2">
              <a
                href="#peta-lokasi"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Lihat di Peta</span>
                <Navigation className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 2: Jam Pelayanan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Jam Pelayanan</h3>
              <div className="text-xs text-slate-600 space-y-1">
                <p><span className="font-semibold text-slate-700">Senin - Kamis:</span> 08:00 - 15:00 WIB</p>
                <p><span className="font-semibold text-slate-700">Jumat:</span> 08:00 - 11:30 WIB</p>
                <p className="text-amber-600 font-medium">Sabtu, Minggu & Libur: Tutup</p>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-400">
              Pelayanan Loket Balai Desa
            </div>
          </div>

          {/* Card 3: Telepon / WhatsApp */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Telepon & Kontak</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {telepon}
              </p>
              <p className="text-[11px] text-slate-400">
                Layanan informasi warga pada jam operasional kantor.
              </p>
            </div>
            <div className="pt-2">
              <span className="text-xs font-semibold text-emerald-700">
                Pemerintah Desa Bogem
              </span>
            </div>
          </div>

          {/* Card 4: Email Resmi */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Email Resmi</h3>
              <p className="text-xs text-slate-600 font-mono break-all">
                desabogem.magetan@gmail.com
              </p>
              <p className="text-[11px] text-slate-400">
                Korespondensi dan administrasi resmi surat digital.
              </p>
            </div>
            <div className="pt-2 text-[11px] text-slate-400">
              Balai Desa Bogem
            </div>
          </div>
        </div>

        {/* 3. Alur Pengurusan Surat Administrasi */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Petunjuk Pelayanan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Alur Pengurusan Surat Kependudukan
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Pengantar RT / RW</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Minta surat pengantar dari Ketua RT dan Ketua RW di lingkungan domisili Anda.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Siapkan Berkas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bawa fotokopi KTP, Kartu Keluarga (KK), dan dokumen pendukung sesuai jenis surat.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Loket Pelayanan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kunjungi Balai Desa Bogem pada jam pelayanan dan serahkan berkas ke perangkat desa.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900">Surat Selesai</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Petugas memproses dan menandatangani surat keterangan yang Anda butuhkan.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Daftar Jenis Layanan Surat Keterangan */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Layanan Tersedia
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Daftar Layanan Surat Keterangan Warga
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Beberapa jenis surat keterangan yang dapat dilayani di Kantor Balai Desa Bogem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {layananSurat.map((layanan, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">{layanan.nama}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{layanan.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Peta Lokasi Kantor Balai Desa */}
        <div id="peta-lokasi" className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Peta Interaktif
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Lokasi Kantor Balai Desa Bogem
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur 63382
            </p>
          </div>

          <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <iframe
              title="Peta Lokasi Kantor Balai Desa Bogem"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.18432367746!2d111.45!3d-7.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79bf8c8e19c0b1%3A0x6295324bbbe8192a!2sBogem%2C%20Kawedanan%2C%20Magetan%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
