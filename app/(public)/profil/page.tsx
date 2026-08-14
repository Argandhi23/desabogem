import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  BookOpen,
  Target,
  Compass,
  ArrowLeft,
  CheckCircle,
  User,
  Shield,
} from 'lucide-react'
import { getProfilDesa, getPerangkatDesa } from '@/lib/supabase/queries/public'
import type { PerangkatDesa } from '@/types/database'

export const metadata: Metadata = {
  title: 'Profil Desa Bogem',
  description:
    'Profil lengkap Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan. Meliputi sejarah desa, visi dan misi, struktur organisasi perangkat desa, serta batas wilayah.',
}

export const revalidate = 60 // ISR revalidation

const defaultPerangkatDesa: PerangkatDesa[] = [
  {
    id: '1',
    nama: 'Kepala Desa Bogem',
    jabatan: 'Kepala Desa',
    foto_url: null,
    urutan: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    nama: 'Sekretaris Desa Bogem',
    jabatan: 'Sekretaris Desa',
    foto_url: null,
    urutan: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    nama: 'Kaur Keuangan',
    jabatan: 'Kepala Urusan Keuangan',
    foto_url: null,
    urutan: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    nama: 'Kaur Perencanaan',
    jabatan: 'Kepala Urusan Perencanaan',
    foto_url: null,
    urutan: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    nama: 'Kaur Tata Usaha & Umum',
    jabatan: 'Kepala Urusan TU & Umum',
    foto_url: null,
    urutan: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    nama: 'Kasi Pemerintahan',
    jabatan: 'Kepala Seksi Pemerintahan',
    foto_url: null,
    urutan: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    nama: 'Kasi Kesejahteraan & Pelayanan',
    jabatan: 'Kepala Seksi Kesejahteraan & Pelayanan',
    foto_url: null,
    urutan: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    nama: 'Kamituwo Dusun I',
    jabatan: 'Kepala Dusun I',
    foto_url: null,
    urutan: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    nama: 'Kamituwo Dusun II',
    jabatan: 'Kepala Dusun II',
    foto_url: null,
    urutan: 9,
    created_at: new Date().toISOString(),
  },
]

const defaultSejarah = `Desa Bogem merupakan salah satu desa yang terletak di wilayah administrasi Kecamatan Kawedanan, Kabupaten Magetan, Provinsi Jawa Timur. Sejarah berdirinya Desa Bogem berakar dari tradisi masyarakat agraris yang hidup rukun, menjunjung tinggi nilai gotong royong, dan memiliki keterikatan kuat dengan kelestarian alam sekitarnya.

Nama "Bogem" secara turun-temurun diyakini berasal dari sesepuh pendahulu desa yang membuka lahan pemukiman dan pertanian subur di kawasan ini. Dari masa ke masa, masyarakat Desa Bogem terus melestarikan kearifan lokal dalam mengelola sumber daya air dan pertanian, serta senantiasa menjaga keharmonisan kehidupan bermasyarakat.

Kini, di era keterbukaan informasi publik, Pemerintah Desa Bogem terus berbenah meningkatkan mutu pelayanan kependudukan, transparansi tata kelola anggaran desa, dan percepatan pembangunan infrastruktur demi kemakmuran seluruh warga masyarakat.`

const defaultVisi = `Terwujudnya Desa Bogem yang Maju, Mandiri, Sejahtera, Berdaya Saing, dan Berbudaya Berlandaskan Nilai-Nilai Gotong Royong.`

const defaultMisiList = [
  'Mewujudkan tata kelola pemerintahan desa yang bersih, transparan, akuntabel, dan responsif terhadap kebutuhan masyarakat.',
  'Meningkatkan pembangunan infrastruktur desa, sarana irigasi pertanian, dan fasilitas publik yang merata dan berkelanjutan.',
  'Mendorong kemandirian ekonomi desa melalui penguatan sektor pertanian, peternakan, serta pembinaan usaha mikro kecil menengah (UMKM).',
  'Meningkatkan mutu pelayanan kesehatan warga melalui optimalisasi posyandu balita dan lansia serta sanitasi lingkungan.',
  'Memperkokoh kerukunan sosial, melestarikan adat istiadat, dan mengembangkan potensi pemuda serta kebudayaan lokal.',
]

export default async function ProfilPage() {
  const [profil, perangkatListDb] = await Promise.all([
    getProfilDesa(),
    getPerangkatDesa(),
  ])

  const sejarahContent = profil?.sejarah || defaultSejarah
  const visiContent = profil?.visi || defaultVisi
  const misiContent = profil?.misi
    ? profil.misi.split('\n').filter((item) => item.trim() !== '')
    : defaultMisiList

  const perangkatList = perangkatListDb.length > 0 ? perangkatListDb : defaultPerangkatDesa

  return (
    <div className="space-y-16 pb-24">
      {/* 1. HEADER BANNER */}
      <section className="relative bg-gradient-to-br from-[#173C22] via-[#1F4D2C] to-[#122E1A] text-white py-16 sm:py-20 overflow-hidden border-b border-[#296338]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-[#D3E2D6] text-xs sm:text-sm font-medium mb-4">
            <Link href="/" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            <span>/</span>
            <span className="text-[#C89726]">Profil Desa</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173C22]/90 border border-[#3D6E4B] text-[#EAF2EB] text-xs font-semibold">
              <Building2 className="w-4 h-4 text-[#C89726]" />
              <span>Identitas & Pemerintahan Desa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Profil Pemerintah Desa Bogem
            </h1>
            <p className="text-[#EAF2EB]/90 text-sm sm:text-base leading-relaxed">
              Mengenal sejarah peradaban desa, cita-cita visi & misi pembangunan, jajaran aparatur pemerintahan desa, serta kondisi geografis Desa Bogem, Kec. Kawedanan, Kab. Magetan.
            </p>
          </div>

          {/* Quick Anchor Links */}
          <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-[#3D6E4B]/50">
            <a
              href="#sejarah"
              className="px-3.5 py-1.5 rounded-xl bg-[#173C22] hover:bg-[#122E1A] text-[#EAF2EB] text-xs font-semibold border border-[#3D6E4B] transition-colors"
            >
              Sejarah Desa
            </a>
            <a
              href="#visi-misi"
              className="px-3.5 py-1.5 rounded-xl bg-[#173C22] hover:bg-[#122E1A] text-[#EAF2EB] text-xs font-semibold border border-[#3D6E4B] transition-colors"
            >
              Visi & Misi
            </a>
            <a
              href="#struktur"
              className="px-3.5 py-1.5 rounded-xl bg-[#173C22] hover:bg-[#122E1A] text-[#EAF2EB] text-xs font-semibold border border-[#3D6E4B] transition-colors"
            >
              Struktur Aparatur
            </a>
            <a
              href="#wilayah"
              className="px-3.5 py-1.5 rounded-xl bg-[#173C22] hover:bg-[#122E1A] text-[#EAF2EB] text-xs font-semibold border border-[#3D6E4B] transition-colors"
            >
              Letak & Batas Wilayah
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. SEJARAH DESA */}
        <section id="sejarah" className="scroll-mt-28">
          <div className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2C]">
                  Asal Usul & Warisan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A261D] tracking-tight">
                  Sejarah Desa Bogem
                </h2>
              </div>
            </div>

            <div className="text-[#526356] text-sm sm:text-base leading-relaxed space-y-4">
              {sejarahContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-justify leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 3. VISI & MISI */}
        <section id="visi-misi" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2C]">
              Arah & Komitmen Pembangunan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A261D] tracking-tight">
              Visi & Misi Desa Bogem
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Visi Card */}
            <div className="lg:col-span-5 bg-[#173C22] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm border border-[#296338]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F4D2C] text-[#C89726] text-xs font-bold tracking-wide uppercase border border-[#3D6E4B]">
                  <Target className="w-4 h-4" />
                  <span>Visi Desa</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                  Cita-Cita Pembangunan Desa Bogem
                </h3>
                <blockquote className="text-[#EAF2EB] text-base sm:text-lg italic font-medium leading-relaxed pt-2 border-l-3 border-[#C89726] pl-4">
                  &ldquo;{visiContent}&rdquo;
                </blockquote>
              </div>

              <div className="pt-8 text-xs text-[#D3E2D6] font-medium">
                Pemerintah Desa Bogem &bull; Kecamatan Kawedanan
              </div>
            </div>

            {/* Misi Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E0D4] p-8 sm:p-10 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EB] text-[#1F4D2C] text-xs font-bold tracking-wide uppercase">
                  <CheckCircle className="w-4 h-4" />
                  <span>Misi Desa</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1A261D]">
                  Langkah Strategis Pencapaian Visi
                </h3>
                <ul className="space-y-3.5 pt-2">
                  {misiContent.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#1A261D] text-xs sm:text-sm leading-relaxed">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1F4D2C] text-white font-bold text-xs flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-[#526356]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. STRUKTUR ORGANISASI PERANGKAT DESA */}
        <section id="struktur" className="scroll-mt-28 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2C]">
                Aparatur Pemerintahan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A261D] tracking-tight mt-1">
                Struktur Organisasi Perangkat Desa
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#526356] max-w-md">
              Jajaran pengurus dan pelayan masyarakat yang berdedikasi untuk kemajuan Desa Bogem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {perangkatList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E0D4] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  {item.foto_url ? (
                    <Image
                      src={item.foto_url}
                      alt={item.nama}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#F8F7F2] to-[#EAF2EB] text-[#526356]">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#1F4D2C] mb-2 shadow-2xs">
                        <User className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-semibold text-[#526356]">Aparatur Desa</span>
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-[#173C22] text-white shadow-xs">
                      #{item.urutan}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-center text-center space-y-1 bg-white">
                  <h3 className="font-bold text-base text-[#1A261D] group-hover:text-[#1F4D2C] transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-xs font-bold text-[#1F4D2C]">{item.jabatan}</p>
                  <p className="text-[11px] text-[#526356]">Pemerintah Desa Bogem</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. WILAYAH GEOGRAFIS & BATAS DESA */}
        <section id="wilayah" className="scroll-mt-28">
          <div className="bg-white rounded-3xl border border-[#E2E0D4] p-6 sm:p-10 lg:p-12 shadow-xs space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EB] text-[#1F4D2C] flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2C]">
                  Geografi & Batas Daerah
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A261D] tracking-tight">
                  Letak Geografis & Batas Wilayah
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <p className="text-xs sm:text-sm text-[#526356] leading-relaxed">
                  Desa Bogem terletak di Kecamatan Kawedanan, Kabupaten Magetan. Wilayah didominasi oleh lahan persawahan subur, perkebunan warga, dan pemukiman pedesaan yang asri dan guyub rukun.
                </p>

                {/* Tabel Batas Wilayah */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A261D]">
                    Batas Wilayah Administratif
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E2E0D4]">
                      <span className="font-bold text-[#1A261D] block">Utara:</span>
                      <span className="text-[#526356]">Kecamatan Takeran / Persawahan</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E2E0D4]">
                      <span className="font-bold text-[#1A261D] block">Selatan:</span>
                      <span className="text-[#526356]">Desa Sugihrejo / Kawedanan</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E2E0D4]">
                      <span className="font-bold text-[#1A261D] block">Timur:</span>
                      <span className="text-[#526356]">Desa Genengan / Kawedanan</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E2E0D4]">
                      <span className="font-bold text-[#1A261D] block">Barat:</span>
                      <span className="text-[#526356]">Desa Balerejo / Kawedanan</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#EAF2EB] border border-[#3D6E4B]/30 text-xs text-[#1F4D2C] space-y-1">
                  <p className="font-bold">Informasi Administrasi:</p>
                  <p>Kecamatan: Kawedanan &bull; Kabupaten: Magetan &bull; Provinsi: Jawa Timur</p>
                </div>
              </div>

              {/* Map Embed */}
              <div className="lg:col-span-7">
                <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#E2E0D4] bg-slate-100">
                  <iframe
                    title="Peta Wilayah Desa Bogem"
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
        </section>
      </div>
    </div>
  )
}
