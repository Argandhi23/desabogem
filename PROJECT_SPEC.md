# PROJECT SPEC — Website Desa Bogem

> Dokumen ini adalah sumber kebenaran utama (source of truth) untuk proyek ini.
> AI agent WAJIB membaca dan mengikuti dokumen ini di setiap sesi kerja.
> Jangan mengambil keputusan teknis yang bertentangan dengan dokumen ini tanpa konfirmasi ke developer (saya).

---

## 1. Tentang Proyek

- **Nama proyek**: Website Resmi Desa Bogem
- **Lokasi**: Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur
- **Konteks**: Dibuat oleh mahasiswa Teknik Informatika dalam program KKN (Kuliah Kerja Nyata)
- **Tujuan**:
  - Memberikan informasi resmi dan transparan tentang Desa Bogem kepada warga dan masyarakat umum
  - Mempermudah perangkat desa mempublikasikan berita, pengumuman, dan dokumentasi kegiatan
  - Menjadi identitas digital resmi desa yang bisa diakses siapa saja
- **Anggaran**: Rp 0 (tanpa dana). Semua tool, layanan, hosting, dan domain WAJIB menggunakan tier gratis.
- **Keberlanjutan (PENTING)**: Setelah program KKN selesai, website ini akan dikelola oleh **perangkat desa yang awam teknologi**. Maka:
  - Panel admin harus sangat sederhana, visual, dan menggunakan bahasa Indonesia yang umum dipahami (bukan istilah teknis).
  - Hindari fitur yang butuh pemahaman teknis untuk dioperasikan (tidak ada markdown mentah, tidak ada JSON editor, tidak ada terminal/command line untuk operasional harian).

---

## 2. Target Pengguna & Model Akses

Proyek ini punya **dua jenis pengguna** dengan kebutuhan akses yang sangat berbeda:

### A. Pengunjung Publik (Warga, masyarakat umum, siapa saja)
- **TIDAK PERLU LOGIN / TIDAK PERLU REGISTRASI.**
- Hanya bisa **melihat/membaca** konten yang sudah dipublikasikan (read-only).
- Tidak ada interaksi yang mengharuskan akun, seperti komentar berbasis akun, like, atau riwayat pribadi.
- Semua halaman publik harus bisa diakses langsung tanpa hambatan apapun.

### B. Admin (Perangkat Desa)
- **Hanya SATU jenis role admin** — tidak ada tingkatan admin/super-admin/editor yang rumit. Cukup satu jenis akun "Admin" yang bisa kelola semua konten.
- Login menggunakan email + password sederhana melalui Supabase Auth.
- Akun admin dibuat manual oleh developer (saya) melalui Supabase Dashboard — **tidak perlu ada halaman "Daftar/Register" di website**, supaya tidak ada orang luar bisa membuat akun admin sendiri.
- Setelah login, admin diarahkan ke halaman `/admin` (dashboard) untuk mengelola seluruh konten.

> Catatan untuk agent: JANGAN membuat sistem role bertingkat (misal admin/editor/superadmin), JANGAN membuat halaman registrasi publik untuk admin, JANGAN membuat sistem login untuk pengunjung publik. Ini adalah keputusan final, bukan area yang perlu dioptimasi ulang.

---

## 3. Tech Stack (FINAL — jangan diganti tanpa konfirmasi)

| Layer | Teknologi | Catatan |
|---|---|---|
| Frontend Framework | **Next.js** (App Router) | Gunakan App Router, bukan Pages Router |
| Bahasa | **TypeScript** | Bukan JavaScript biasa, untuk type-safety |
| Styling | **Tailwind CSS** | Utility-first, tidak pakai CSS Modules atau styled-components |
| Database & Backend | **Supabase** (PostgreSQL) | Termasuk Supabase Auth dan Supabase Storage |
| Autentikasi | **Supabase Auth** (email + password) | Hanya untuk admin, bukan untuk publik |
| Storage file/gambar | **Supabase Storage** | Untuk foto galeri, dokumen, foto berita |
| Hosting/Deployment | **Vercel** (free tier) | Auto-deploy dari GitHub |
| Version Control | **Git + GitHub** | Commit per fitur, jangan sekali commit besar untuk banyak fitur |
| Rich Text Editor (admin) | **Tiptap** (atau library WYSIWYG setara) | Admin menulis berita dengan editor visual seperti Word, BUKAN markdown mentah |

### Yang TIDAK dipakai (supaya agent tidak improvisasi):
- Tidak pakai CMS eksternal (WordPress, Strapi, dll) — semua dibangun custom dengan stack di atas.
- Tidak pakai state management library tambahan (Redux, Zustand, dll) kecuali benar-benar diperlukan — cukup React state/hooks bawaan dan Supabase client.
- Tidak pakai payment gateway, tidak ada fitur e-commerce.
- Tidak ada multi-bahasa (Indonesia saja).
- Tidak ada aplikasi mobile terpisah — cukup responsive web.

---

## 4. Struktur Fitur

### 4.1 Halaman Publik (Tanpa Login)

1. **Beranda (`/`)**
   - Hero section: nama desa, sambutan singkat/tagline
   - Ringkasan profil desa
   - Berita/pengumuman terbaru (3-5 item terakhir)
   - Statistik singkat desa (jumlah penduduk, jumlah dusun/RT/RW, dll — opsional, input manual oleh admin)
   - Link cepat ke halaman lain

2. **Profil Desa (`/profil`)**
   - Sejarah desa
   - Visi & Misi
   - Struktur organisasi pemerintahan desa (nama kepala desa, perangkat desa, dengan foto jika ada)
   - Peta wilayah (embed Google Maps)
   - Batas wilayah (opsional, teks)

3. **Berita & Pengumuman (`/berita`)**
   - Daftar berita, urut dari terbaru, dengan pagination
   - Halaman detail per berita (`/berita/[slug]`)
   - Setiap berita punya: judul, gambar utama, isi (rich text), tanggal publish, kategori (opsional: Pengumuman/Kegiatan/Umum)

4. **Galeri (`/galeri`)**
   - Grid foto kegiatan desa
   - Bisa dikelompokkan per album/kegiatan (opsional, sesuai kompleksitas yang diinginkan)

5. **Data & Statistik (`/statistik`)** — opsional, bisa fase 2
   - Data kependudukan dasar (jumlah penduduk per dusun, jumlah KK, dll) — input manual oleh admin, ditampilkan dalam bentuk tabel/chart sederhana

6. **Kontak (`/kontak`)**
   - Alamat kantor desa, nomor telepon/WA, jam pelayanan
   - Embed peta lokasi kantor desa
   - TIDAK PAKAI form pengaduan dengan backend rumit di fase awal — cukup informasi kontak statis dulu (bisa jadi fase 2 jika dibutuhkan)

### 4.2 Panel Admin (`/admin`, wajib login)

1. **Login (`/admin/login`)**
   - Form email + password sederhana
   - Redirect ke `/admin/dashboard` setelah berhasil login
   - Tidak ada tombol "Daftar/Register" di halaman ini

2. **Dashboard (`/admin/dashboard`)**
   - Ringkasan singkat: jumlah berita, jumlah foto galeri, dll
   - Menu navigasi ke tiap modul kelola konten

3. **Kelola Berita (`/admin/berita`)**
   - Lihat daftar semua berita (termasuk draft)
   - Tambah berita baru — form dengan: judul, gambar (upload), isi (rich text editor visual), status (Draft/Publish)
   - Edit berita
   - Hapus berita (dengan konfirmasi sebelum hapus)

4. **Kelola Galeri (`/admin/galeri`)**
   - Upload foto (bisa multiple upload)
   - Hapus foto
   - Atur nama album/kegiatan (opsional)

5. **Kelola Profil Desa (`/admin/profil`)**
   - Form untuk edit: sejarah, visi-misi, data perangkat desa (nama, jabatan, foto)
   - Ini bukan CRUD "tambah data baru" biasa, tapi lebih ke edit konten yang sudah ada (semacam "settings" halaman profil)

6. **Kelola Statistik (`/admin/statistik`)** — jika fase statistik diimplementasi
   - Form input angka statistik dasar (jumlah penduduk, dll)

> Catatan untuk agent: setiap halaman admin harus punya UI yang sangat jelas — tombol besar, label berbahasa Indonesia, konfirmasi sebelum aksi destructive (hapus), dan feedback visual jelas (notifikasi "Berhasil disimpan", dll). Asumsikan pengguna admin belum pernah pakai dashboard/CMS apapun sebelumnya.

---

## 5. Prioritas Pengembangan (Roadmap)

Kerjakan bertahap, per modul, jangan sekaligus semua:

**Fase 1 (MVP — wajib ada):**
1. Setup project Next.js + Supabase + Tailwind + deployment Vercel
2. Halaman Beranda (statis dulu, boleh dummy data)
3. Halaman Profil Desa
4. Sistem Berita (publik + admin CRUD) — termasuk auth admin
5. Halaman Kontak (statis)

**Fase 2:**
6. Sistem Galeri (publik + admin)
7. Halaman Statistik dasar

**Fase 3 (opsional, jika masih ada waktu KKN):**
8. Form pengaduan/aspirasi warga (tanpa login, tapi dengan rate limiting sederhana untuk mencegah spam)
9. Peningkatan SEO (meta tags, sitemap, dll)

---

## 6. Keamanan (Non-negotiable)

- Row Level Security (RLS) WAJIB aktif di semua tabel Supabase. Lihat `DATABASE_SCHEMA.md` untuk detail policy.
- Environment variable Supabase `service_role key` TIDAK BOLEH pernah muncul di kode frontend/client-side. Hanya `anon key` yang boleh dipakai di client.
- Semua form input (baik publik maupun admin) harus divalidasi, baik di sisi client maupun sisi server/database.
- File `.env.local` wajib masuk `.gitignore`, tidak boleh ter-commit ke GitHub.
- Upload file (gambar) harus dibatasi tipe file (hanya image: jpg, png, webp) dan ukuran maksimal (misal 5MB) untuk mencegah abuse.

---

## 7. Desain & UI

- Palet warna: gunakan warna yang mencerminkan identitas desa/pemerintahan Indonesia — hijau/biru sebagai warna dasar (mencerminkan alam/pertanian, umum dipakai website desa), dengan aksen netral (putih/abu). Developer akan memberikan referensi visual/wireframe terpisah jika ada.
- Font: gunakan font yang mudah dibaca, standar web-safe atau Google Fonts (misal Inter, atau font lain yang akan ditentukan lebih lanjut).
- Layout publik: clean, informatif, mobile-first (banyak warga akan akses dari HP).
- Layout admin: fokus fungsi, bukan estetika berlebihan — prioritas kemudahan penggunaan.
- Semua halaman WAJIB responsive (mobile, tablet, desktop).

---

## 8. Batasan & Non-Goals (supaya agent tidak over-engineer)

- Tidak perlu multi-bahasa.
- Tidak perlu sistem komentar publik.
- Tidak perlu notifikasi push/email otomatis di fase awal.
- Tidak perlu integrasi pembayaran/e-commerce.
- Tidak perlu aplikasi mobile native.
- Tidak perlu sistem role admin bertingkat — cukup satu jenis admin.
- Tidak perlu registrasi akun untuk publik.
- Tidak perlu real-time features (live chat, dll) di fase awal.

---

## 9. Cara Kerja dengan AI Agent (Workflow)

- Kerjakan satu modul/fitur dalam satu waktu, sesuai urutan roadmap di bagian 5.
- Setelah agent generate kode untuk satu fitur, developer akan review sebelum lanjut ke fitur berikutnya.
- Commit ke Git per fitur selesai, dengan pesan commit yang jelas (bahasa Indonesia atau Inggris, konsisten).
- Jika ada bagian requirement yang ambigu, agent harus **bertanya ke developer**, bukan mengambil asumsi sendiri, terutama untuk hal yang berkaitan dengan keamanan (RLS policy) dan model akses (login/tanpa login).
- Rujuk selalu ke `DATABASE_SCHEMA.md` untuk struktur tabel dan policy sebelum membuat query atau tabel baru.
