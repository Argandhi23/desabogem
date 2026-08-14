export type KategoriBerita = 'pengumuman' | 'kegiatan' | 'umum'
export type StatusBerita = 'draft' | 'published'

export interface Berita {
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

export interface BeritaInsert {
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

export interface BeritaUpdate {
  judul?: string
  slug?: string
  konten?: string
  gambar_url?: string | null
  kategori?: KategoriBerita
  status?: StatusBerita
  dibuat_oleh?: string | null
  updated_at?: string
}

export interface Galeri {
  id: string
  judul_album: string
  gambar_url: string
  deskripsi: string | null
  dibuat_oleh: string | null
  created_at: string
}

export interface GaleriInsert {
  id?: string
  judul_album: string
  gambar_url: string
  deskripsi?: string | null
  dibuat_oleh?: string | null
  created_at?: string
}

export interface ProfilDesa {
  id: number
  sejarah: string | null
  visi: string | null
  misi: string | null
  sambutan_kepala_desa: string | null
  alamat_kantor: string | null
  nomor_telepon: string | null
  updated_at: string
}

export interface ProfilDesaUpdate {
  sejarah?: string | null
  visi?: string | null
  misi?: string | null
  sambutan_kepala_desa?: string | null
  alamat_kantor?: string | null
  nomor_telepon?: string | null
  updated_at?: string
}

export interface PerangkatDesa {
  id: string
  nama: string
  jabatan: string
  foto_url: string | null
  urutan: number
  created_at: string
}

export interface PerangkatDesaInsert {
  id?: string
  nama: string
  jabatan: string
  foto_url?: string | null
  urutan?: number
  created_at?: string
}

export interface PerangkatDesaUpdate {
  nama?: string
  jabatan?: string
  foto_url?: string | null
  urutan?: number
}

export interface StatistikDesa {
  id: string
  label: string
  nilai: string
  satuan: string | null
  updated_at: string
}

export interface StatistikDesaInsert {
  id?: string
  label: string
  nilai: string
  satuan?: string | null
  updated_at?: string
}

export interface StatistikDesaUpdate {
  label?: string
  nilai?: string
  satuan?: string | null
  updated_at?: string
}

export type StorageBucket = 'gambar-berita' | 'gambar-galeri' | 'foto-perangkat-desa'

export interface Database {
  public: {
    Tables: {
      berita: {
        Row: Berita
        Insert: BeritaInsert
        Update: BeritaUpdate
      }
      galeri: {
        Row: Galeri
        Insert: GaleriInsert
        Update: Partial<GaleriInsert>
      }
      profil_desa: {
        Row: ProfilDesa
        Insert: Partial<ProfilDesa>
        Update: ProfilDesaUpdate
      }
      perangkat_desa: {
        Row: PerangkatDesa
        Insert: PerangkatDesaInsert
        Update: PerangkatDesaUpdate
      }
      statistik_desa: {
        Row: StatistikDesa
        Insert: StatistikDesaInsert
        Update: StatistikDesaUpdate
      }
    }
  }
}
