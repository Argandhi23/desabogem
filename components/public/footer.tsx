import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Kolom 1: Profil Desa */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                🏛️
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-tight">Desa Bogem</h3>
                <p className="text-xs text-slate-400">Kec. Kawedanan, Kab. Magetan</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Website resmi Pemerintah Desa Bogem sebagai sarana transparansi informasi publik, publikasi berita, dan dokumentasi kegiatan pembangunan desa.
            </p>
            <div className="pt-2 text-xs text-emerald-400 font-medium">
              Program KKN Mandiri &bull; Mahasiswa Teknik Informatika
            </div>
          </div>

          {/* Kolom 2: Jelajahi / Link Cepat */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Jelajahi</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-emerald-400 transition-colors">
                  Profil & Sejarah Desa
                </Link>
              </li>
              <li>
                <Link href="/profil#struktur" className="hover:text-emerald-400 transition-colors">
                  Struktur Organisasi Desa
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-emerald-400 transition-colors">
                  Berita & Pengumuman
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-emerald-400 transition-colors">
                  Galeri Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-emerald-400 transition-colors">
                  Kontak & Lokasi Kantor
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan & Jam Operasional */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Jam Pelayanan</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">Senin - Kamis</p>
                  <p className="text-xs text-slate-400">08:00 - 15:00 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">Jumat</p>
                  <p className="text-xs text-slate-400">08:00 - 11:30 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">Sabtu, Minggu & Hari Libur</p>
                  <p className="text-xs text-slate-400">Tutup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 4: Kontak Kantor Desa */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Kantor Balai Desa</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-xs sm:text-sm">
                  Balai Desa Bogem, Kec. Kawedanan, Kabupaten Magetan, Jawa Timur 63382
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-slate-400 text-xs sm:text-sm">(0351) Kantor Desa Bogem</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-slate-400 text-xs sm:text-sm">desabogem.magetan@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & admin portal button */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link
              href="https://magetankab.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Pemkab Magetan</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/admin/login"
              className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Login Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
