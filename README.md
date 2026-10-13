# GF Portals

Landing page statis untuk menjelajahi karya dan proyek digital Gilang. Website dibuat dengan Vite, React, TypeScript, dan Tailwind CSS; tidak menggunakan backend, API, atau konten 3D.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Untuk memeriksa build produksi:

```bash
npm run build
npm run preview
```

## Deploy ke Vercel

Impor repository ke Vercel, pilih preset **Vite**, lalu gunakan `npm run build` sebagai build command dan `dist` sebagai output directory. Tidak diperlukan environment variable atau backend.

## Mengubah konten

- **Teks tujuan, deskripsi, dan URL:** array `destinations` di `src/App.tsx`.
- **Nama, tagline, lokasi, hero, dan footer:** markup utama di `src/App.tsx`.
- **Warna, font, responsivitas, dan animasi:** custom properties serta aturan CSS di `src/index.css`.
- **Judul tab, SEO, Open Graph, dan fallback tanpa JavaScript:** `index.html`.
- **Ikon tab:** `favicon.svg`.

Daftar tujuan saat ini memuat empat proyek: Portfolio, Website Kelas, Aplikasi Flutter, dan Website Lomba ITX.
