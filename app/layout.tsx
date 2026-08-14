import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Desa Bogem',
    default: 'Website Resmi Desa Bogem - Kec. Kawedanan, Kab. Magetan',
  },
  description:
    'Website resmi Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur. Pusat transparansi informasi, profil desa, berita, dan layanan masyarakat.',
  keywords: [
    'Desa Bogem',
    'Bogem Kawedanan',
    'Magetan',
    'Website Desa Bogem',
    'Pemerintah Desa Bogem',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  )
}
