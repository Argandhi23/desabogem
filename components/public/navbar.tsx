'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Home,
  Building2,
  Newspaper,
  Image as ImageIcon,
  Phone,
  ShieldCheck,
} from 'lucide-react'

const navLinks = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Profil Desa', href: '/profil', icon: Building2 },
  { name: 'Berita', href: '/berita', icon: Newspaper },
  { name: 'Galeri', href: '/galeri', icon: ImageIcon },
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top emergency / quick info bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Portal Resmi Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200">
            <span>Jam Pelayanan: Senin - Jumat (08:00 - 15:00 WIB)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                DESA BOGEM
              </span>
              <span className="text-xs font-medium text-slate-500 tracking-wide">
                Kec. Kawedanan • Kab. Magetan
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-emerald-700 bg-emerald-50 font-semibold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Action / Admin Link */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Khusus Perangkat Desa"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              aria-label="Buka Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            )
          })}
          <div className="pt-4 mt-2 border-t border-slate-100">
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Login Perangkat Desa</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
