'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, Mail, ArrowLeft, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Email atau kata sandi tidak cocok. Silakan periksa kembali.')
        } else {
          setErrorMessage('Gagal masuk ke sistem: ' + error.message)
        }
        setIsLoading(false)
        return
      }

      if (data?.session) {
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch {
      setErrorMessage('Terjadi kendala koneksi ke server. Silakan coba lagi.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#1F4D2C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-20 mx-auto flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo Magetan"
              width={60}
              height={72}
              priority
              className="object-contain drop-shadow-sm"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A261D] tracking-tight">
            Portal Admin Desa Bogem
          </h1>
          <p className="text-xs sm:text-sm text-[#526356]">
            Sistem Informasi & Pengelolaan Konten Website Desa
          </p>
        </div>

        {/* Card Form Login */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E0D4] shadow-md space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#1A261D]"
              >
                Alamat Email Pengelola
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#526356] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@desabogem.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E0D4] bg-[#F8F7F2] text-[#1A261D] placeholder:text-[#8C9C90] text-sm focus:outline-none focus:border-[#1F4D2C] focus:bg-white focus:ring-1 focus:ring-[#1F4D2C] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#1A261D]"
              >
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#526356] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E0D4] bg-[#F8F7F2] text-[#1A261D] placeholder:text-[#8C9C90] text-sm focus:outline-none focus:border-[#1F4D2C] focus:bg-white focus:ring-1 focus:ring-[#1F4D2C] transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-md"
              >
                Masuk ke Panel Pengelola
              </Button>
            </div>
          </form>
        </div>

        {/* Footer Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#526356] hover:text-[#1F4D2C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Utama Website</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
