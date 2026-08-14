import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Desa Bogem',
    default: 'Website Resmi Desa Bogem - Kec. Kawedanan, Kab. Magetan',
  },
  description:
    'Website resmi Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur. Pusat transparansi informasi publik, profil desa, berita pembangunan, dan layanan warga.',
  keywords: [
    'Desa Bogem',
    'Bogem Kawedanan',
    'Magetan',
    'Website Desa Bogem',
    'Pemerintah Desa Bogem',
    'Kabupaten Magetan',
  ],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F8F7F2] text-[#1A261D]">
        {children}
      </body>
    </html>
  )
}
