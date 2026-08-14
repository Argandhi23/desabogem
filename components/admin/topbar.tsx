'use client'

import React, { useState } from 'react'
import { Menu, X, ShieldCheck } from 'lucide-react'
import { AdminSidebar } from './sidebar'

export function AdminTopbar({ userEmail }: { userEmail?: string }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-semibold text-slate-800 hidden sm:inline">
              Panel Pengelola Konten Desa Bogem
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium truncate max-w-[180px]">
              {userEmail || 'Admin Perangkat Desa'}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
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
