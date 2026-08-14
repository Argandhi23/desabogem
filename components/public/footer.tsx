import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#173C22] text-[#EAF2EB] border-t border-[#1F4D2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Kolom 1: Identitas Desa & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-14 shrink-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Lambang Kabupaten Magetan - Desa Bogem"
                  width={48}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg tracking-tight leading-tight">
                  Pemerintah Desa Bogem
                </h3>
                <p className="text-xs font-semibold text-[#C89726] tracking-wider uppercase">
                  Kec. Kawedanan &bull; Kab. Magetan
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#D3E2D6] leading-relaxed">
              Website resmi Pemerintah Desa Bogem sebagai sarana transparansi informasi publik, publikasi berita pembangunan, dan dokumentasi kegiatan masyarakat desa.
            </p>
            <div className="pt-2 text-xs text-[#C89726] font-semibold">
              Kecamatan Kawedanan &bull; Kabupaten Magetan, Jawa Timur
            </div>
          </div>

          {/* Kolom 2: Jelajahi / Link Cepat */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Jelajahi Portal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-[#D3E2D6] hover:text-[#C89726] transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="/profil" className="text-[#D3E2D6] hover:text-[#C89726] transition-colors">
                  Profil & Sejarah Desa
                </Link>
              </li>
              <li>
                <Link href="/profil#struktur" className="text-[#D3E2D6] hover:text-[#C89726] transition-colors">
                  Struktur Perangkat Desa
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-[#D3E2D6] hover:text-[#C89726] transition-colors">
                  Berita & Pengumuman
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-[#D3E2D6] hover:text-[#C89726] transition-colors">
                  Galeri Foto Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/statistik" className="text-[#D3E2D6] hover:text-[#C89726] transition-colors">
                  Data & Statistik Demografi
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-[#D3E2D6] hover:text-[#C89726] transition-colors">
                  Kontak Balai Desa
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Jam Pelayanan Kantor */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Jam Pelayanan Kantor
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C89726] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Senin – Kamis</p>
                  <p className="text-xs text-[#D3E2D6]">08:00 – 15:00 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C89726] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Jumat</p>
                  <p className="text-xs text-[#D3E2D6]">08:00 – 11:30 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Sabtu, Minggu & Hari Libur</p>
                  <p className="text-xs text-[#D3E2D6]">Tutup / Pelayanan Libur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 4: Alamat & Kontak */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Kantor Balai Desa
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C89726] shrink-0 mt-0.5" />
                <span className="text-[#D3E2D6]">
                  Balai Desa Bogem, Kec. Kawedanan, Kabupaten Magetan, Jawa Timur 63382
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C89726] shrink-0" />
                <span className="text-[#D3E2D6]">(0351) Kantor Desa Bogem</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C89726] shrink-0" />
                <span className="text-[#D3E2D6] font-mono text-xs">
                  desabogem.magetan@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & admin portal button */}
        <div className="mt-12 pt-8 border-t border-[#1F4D2C] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#D3E2D6]">
          <p>© {currentYear} Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan.</p>
          <div className="flex items-center gap-6">
            <Link
              href="https://magetankab.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C89726] transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Portal Pemkab Magetan</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/admin/login"
              className="hover:text-[#C89726] transition-colors inline-flex items-center gap-1.5 font-semibold text-white bg-[#1F4D2C] px-3 py-1.5 rounded-lg border border-[#3D6E4B]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C89726]" />
              <span>Login Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
