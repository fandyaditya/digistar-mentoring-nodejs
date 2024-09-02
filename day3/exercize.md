# Latihan Hari 3: Aplikasi Todo Sederhana dengan Express

Buatlah aplikasi todo sederhana menggunakan Express yang dapat melakukan operasi berikut:

1. Membuat todo
2. Mengupdate todo yang ada
3. Menghapus todo
4. Menampilkan daftar todo

## Struktur Data Todo

Setiap item todo harus memiliki properti berikut:

1. id: Pengenal unik untuk setiap todo
2. description: Deskripsi teks dari todo
3. date: Tanggal todo dalam format dd-mm-yy
4. is_checked: Boolean yang menunjukkan apakah todo sudah selesai atau belum

## Persyaratan

1. Buat server Express sederhana yang berjalan di port 3000.

2. Implementasikan rute-rute berikut:
   - GET `/todos`: Menampilkan semua todo
   - POST `/todos`: Membuat todo baru
   - PUT `/todos/:id`: Mengupdate todo berdasarkan id
   - DELETE `/todos/:id`: Menghapus todo berdasarkan id
   - PATCH `/todos/:id/toggle`: Mengubah status is_checked todo

## Petunjuk Implementasi

- Buat fungsi-fungsi terpisah untuk setiap operasi CRUD untuk meningkatkan keterbacaan kode.
- Gunakan `Date.now().toString()` untuk menghasilkan id unik saat membuat todo baru.
- Validasi input yang diterima dari klien sebelum menyimpan data.
    - input dari POST semua harus diisi
    - input dari PUT hanya boleh mengubah description, date
