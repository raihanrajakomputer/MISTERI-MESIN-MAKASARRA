# Mystery Ball — Mangkasara Edition

Website mini-game vending machine berbasis HTML, CSS, dan Vanilla JavaScript.

## Fitur baru
- Popup tambah poin ketika poin tidak cukup untuk spin.
- Tombol langsung menuju TikTok `@ryoiko_`.
- Klaim bonus +500 poin setelah pengguna selesai follow.
- Popup dapat ditutup dengan tombol X, tombol Escape, atau menyentuh area gelap di luar popup.
- Bonus TikTok hanya dapat diklaim sekali pada browser tersebut.
- Animasi spin lebih lucu: bola bergoyang, mesin berjoget, mata berkedip, efek confetti.
- UI copy diubah ke gaya Bahasa Makassar/Mangkasara.

## Menjalankan
Buka `index.html` di browser.

## Catatan penting
Website frontend statis tidak dapat memverifikasi secara otomatis apakah seseorang benar-benar sudah menekan Follow di TikTok. Flow bonus menggunakan sistem klaim manual setelah tombol TikTok dibuka.

Untuk reset data:
```js
localStorage.removeItem("mysteryBallData");
```

Referensi kosakata yang dipakai untuk istilah dasar Makassar:
- Aplikasi Kamus Bahasa Makassar Pemkot Makassar
- Labbineka / Badan Bahasa
- sumber kosakata Makassar terbuka
