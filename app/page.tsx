import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-slate-50 p-6 text-center">
      <div className="max-w-2xl mx-auto space-y-6 bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-100">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          Website Resmi Desa
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Pemerintah Desa Bogem
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur
        </p>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Fondasi sistem dan struktur project Next.js + Supabase telah berhasil diinisialisasi.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link href="/admin/login">
            <Button variant="outline" size="md">
              Panel Admin
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
