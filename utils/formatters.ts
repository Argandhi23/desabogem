/**
 * Format tanggal ISO string ke format bahasa Indonesia yang mudah dibaca (misal: "14 Agustus 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * Format tanggal beserta waktu (misal: "14 Agustus 2026, 10.30 WIB")
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * Mengubah string judul menjadi URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Ganti spasi dengan tanda minus
    .replace(/[^\w-]+/g, '') // Hapus karakter non-alfanumerik kecuali strip
    .replace(/--+/g, '-') // Ganti double strip menjadi satu strip
    .replace(/^-+/, '') // Trim strip di awal
    .replace(/-+$/, '') // Trim strip di akhir
}

/**
 * Memotong teks panjang dan menambahkan ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Membersihkan tag HTML untuk ringkasan teks berita
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').trim()
}
