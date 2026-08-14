'use client'

import React, { useState } from 'react'
import { Menu, X, ShieldCheck } from 'lucide-react'
import { AdminSidebar } from './sidebar'

export function AdminTopbar({ userEmail }: { userEmail?: string }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-[#E2E0D4] h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-xl text-[#1A261D] hover:bg-[#F8F7F2] cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F4D2C]"></span>
            <span className="text-sm font-bold text-[#1A261D] hidden sm:inline">
              Panel Pengelola Konten &bull; Desa Bogem
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F7F2] border border-[#E2E0D4] text-xs text-[#1A261D]">
            <ShieldCheck className="w-4 h-4 text-[#1F4D2C]" />
            <span className="font-semibold truncate max-w-[180px]">
              {userEmail || 'Admin Perangkat Desa'}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#173C22] shadow-2xl">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-[#D3E2D6] hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AdminSidebar onCloseMobile={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
