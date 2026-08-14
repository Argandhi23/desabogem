'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  Building2,
  BarChart3,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Kelola Berita', href: '/admin/berita', icon: Newspaper },
  { name: 'Kelola Galeri', href: '/admin/galeri', icon: ImageIcon },
  { name: 'Profil Desa', href: '/admin/profil', icon: Building2 },
  { name: 'Data Statistik', href: '/admin/statistik', icon: BarChart3 },
]

export function AdminSidebar({
  onCloseMobile,
}: {
  onCloseMobile?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-[#173C22] text-[#EAF2EB] flex flex-col justify-between h-full border-r border-[#1F4D2C]">
      {/* Top Header */}
      <div>
        <div className="p-6 border-b border-[#1F4D2C]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="relative w-9 h-11 shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo Magetan"
                width={36}
                height={44}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
                PANEL ADMIN
              </h1>
              <p className="text-xs text-[#C89726] font-semibold mt-1">Desa Bogem, Kawedanan</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#A7C4AF]">
            Menu Administrasi
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#1F4D2C] text-white font-bold border border-[#3D6E4B] shadow-sm'
                    : 'text-[#D3E2D6] hover:text-white hover:bg-[#1F4D2C]/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#C89726]' : 'text-[#A7C4AF]'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#1F4D2C] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#D3E2D6] hover:text-white hover:bg-[#1F4D2C] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#C89726]" />
            <span>Lihat Website Publik</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 hover:text-red-100 hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  )
}
