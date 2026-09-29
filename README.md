# Gilang's Digital Gateway

Gilang's Digital Gateway adalah landing page statis yang menjadi portal ke karya dan proyek digital Gilang Nur Maulida Faid. Desain bertema galaksi menempatkan gerbang 3D interaktif sebagai fokus visual, dengan tautan proyek yang bisa dibuka langsung dari halaman.

## Fitur

- Scene 3D berisi gerbang bercahaya, bintang, partikel, dan objek yang mengorbit.
- Gerbang dapat diputar dengan menyeret menggunakan mouse atau sentuhan.
- Daftar tujuan dibuat dari data, sehingga label dan tautannya mudah diperbarui.
- Tautan tujuan dibuka di tab baru; URL dibatasi ke protokol HTTP dan HTTPS.
- Jika Three.js atau WebGL tidak tersedia, halaman menampilkan tampilan alternatif dan tautan tetap dapat digunakan.
- Tata letak menyesuaikan ukuran layar dan menghormati preferensi `prefers-reduced-motion`.

## Menjalankan secara lokal

Buka `index.html` di browser modern. Tidak ada proses build atau instalasi dependency. Koneksi internet diperlukan untuk memuat Three.js dan font dari CDN; tanpa koneksi, halaman tetap dapat menampilkan tautan proyek, tetapi scene 3D dan font eksternal mungkin tidak tersedia.

## Mengubah konten

Edit `js/data.js` untuk memperbarui judul dan deskripsi halaman, lokasi profil, atau daftar tujuan. Setiap tujuan menggunakan `id`, `label`, `url`, `description`, dan `color`. Tautan yang ditampilkan saat JavaScript tidak aktif juga tersedia di bagian `<noscript>` pada `index.html`.

## Struktur berkas

| Berkas | Kegunaan |
| --- | --- |
| `index.html` | Struktur halaman, metadata, dan pemuatan stylesheet serta skrip |
| `css/style.css` | Tampilan visual, tata letak responsif, dan animasi antarmuka |
| `js/data.js` | Konten profil dan daftar tautan tujuan |
| `js/main.js` | Rendering tautan, inisialisasi scene Three.js, dan interaksi |
