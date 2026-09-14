# FotoTanpaBG

Aplikasi React + Vite untuk menghapus background foto langsung di browser menggunakan `@imgly/background-removal`.

## Menjalankan

1. Install Node.js (versi LTS disarankan).
2. Buka terminal di folder proyek.
3. Jalankan:
   ```
   npm install
   npm run dev
   ```
4. Buka URL lokal yang ditampilkan Vite.

## Build production

```
npm run build
npm run preview
```

## Catatan

- Tidak membutuhkan PHOTOROOM_API_KEY.
- Pemrosesan background removal dilakukan client-side.
- Tiga kartu opsi saat ini menampilkan hasil background removal yang sama; label Natural/Detail/Avatar adalah placeholder UI. Implementasi variasi nyata dapat ditambahkan kemudian.
- Periksa ketentuan lisensi `@imgly/background-removal` (AGPL) sebelum menggunakan proyek ini sebagai layanan komersial.
