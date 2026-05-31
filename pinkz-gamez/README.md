# 🎮 Pinkz Gamez — Panduan Deploy ke Cloudflare Pages

Website ini siap deploy ke Cloudflare Pages (gratis, tanpa backend).

---

## 📁 Struktur File Final

```
pinkz-gamez/
├── index.html          ← Landing page utama
├── booking.html        ← Form booking → WA
├── games.html          ← Game list dengan cover art
├── kontak.html         ← Kontak, maps, jam buka
├── css/
│   └── main.css        ← Semua styling
├── js/
│   ├── app.js          ← Navbar, animasi, menu tabs (shared)
│   ├── booking.js      ← Logic form booking + WA redirect
│   └── games.js        ← Load games.json + RAWG API
├── data/
│   └── games.json      ← Daftar game (edit bebas!)
├── video/
│   └── hero.mp4        ← Video hero (opsional)
└── img/
    ├── logo.png
    ├── favicon.png
    ├── hero-bg.jpg     ← Fallback jika hero.mp4 tidak ada
    ├── unit-ps4.jpg
    ├── unit-ps5.jpg
    ├── suasana-1.jpg
    └── suasana-2.jpg
```

---

## 🖼️ Gambar yang Perlu Kamu Siapkan

Taruh semua file ini di folder `img/` dengan **nama persis** seperti berikut:

| File | Ukuran Ideal | Keterangan |
|------|-------------|------------|
| `logo.png` | 200×200px | Logo Pinkz Gamez (transparant bg) |
| `favicon.png` | 32×32px | Icon tab browser |
| `hero-bg.jpg` | 1920×1080px | Background hero (fallback video) |
| `unit-ps4.jpg` | 800×500px | Foto unit PS4 |
| `unit-ps5.jpg` | 800×500px | Foto unit PS5 |
| `suasana-1.jpg` | 800×600px | Foto suasana tempat #1 |
| `suasana-2.jpg` | 800×600px | Foto suasana tempat #2 |

> Semua gambar bisa JPG/PNG. Kalau file tidak ada, halaman tetap tampil normal (gambar otomatis disembunyikan).

---

## 🎬 Video Hero (Opsional)

Taruh file video di `video/hero.mp4`.

- Format: MP4 (H.264)
- Resolusi: 1920×1080 atau 1280×720
- Durasi: bebas (akan di-loop otomatis)
- Ukuran: usahakan < 20MB agar loading cepat
- Jika tidak ada, hero akan pakai `hero-bg.jpg` sebagai fallback

---

## 🎮 RAWG API Key (Cover Art Game)

Supaya cover art game otomatis muncul di halaman Games:

1. Daftar gratis di → **https://rawg.io/apidocs**
2. Copy API key kamu
3. Buka `js/games.js`
4. Ganti baris ini:
   ```js
   const RAWG_KEY = 'YOUR_RAWG_API_KEY';
   ```
   menjadi:
   ```js
   const RAWG_KEY = 'api-key-kamu-disini';
   ```

> Tanpa API key, game tetap tampil tapi tanpa cover art (ada placeholder icon).

---

## ➕ Menambah / Edit Game List

Buka `data/games.json` dan edit sesuai kebutuhan. Format setiap item:

```json
{ "title": "Nama Game", "genre": "Action", "platform": "PS5" }
```

**Platform yang valid:**
- `"PS4"`
- `"PS5"`
- `"PS4/PS5"`

Genre bebas diisi apa saja — akan otomatis muncul sebagai filter.

---

## 🚀 Deploy ke Cloudflare Pages

### Cara 1 — Upload langsung (paling mudah)

1. Buka → **https://pages.cloudflare.com**
2. Login / daftar akun Cloudflare (gratis)
3. Klik **"Create a project"** → pilih **"Direct Upload"**
4. Beri nama project, misal: `pinkz-gamez`
5. Upload **seluruh folder** `pinkz-gamez/` (drag & drop atau ZIP)
6. Klik **"Deploy site"**
7. Selesai! Website langsung live di `pinkz-gamez.pages.dev`

### Cara 2 — Via GitHub (untuk update lebih mudah)

1. Buat repo baru di GitHub (private boleh)
2. Upload semua file ke repo
3. Di Cloudflare Pages → **"Connect to Git"**
4. Pilih repo kamu
5. Build settings:
   - **Build command:** *(kosongkan)*
   - **Build output directory:** `/`
6. Klik **"Save and Deploy"**

Selanjutnya setiap push ke GitHub → website otomatis update!

---

## 🌐 Custom Domain (Opsional)

Kalau punya domain sendiri (misal `pinkzgamez.com`):

1. Di Cloudflare Pages → Settings → Custom Domains
2. Klik "Set up a custom domain"
3. Masukkan domain kamu
4. Ikuti instruksi DNS-nya

> Domain `.pages.dev` yang diberikan Cloudflare sudah bisa dipakai selamanya secara gratis.

---

## 🔧 Konfigurasi WA Number

Kalau nomor WA admin berubah, cari dan ganti `6285117288975` di file berikut:
- `index.html` (beberapa tempat)
- `booking.html`
- `games.html`
- `kontak.html`
- `js/booking.js` → baris `const WA_NUMBER = '6285117288975';`

---

## ✅ Checklist Sebelum Launch

- [ ] Semua gambar sudah ditaruh di folder `img/`
- [ ] Logo dan favicon sudah ada
- [ ] (Opsional) Video hero sudah ditaruh di `video/hero.mp4`
- [ ] RAWG API key sudah diisi di `js/games.js`
- [ ] Test form booking → pesan WA terkirim dengan benar
- [ ] Test di HP (mobile responsive)
- [ ] Upload ke Cloudflare Pages

---

## 📱 Test Booking WA

Setelah deploy, test form booking dengan data dummy:
- Nama: Test User
- WA: 08123456789
- Tanggal: hari ini
- Unit: PS5
- Jam: 15:00
- Durasi: 2 jam

Pastikan klik "Book Sekarang" membuka WA dengan pesan yang sudah terisi otomatis.

---

Dibuat dengan ❤️ untuk Pinkz Gamez PS Rental Surabaya
