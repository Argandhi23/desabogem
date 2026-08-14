import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  FileText,
  Building2,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kontak & Pelayanan Desa',
  description:
    'Informasi alamat kantor, jam pelayanan administrasi kependudukan, nomor kontak resmi, dan panduan pengurusan surat di Balai Desa Bogem, Kec. Kawedanan, Kab. Magetan.',
}

export const revalidate = 60 // ISR revalidation

const serviceGuides = [
  {
    title: 'Surat Keterangan Usaha (SKU)',
    desc: 'Untuk keperluan pengajuan kredit usaha perbankan atau izin usaha mandiri.',
    requirements: ['Fotokopi KTP Pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Keterangan RT/RW setempat'],
  },
  {
    title: 'Surat Pengantar SKCK',
    desc: 'Untuk persyaratan melamar pekerjaan, pendaftaran CPNS/TNI/Polri, atau pendidikan.',
    requirements: ['Fotokopi KTP & KK', 'Pas foto 4x6 (2 lembar)', 'Pengantar dari RT/RW'],
  },
  {
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    desc: 'Untuk pengajuan beasiswa pendidikan, keringanan biaya kesehatan/BPJS, atau bansos.',
    requirements: ['Fotokopi KTP & KK', 'Surat pengantar RT/RW', 'Surat pernyataan tidak mampu bermaterai'],
  },
  {
    title: 'Surat Keterangan Domisili',
    desc: 'Untuk warga pendatang atau bukti tempat tinggal sementara di wilayah Desa Bogem.',
    requirements: ['Fotokopi KTP asal', 'Surat pengantar RT/RW tempat tinggal saat ini'],
  },
]

export default function KontakPage() {
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
            <span className="text-[#C89726]">Kontak & Layanan</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173C22]/90 border border-[#3D6E4B] text-[#EAF2EB] text-xs font-semibold">
              <Building2 className="w-4 h-4 text-[#C89726]" />
              <span>Pelayanan Masyarakat</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Kontak & Lokasi Balai Desa Bogem
            </h1>
            <p className="text-[#EAF2EB]/90 text-sm sm:text-base leading-relaxed">
              Pemerintah Desa Bogem berkomitmen memberikan pelayanan administrasi yang cepat, transparan, dan ramah bagi seluruh warga masyarakat.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. Kartu Informasi Kontak & Jam Kerja */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Alamat */}
          <div className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1A261D]">Alamat Balai Desa</h3>
              <p className="text-xs sm:text-sm text-[#526356] leading-relaxed">
                Balai Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur 63382.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#1F4D2C]">
              Kec. Kawedanan &bull; Kab. Magetan
            </div>
          </div>

          {/* Card 2: Jam Pelayanan */}
          <div className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1A261D]">Jam Operasional Loket</h3>
              <div className="space-y-1.5 text-xs sm:text-sm text-[#526356]">
                <p><strong>Senin – Kamis:</strong> 08:00 – 15:00 WIB</p>
                <p><strong>Jumat:</strong> 08:00 – 11:30 WIB</p>
                <p className="text-red-600 font-semibold">Sabtu & Minggu: Libur</p>
              </div>
            </div>
            <div className="pt-2 text-xs font-bold text-[#1F4D2C]">
              Pelayanan Cepat & Transparan
            </div>
          </div>

          {/* Card 3: Kontak Telepon */}
          <div className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1A261D]">Hubungi Kami</h3>
              <div className="space-y-1.5 text-xs sm:text-sm text-[#526356]">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#1F4D2C]" />
                  <span>(0351) Kantor Desa Bogem</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#1F4D2C]" />
                  <span className="font-mono text-xs">desabogem.magetan@gmail.com</span>
                </p>
              </div>
            </div>
            <div className="pt-2 text-xs font-bold text-[#1F4D2C]">
              Pemerintah Desa Bogem
            </div>
          </div>
        </div>

        {/* 3. Panduan Pengurusan Surat Administrasi */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2C]">
              Panduan Administrasi Kependudukan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A261D] tracking-tight">
              Persyaratan Pengurusan Surat Warga
            </h2>
            <p className="text-xs sm:text-sm text-[#526356]">
              Pastikan kelengkapan berkas telah siap sebelum datang ke loket pelayanan Balai Desa Bogem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceGuides.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-8 shadow-xs space-y-4 hover:border-[#1F4D2C] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-[#1A261D]">{guide.title}</h3>
                    <p className="text-xs text-[#526356]">{guide.desc}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E2E0D4]/60">
                  <span className="text-xs font-bold text-[#1A261D] uppercase tracking-wider">
                    Berkas Persyaratan:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#526356]">
                    {guide.requirements.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1F4D2C] shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Alur Pengurusan Surat */}
          <div className="bg-[#173C22] text-white rounded-3xl p-6 sm:p-10 border border-[#296338] space-y-6">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-[#C89726]" />
              <h3 className="text-lg sm:text-xl font-bold">Alur Pengurusan Surat di Balai Desa</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div className="bg-[#1F4D2C] p-4 rounded-2xl border border-[#3D6E4B] space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#C89726] text-[#1A261D] font-extrabold flex items-center justify-center text-xs">
                  1
                </span>
                <p className="font-bold text-white">Pengantar RT/RW</p>
                <p className="text-[#D3E2D6] text-xs">Minta surat pengantar dari Ketua RT dan RW tempat tinggal.</p>
              </div>

              <div className="bg-[#1F4D2C] p-4 rounded-2xl border border-[#3D6E4B] space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#C89726] text-[#1A261D] font-extrabold flex items-center justify-center text-xs">
                  2
                </span>
                <p className="font-bold text-white">Datang ke Balai Desa</p>
                <p className="text-[#D3E2D6] text-xs">Serahkan berkas persyaratan ke petugas loket pelayanan.</p>
              </div>

              <div className="bg-[#1F4D2C] p-4 rounded-2xl border border-[#3D6E4B] space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#C89726] text-[#1A261D] font-extrabold flex items-center justify-center text-xs">
                  3
                </span>
                <p className="font-bold text-white">Verifikasi & Penandatanganan</p>
                <p className="text-[#D3E2D6] text-xs">Petugas memproses dan meminta tanda tangan Kepala Desa.</p>
              </div>

              <div className="bg-[#1F4D2C] p-4 rounded-2xl border border-[#3D6E4B] space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#C89726] text-[#1A261D] font-extrabold flex items-center justify-center text-xs">
                  4
                </span>
                <p className="font-bold text-white">Surat Selesai</p>
                <p className="text-[#D3E2D6] text-xs">Surat diserahkan kepada pemohon tanpa dipungut biaya (gratis).</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Peta Petunjuk Arah */}
        <section className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A261D]">
                Peta Petunjuk Arah ke Balai Desa Bogem
              </h2>
              <p className="text-xs text-[#526356]">
                Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur
              </p>
            </div>
          </div>

          <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#E2E0D4]">
            <iframe
              title="Peta Lokasi Balai Desa Bogem"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.18432367746!2d111.45!3d-7.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79bf8c8e19c0b1%3A0x6295324bbbe8192a!2sBogem%2C%20Kawedanan%2C%20Magetan%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  )
}
