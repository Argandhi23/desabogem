export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type KategoriBerita = 'pengumuman' | 'kegiatan' | 'umum'
export type StatusBerita = 'draft' | 'published'

export type Database = {
  public: {
    Tables: {
      berita: {
        Row: {
          id: string
          judul: string
          slug: string
          konten: string
          gambar_url: string | null
          kategori: KategoriBerita
          status: StatusBerita
          dibuat_oleh: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          judul: string
          slug: string
          konten: string
          gambar_url?: string | null
          kategori?: KategoriBerita
          status?: StatusBerita
          dibuat_oleh?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          judul?: string
          slug?: string
          konten?: string
          gambar_url?: string | null
          kategori?: KategoriBerita
          status?: StatusBerita
          dibuat_oleh?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "berita_dibuat_oleh_fkey"
            columns: ["dibuat_oleh"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      galeri: {
        Row: {
          id: string
          judul_album: string
          gambar_url: string
          deskripsi: string | null
          dibuat_oleh: string | null
          created_at: string
        }
        Insert: {
          id?: string
          judul_album: string
          gambar_url: string
          deskripsi?: string | null
          dibuat_oleh?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          judul_album?: string
          gambar_url?: string
          deskripsi?: string | null
          dibuat_oleh?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "galeri_dibuat_oleh_fkey"
            columns: ["dibuat_oleh"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profil_desa: {
        Row: {
          id: number
          sejarah: string | null
          visi: string | null
          misi: string | null
          sambutan_kepala_desa: string | null
          alamat_kantor: string | null
          nomor_telepon: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          sejarah?: string | null
          visi?: string | null
          misi?: string | null
          sambutan_kepala_desa?: string | null
          alamat_kantor?: string | null
          nomor_telepon?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          sejarah?: string | null
          visi?: string | null
          misi?: string | null
          sambutan_kepala_desa?: string | null
          alamat_kantor?: string | null
          nomor_telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      perangkat_desa: {
        Row: {
          id: string
          nama: string
          jabatan: string
          foto_url: string | null
          urutan: number
          created_at: string
        }
        Insert: {
          id?: string
          nama: string
          jabatan: string
          foto_url?: string | null
          urutan?: number
          created_at?: string
        }
        Update: {
          id?: string
          nama?: string
          jabatan?: string
          foto_url?: string | null
          urutan?: number
          created_at?: string
        }
        Relationships: []
      }
      statistik_desa: {
        Row: {
          id: string
          label: string
          nilai: string
          satuan: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          label: string
          nilai: string
          satuan?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          nilai?: string
          satuan?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Aliases untuk mempermudah penggunaan di komponen
export type Berita = Database['public']['Tables']['berita']['Row']
export type BeritaInsert = Database['public']['Tables']['berita']['Insert']
export type BeritaUpdate = Database['public']['Tables']['berita']['Update']

export type Galeri = Database['public']['Tables']['galeri']['Row']
export type GaleriInsert = Database['public']['Tables']['galeri']['Insert']
export type GaleriUpdate = Database['public']['Tables']['galeri']['Update']

export type ProfilDesa = Database['public']['Tables']['profil_desa']['Row']
export type ProfilDesaUpdate = Database['public']['Tables']['profil_desa']['Update']

export type PerangkatDesa = Database['public']['Tables']['perangkat_desa']['Row']
export type PerangkatDesaInsert = Database['public']['Tables']['perangkat_desa']['Insert']
export type PerangkatDesaUpdate = Database['public']['Tables']['perangkat_desa']['Update']

export type StatistikDesa = Database['public']['Tables']['statistik_desa']['Row']
export type StatistikDesaInsert = Database['public']['Tables']['statistik_desa']['Insert']
export type StatistikDesaUpdate = Database['public']['Tables']['statistik_desa']['Update']

export type StorageBucket = 'gambar-berita' | 'gambar-galeri' | 'foto-perangkat-desa'
