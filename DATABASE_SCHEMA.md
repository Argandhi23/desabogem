# DATABASE SCHEMA — Website Desa Bogem (Supabase / PostgreSQL)

> Dokumen ini adalah rujukan wajib untuk struktur database.
> AI agent WAJIB mengikuti skema ini. Jangan membuat tabel baru atau mengubah struktur
> tanpa mengupdate dokumen ini terlebih dahulu dan mengonfirmasi ke developer.

---

## Prinsip Model Akses (PENTING — baca sebelum membuat RLS policy)

- **Publik (pengunjung website)**: TIDAK memiliki akun/login. Akses ke database dilakukan menggunakan **anon key** Supabase. Publik hanya boleh melakukan `SELECT` (baca) pada data yang statusnya "published"/"aktif". Publik TIDAK BOLEH melakukan `INSERT`, `UPDATE`, atau `DELETE` sama sekali.
- **Admin (perangkat desa)**: Login melalui Supabase Auth (email+password). Hanya ADA SATU jenis role admin — tidak ada tingkatan. Setelah login, admin (melalui `auth.uid()`) boleh melakukan `SELECT`, `INSERT`, `UPDATE`, `DELETE` pada semua tabel konten.
- Akun admin **dibuat manual oleh developer** melalui Supabase Dashboard (Authentication > Users), BUKAN melalui halaman registrasi di website. Karena itu tidak ada tabel `profiles` dengan role kompleks — cukup cek apakah user tersebut sudah login (`auth.uid() IS NOT NULL`) untuk menentukan hak akses admin, karena memang hanya admin yang punya akun.

---

## Daftar Tabel

### 1. `berita`

Menyimpan berita dan pengumuman desa.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `judul` | `text` | Wajib diisi |
| `slug` | `text` | Unique, untuk URL (`/berita/slug-ini`), auto-generate dari judul |
| `konten` | `text` | Isi berita dalam format HTML (hasil dari rich text editor) |
| `gambar_url` | `text` | URL gambar utama, hasil upload ke Supabase Storage. Nullable. |
| `kategori` | `text` | Nilai: `'pengumuman'`, `'kegiatan'`, `'umum'`. Default `'umum'` |
| `status` | `text` | Nilai: `'draft'` atau `'published'`. Default `'draft'` |
| `dibuat_oleh` | `uuid` | Foreign key ke `auth.users.id`, nullable |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()`, di-update otomatis via trigger saat ada perubahan |

```sql
create table berita (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text not null unique,
  konten text not null,
  gambar_url text,
  kategori text not null default 'umum' check (kategori in ('pengumuman', 'kegiatan', 'umum')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  dibuat_oleh uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table berita enable row level security;

-- Publik hanya boleh baca berita yang sudah published
create policy "Publik bisa baca berita published"
  on berita for select
  to anon
  using (status = 'published');

-- Admin (user yang sudah login) boleh baca semua termasuk draft
create policy "Admin bisa baca semua berita"
  on berita for select
  to authenticated
  using (true);

-- Admin boleh insert
create policy "Admin bisa tambah berita"
  on berita for insert
  to authenticated
  with check (true);

-- Admin boleh update
create policy "Admin bisa edit berita"
  on berita for update
  to authenticated
  using (true)
  with check (true);

-- Admin boleh delete
create policy "Admin bisa hapus berita"
  on berita for delete
  to authenticated
  using (true);
```

---

### 2. `galeri`

Menyimpan foto kegiatan/dokumentasi desa.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `judul_album` | `text` | Nama kegiatan/album, boleh sama untuk banyak foto dalam satu kegiatan |
| `gambar_url` | `text` | URL foto, hasil upload ke Supabase Storage |
| `deskripsi` | `text` | Nullable, keterangan singkat foto |
| `dibuat_oleh` | `uuid` | Foreign key ke `auth.users.id`, nullable |
| `created_at` | `timestamptz` | Default `now()` |

```sql
create table galeri (
  id uuid primary key default gen_random_uuid(),
  judul_album text not null,
  gambar_url text not null,
  deskripsi text,
  dibuat_oleh uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table galeri enable row level security;

create policy "Publik bisa baca galeri"
  on galeri for select
  to anon
  using (true);

create policy "Admin bisa baca semua galeri"
  on galeri for select
  to authenticated
  using (true);

create policy "Admin bisa tambah galeri"
  on galeri for insert
  to authenticated
  with check (true);

create policy "Admin bisa edit galeri"
  on galeri for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin bisa hapus galeri"
  on galeri for delete
  to authenticated
  using (true);
```

> Catatan: tabel galeri tidak punya kolom `status` (draft/published) karena diasumsikan begitu diupload langsung tampil publik. Jika nanti dibutuhkan draft mode untuk galeri, tambahkan kolom `status` seperti pada tabel `berita`.

---

### 3. `profil_desa`

Menyimpan konten profil desa yang sifatnya "satu data yang diedit", bukan banyak baris data (semacam settings/pengaturan halaman). Cukup **satu baris** yang terus di-update oleh admin.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `int` | Primary key, gunakan nilai tetap `1` (single row table) |
| `sejarah` | `text` | Nullable |
| `visi` | `text` | Nullable |
| `misi` | `text` | Nullable |
| `sambutan_kepala_desa` | `text` | Nullable, ditampilkan di beranda |
| `alamat_kantor` | `text` | Nullable |
| `nomor_telepon` | `text` | Nullable |
| `updated_at` | `timestamptz` | Default `now()` |

```sql
create table profil_desa (
  id int primary key default 1,
  sejarah text,
  visi text,
  misi text,
  sambutan_kepala_desa text,
  alamat_kantor text,
  nomor_telepon text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- Insert baris default agar selalu ada 1 baris untuk diedit
insert into profil_desa (id) values (1);

alter table profil_desa enable row level security;

create policy "Publik bisa baca profil desa"
  on profil_desa for select
  to anon
  using (true);

create policy "Admin bisa baca profil desa"
  on profil_desa for select
  to authenticated
  using (true);

create policy "Admin bisa update profil desa"
  on profil_desa for update
  to authenticated
  using (true)
  with check (true);

-- Tidak perlu policy insert/delete karena baris sudah fix satu (id=1)
```

---

### 4. `perangkat_desa`

Menyimpan daftar struktur organisasi/perangkat desa (banyak baris, satu baris per orang).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `nama` | `text` | Wajib |
| `jabatan` | `text` | Wajib, misal "Kepala Desa", "Sekretaris Desa", "Kepala Dusun ..." |
| `foto_url` | `text` | Nullable |
| `urutan` | `int` | Untuk mengatur urutan tampil (kepala desa di atas, dst), default `0` |
| `created_at` | `timestamptz` | Default `now()` |

```sql
create table perangkat_desa (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text not null,
  foto_url text,
  urutan int not null default 0,
  created_at timestamptz not null default now()
);

alter table perangkat_desa enable row level security;

create policy "Publik bisa baca perangkat desa"
  on perangkat_desa for select
  to anon
  using (true);

create policy "Admin bisa baca semua perangkat desa"
  on perangkat_desa for select
  to authenticated
  using (true);

create policy "Admin bisa tambah perangkat desa"
  on perangkat_desa for insert
  to authenticated
  with check (true);

create policy "Admin bisa edit perangkat desa"
  on perangkat_desa for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin bisa hapus perangkat desa"
  on perangkat_desa for delete
  to authenticated
  using (true);
```

---

### 5. `statistik_desa` (Fase 2, opsional)

Menyimpan data statistik dasar kependudukan, diinput manual oleh admin.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `label` | `text` | Misal "Jumlah Penduduk", "Jumlah KK", "Jumlah Dusun" |
| `nilai` | `text` | Nilai statistik, disimpan sebagai text agar fleksibel (bisa angka atau teks) |
| `satuan` | `text` | Nullable, misal "Jiwa", "KK" |
| `updated_at` | `timestamptz` | Default `now()` |

```sql
create table statistik_desa (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  nilai text not null,
  satuan text,
  updated_at timestamptz not null default now()
);

alter table statistik_desa enable row level security;

create policy "Publik bisa baca statistik"
  on statistik_desa for select
  to anon
  using (true);

create policy "Admin bisa kelola statistik select"
  on statistik_desa for select
  to authenticated
  using (true);

create policy "Admin bisa tambah statistik"
  on statistik_desa for insert
  to authenticated
  with check (true);

create policy "Admin bisa edit statistik"
  on statistik_desa for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin bisa hapus statistik"
  on statistik_desa for delete
  to authenticated
  using (true);
```

---

## Supabase Storage (Bucket)

Buat bucket berikut di Supabase Storage:

### Bucket: `gambar-berita`
- Public bucket (agar gambar bisa diakses langsung via URL tanpa auth)
- Policy: hanya `authenticated` (admin) yang boleh upload/hapus, `anon`/public boleh `SELECT`/download

### Bucket: `gambar-galeri`
- Sama seperti di atas: public read, admin-only write

### Bucket: `foto-perangkat-desa`
- Sama seperti di atas: public read, admin-only write

```sql
-- Contoh policy storage (jalankan di Supabase SQL Editor, sesuaikan nama bucket)
create policy "Public bisa lihat gambar berita"
  on storage.objects for select
  to anon
  using (bucket_id = 'gambar-berita');

create policy "Admin bisa upload gambar berita"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gambar-berita');

create policy "Admin bisa hapus gambar berita"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gambar-berita');

-- Ulangi pola yang sama untuk bucket 'gambar-galeri' dan 'foto-perangkat-desa'
```

**Batasan upload (terapkan di sisi aplikasi/frontend sebelum upload):**
- Tipe file: hanya `image/jpeg`, `image/png`, `image/webp`
- Ukuran maksimal: 5MB per file

---

## Trigger: Auto-update `updated_at`

Untuk tabel yang punya kolom `updated_at` (`berita`, `profil_desa`, `statistik_desa`), gunakan trigger agar otomatis terisi saat ada perubahan:

```sql
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_berita
  before update on berita
  for each row execute function update_updated_at_column();

create trigger set_updated_at_profil_desa
  before update on profil_desa
  for each row execute function update_updated_at_column();

create trigger set_updated_at_statistik_desa
  before update on statistik_desa
  for each row execute function update_updated_at_column();
```

---

## Catatan Penting untuk Agent

1. **Jangan membuat tabel `profiles` atau tabel role/permission tambahan.** Model akses di proyek ini sengaja sederhana: hanya ada dua kategori — `anon` (publik, read-only) dan `authenticated` (admin, full access). Tidak ada tingkatan role di dalam `authenticated`.
2. **Jangan membuat halaman/endpoint registrasi (`sign up`) untuk admin.** Akun admin dibuat manual oleh developer lewat Supabase Dashboard.
3. Semua tabel WAJIB mengaktifkan Row Level Security (`enable row level security`). Jangan pernah membuat tabel tanpa RLS di proyek ini.
4. Gunakan `anon key` di seluruh kode frontend (baik halaman publik maupun admin). `service_role key` tidak boleh dipakai di frontend sama sekali — hanya relevan jika suatu saat dibutuhkan server-side function khusus (belum diperlukan di scope proyek ini).
5. Jika agent merasa perlu menambah tabel atau kolom baru di luar dokumen ini, **agent harus berhenti dan menanyakan ke developer terlebih dahulu**, bukan langsung membuat migrasi sendiri.
