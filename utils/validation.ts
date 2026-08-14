export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export interface ImageValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validasi file gambar sebelum diunggah ke Supabase Storage
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Harap gunakan format JPG, PNG, atau WEBP.',
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Ukuran file terlalu besar. Maksimal ukuran gambar adalah 5MB.',
    }
  }

  return { valid: true }
}
