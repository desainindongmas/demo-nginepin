# Nginepin — Interactive Web Demo

Demo berbahasa Indonesia untuk merasakan satu alur bisnis penginapan: tamu booking → admin mengelola pembayaran → invoice otomatis → kalender dan housekeeping → owner melihat hasil → Pro growth → Enterprise portfolio → konsultasi.

## Jalankan

Memerlukan Node.js 20 atau lebih baru. Tidak perlu install dependency atau build.

```sh
npm start
```

Buka `http://localhost:4173`. Seluruh website siap hosting berada di `dist/`.

```sh
npm test
```

## Coba alur utamanya

1. Klik **Rasakan sendiri** untuk demo terpandu, atau **Jelajahi demo** untuk eksplorasi bebas.
2. Sebagai Guest: pilih **Garden Villa**, 12–14 November 2026, dua tamu, BBQ Rp300.000, DP 50%. Total Rp2.700.000, DP dan outstanding masing-masing Rp1.350.000.
3. Klik **Lihat sebagai Admin**. Reservasi yang sama muncul di daftar. Buka detail, catat pelunasan Rp1.350.000, lalu lihat invoice **LUNAS** dan outstanding **Rp0**.
4. Booking tampil di kalender. Tandai Garden Villa **Ready** pada housekeeping.
5. Klik **Lihat sebagai Owner**. Pendapatan bertambah dari booking tersebut, dan outstanding mengikuti pembayaran.
6. Preview **Pro** untuk CRM Raka, penawaran repeat guest, automation, dan aturan harga.
7. Preview **Enterprise** untuk tiga properti, central guest, consolidated finance, dan team roles.
8. Bandingkan paket, hitung potensi komisi OTA, lalu buka konsultasi WhatsApp.

## Isi demo

- Landing page dengan identitas hijau tua dan aksen emas dari logo pengguna.
- Guest homepage, cek ketersediaan, detail unit, checkout, konfirmasi.
- Admin today, daftar/detail reservasi, catat pembayaran, invoice yang bisa dicetak/PDF.
- Kalender dengan pencegahan tanggal bentrok, housekeeping interaktif.
- Owner overview, keuangan, database dan riwayat tamu.
- Pro CRM, simulasi return offer, automation toggle, pricing rule preview.
- Enterprise portfolio, central guest, finance konsolidasi, preview team roles.
- Perbandingan paket bulanan/tahunan, rekomendasi sesuai eksplorasi, kalkulator OTA.
- CTA WhatsApp, email opsional, reset demo dan event analytics lokal.
- Layout responsif dengan navigasi mobile, reduced-motion, fokus keyboard, dan label form.

## Harga sesuai blueprint

| Paket | Bulanan | Tahunan | Properti termasuk |
| --- | ---: | ---: | ---: |
| Standard | Rp249.000 | Rp2.490.000 | 1 |
| Pro | Rp449.000 | Rp4.490.000 | 1 |
| Enterprise | mulai Rp999.000 | mulai Rp9.990.000 | 3 |

Tahunan: bayar 10 bulan, gunakan 12 bulan. Tambahan properti Enterprise Rp125.000/bulan atau Rp1.250.000/tahun. Pro berbeda Rp200.000/bulan dari Standard; Enterprise menghemat Rp348.000/bulan dibanding tiga akun Pro. Nilai upsell dan penghematan OTA selalu ditandai sebagai ilustrasi, bukan jaminan hasil.

## Data dan privasi

Semua state berada di `localStorage` dengan key `nginepin-demo-v1`: 30 reservasi awal, booking percobaan, pembayaran, housekeeping, paket, aturan harga, dan event lokal (maksimal 300). Reset mengembalikan semuanya ke baseline. Maksimal 10 booking percobaan sebelum reset.

Gunakan identitas fiktif. Tidak ada backend, auth, payment gateway, email delivery, WhatsApp automation, OTA API, atau analytics eksternal yang aktif. Perubahan state, automation, penawaran, dan transaksi adalah simulasi.

CTA konsultasi membuka `https://wa.me/6285952839393` dengan ringkasan yang bisa diperiksa calon customer sebelum mengirim. Email opsional membuka aplikasi email ke `admin3@desainindongmas.my.id`. Tidak ada pengiriman data diam-diam atau salinan email otomatis; pengiriman email otomatis memerlukan backend/provider dan pemberitahuan kepada pengunjung.

Baseline KPI berasal dari satu konfigurasi properti (Puncak Rp42,5 jt; Bandung Rp31,4 jt; Lembang Rp28,8 jt; total Rp102,7 jt). Booking baru dan pembayaran menyesuaikan revenue dan outstanding dari state yang sama. Okupansi, grafik harian, source mix, dan profil CRM Raka diberi konteks snapshot/ilustrasi; bukan perhitungan live seluruh periode akuntansi dari 30 contoh reservasi.

## Hosting

Deploy folder **`dist`** ke static hosting seperti Cloudflare Pages, Netlify, atau layanan sejenis. Tidak ada build command.

Untuk GitHub Pages, workflow manual ada di **Actions → Publish demo to GitHub Pages → Run workflow**. Aktifkan **Settings → Pages → Source: GitHub Actions** terlebih dahulu. Workflow tersebut hanya memublikasikan jika dijalankan manual. Push kode ini sendiri tidak mengaktifkan publikasi otomatis.

Foto ilustrasi dimuat dari Unsplash dan font dari Google Fonts. Keduanya membutuhkan akses internet; fallback warna dan sans-serif tetap tersedia. Logo pengguna disimpan lokal di `dist/assets/logo.jpg`. Untuk rilis final, pertimbangkan menyimpan foto dan font berlisensi secara lokal.

## Validasi dan batasan

Delapan pemeriksaan state/event lulus: konsistensi Guest–Admin–Owner, pelunasan/invoice, penolakan overpayment, overlap tanggal, agregasi Enterprise, harga bulanan/tahunan, escaping input tamu, serta rendering seluruh halaman demo.

**Pengujian visual dan interaksi di browser nyata belum selesai.** Sandbox eksekusi membatasi server/browser; Playwright tidak dapat meluncurkan Chromium. Jalankan QA desktop/mobile dan aksesibilitas di browser sebelum menjadikan demo publik. Tes Node memakai DOM stub dan tidak membuktikan layout, networking aset, atau seluruh perilaku DOM nyata.

Scope: demo pra-rilis. Pengaturan peran dan paket di client adalah preview; izin produksi, kuota, pembayaran, notifikasi, dan integrasi harus ditegakkan di server pada produk sebenarnya. Pricing rules hanya menyimpan preview dan belum mengubah rate booking demo. Snapshot tanggal demo November 2026 sengaja tetap untuk skenario yang dapat diulang.

## Struktur

```text
dist/index.html        Entry point
dist/style.css         Design system dan responsive layout
dist/app.js            Seed, state, views, interaksi dan CTA
dist/assets/logo.jpg   Logo pengguna
scripts/serve.cjs      Static server tanpa dependency
tests/core.test.cjs    Pemeriksaan alur dan konsistensi data
```
