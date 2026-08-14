'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Home,
  Building2,
  Newspaper,
  Image as ImageIcon,
  BarChart3,
  Phone,
  ShieldCheck,
} from 'lucide-react'

const navLinks = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Profil Desa', href: '/profil', icon: Building2 },
  { name: 'Berita', href: '/berita', icon: Newspaper },
  { name: 'Galeri', href: '/galeri', icon: ImageIcon },
  { name: 'Statistik', href: '/statistik', icon: BarChart3 },
  { name: 'Kontak', href: '/kontak', icon: Phone },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E0D4] transition-all">
      {/* Top Banner Bar */}
      <div className="bg-[#173C22] text-[#EAF2EB] text-xs py-1.5 px-4 sm:px-8 border-b border-[#1F4D2C]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C89726]"></span>
            <span className="font-medium tracking-wide">
              Website Resmi Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#D3E2D6]">
            <span>Pelayanan Kantor: Senin – Jumat (08:00 – 15:00 WIB)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-10 h-12 sm:w-11 sm:h-13 shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Lambang Kabupaten Magetan - Desa Bogem"
                width={44}
                height={52}
                priority
                className="object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#1A261D] text-lg sm:text-xl tracking-tight leading-none group-hover:text-[#1F4D2C] transition-colors">
                DESA BOGEM
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#526356] tracking-wider uppercase mt-1">
                Kec. Kawedanan &bull; Kab. Magetan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'text-[#1F4D2C] bg-[#EAF2EB] shadow-2xs font-bold'
                      : 'text-[#526356] hover:text-[#1F4D2C] hover:bg-[#F8F7F2]'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Action / Admin Link */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#526356] hover:text-[#1F4D2C] hover:bg-[#EAF2EB] rounded-xl transition-colors border border-[#E2E0D4] hover:border-[#1F4D2C]/30"
              title="Portal Khusus Perangkat Desa"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F4D2C]" />
              <span>Login Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2.5 rounded-xl text-[#1A261D] hover:bg-[#EAF2EB] focus:outline-none focus:ring-2 focus:ring-[#1F4D2C]"
              aria-label="Buka Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#E2E0D4] bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  active
                    ? 'bg-[#EAF2EB] text-[#1F4D2C] font-bold'
                    : 'text-[#1A261D] hover:bg-[#F8F7F2] hover:text-[#1F4D2C]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#1F4D2C]' : 'text-[#526356]'}`} />
                {item.name}
              </Link>
            )
          })}
          <div className="pt-4 mt-2 border-t border-[#E2E0D4]">
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#1A261D] bg-[#F8F7F2] hover:bg-[#EAF2EB] border border-[#E2E0D4] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F4D2C]" />
              <span>Login Perangkat Desa</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
