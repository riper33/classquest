# ⚡ ClassQuest: Quiz Arena & Buff Battle

Aplikasi game belajar interaktif modern untuk kelas (terinspirasi dari Quizizz) yang dilengkapi dengan:
1. **Pengisian Soal Mandiri oleh Guru / Admin**: Buat kuis sendiri, kelola opsi jawaban A/B/C/D, buat petunjuk rahasia (hint), penjelasan ilmiah, dan ekspor/impor kuis via file JSON.
2. **Papan Nilai Tertinggi & Rekap Kelas (Leaderboard)**: Podium 3 besar (Emas, Perak, Perunggu), peringkat real-time, filter per-kuis, dan tombol ekspor rekap nilai siswa langsung ke file **Excel / CSV**.
3. **🛍️ Studio Kustomisasi Avatar & Toko Aksesoris (Pakaian, Topi, & Aura)**:
   - **Beli Aksesoris dengan Poin / EXP Kuis**: Setiap kuis yang diikuti memberikan Poin/EXP toko berdasarkan perolehan skor dan kecepatan menjawab.
   - **Kustomisasi Berlapis (Layered Avatar)**:
     - 🧢 **Topi & Mahkota**: Topi Sarjana, Mahkota Emas Sultan, Topi Koboi, Kacamata VR, Halo Malaikat, Top Hat Bangsawan, Headset Gaming RGB.
     - 👕 **Pakaian & Zirah**: Baju Kasual, Kimono Pendekar Neon, Jubah Sihir Keemasan, Armor Baja Berlian, Jas Formal Einstein, Cyber Tech Jacket, Jas Lab Kimia.
     - 🕶️ **Aksesoris Wajah**: Kacamata Thug Life, Kacamata Cerdas Profesor, Masker Neon Cyber, Monocle Emas, Penutup Mata Bajak Laut.
     - ✨ **Aura & Sayap Animasi**: Sayap Emas Kemenangan, Kobaran Api Semangat, Kristal Es Frostbite, Petir Badai Juara, Pelangi Spektrum Juara.
     - 👤 **Karakter Dasar**: Cyber Mage, Robo Knight, Astro Ninja, Pixel Fox, Neon Alchemist, Mecha Neko, Galaxy Lion, Crown King.
   - **Tampil di Mana Saja**: Avatar kustom otomatis tampil di Lobby Arena, Klasemen Kelas Langsung saat kuis, Layar Kemenangan, dan Papan Nilai (Podium Juara).
4. **Sistem Buff & Kekuatan Super yang Dikembangkan**:
   - ❄️ **Chronos Freeze (Beku Waktu)**: Membekukan timer selama 15 detik untuk berpikir tenang tanpa penalti kecepatan.
   - 🛡️ **Aegis Shield (Perisai Kebal)**: Menahan penalti saat salah menjawab agar combo streak dan nyawa tidak putus.
   - 🎯 **50:50 Sonar**: Mengeliminasi 2 opsi jawaban salah secara instan.
   - ⚡ **Double Surge**: Melipatgandakan poin perolehan menjadi 2x lipat jika benar!
   - 🔮 **Oracle Lens (Petunjuk Guru)**: Membuka petunjuk kisi-kisi eksklusif yang ditulis oleh pembuat soal/guru.
   - 🔄 **Phoenix Rebirth (Peluang Kedua)**: Mendapatkan 1 kesempatan ekstra untuk memilih opsi lain jika opsi pertama salah.
   - 💎 **Jackpot Rush**: Tambahan +500 XP bonus jika menjawab kilat dalam 5 detik pertama.
   - 🧠 **Mind Clarity**: Menyorot aura opsi yang berpotensi benar.
4. **Mekanisme Mystery Buff Drop Roulette**: Setiap mencapai combo streak 2x, 4x, dst, siswa mendapatkan giliran memutar roulette kotak misteri untuk memilih buff gratis!
5. **Karakter Avatar dengan Passive Skill**: Pilih Cyber Mage, Robo Knight, Astro Ninja, Pixel Fox, atau Neon Alchemist dengan keuntungan bawaan di awal game.
6. **Web Audio API Sound Synthesizer**: Efek suara arcade bawaan (Correct, Wrong, Tick, Buff Sparkle, Combo Streak, Victory Fanfare) tanpa ketergantungan file luar.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dibuat murni menggunakan **HTML5, Modern CSS, dan Vanilla JavaScript**, sehingga sangat ringan, responsif, dan dapat dijalankan dengan beberapa cara:

### Cara 1: Menggunakan Local Dev Server (Disarankan)
Buka terminal pada folder proyek `quiz-arena`:
```bash
npx serve -s . -l 5173
```
atau menggunakan Python jika terpasang:
```bash
python -m http.server 5173
```
Lalu buka browser di: [http://localhost:5173](http://localhost:5173)

### Cara 2: Buka Langsung File HTML
Cukup klik ganda (double click) file `index.html` pada browser modern (Chrome, Edge, Firefox, Safari).

---

## 👨‍🏫 Panduan untuk Guru / Admin

1. **Membuat Kuis Baru**:
   - Buka tab **"Studio Guru"** di bilah navigasi atas.
   - Klik tombol **"+ Buat Kuis Baru"**, masukkan Judul Kuis, Kategori, Ikon Emoji, dan Durasi Waktu per soal (misal: 20 detik).
2. **Mengisi & Mengelola Soal**:
   - Pada kartu kuis yang diinginkan, klik **"✏️ Kelola Soal"**.
   - Klik **"+ Tambah Soal Baru"**.
   - Tulis teks pertanyaan, isi 4 opsi jawaban (A, B, C, D), dan pilih tombol radio pada opsi yang merupakan kunci jawaban benar.
   - Masukkan **Petunjuk Kunci Guru (Hint)** — petunjuk ini akan muncul ketika siswa menggunakan buff *Oracle Lens*!
   - Masukkan **Pembahasan / Penjelasan** — pembahasan akan muncul setelah siswa menjawab sehingga siswa langsung memahami materinya.
3. **Mengecek Nilai Tertinggi & Mengunduh Rekap**:
   - Buka tab **"Papan Nilai"**.
   - Pilih filter kuis tertentu atau pilih "Semua Kuis".
   - Guru dapat melihat peraih juara 1, 2, dan 3 di podium, serta tabel akurasi dan waktu pengerjaan.
   - Klik tombol **"📥 Download Rekap Nilai (CSV)"** untuk mengunduh rekap nilai lengkap ke Microsoft Excel / Google Sheets!
4. **Membagikan Kuis ke Guru Lain (Backup & Share)**:
   - Klik tombol **"📤 Backup Kuis (JSON)"** untuk mengunduh seluruh kuis ke dalam file JSON.
   - Guru lain bisa langsung menekan **"📥 Impor Kuis (JSON)"** di perangkatnya untuk langsung memainkan kuis yang sama!
