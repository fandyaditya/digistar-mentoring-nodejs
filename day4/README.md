Here's the content converted to Markdown format:


# Mengenal Query di MongoDB dan Referensi ke Koleksi Lain

## Pendahuluan:
- Pada sesi hands-on ini, kita akan melakukan query sederhana dan menghubungkan dokumen di koleksi yang berbeda.

## Langkah-Langkah:

### 1. Setup MongoDB:
- Pastikan MongoDB sudah terinstall dan berjalan.
- Buat database dan koleksi baru.

### 2. Membuat Koleksi dan Menambahkan Data:
- Buat koleksi users dan orders.
- Tambahkan beberapa dokumen contoh ke dalam koleksi.

Contoh kode:
```javascript
db.users.insertMany([
  { _id: 1, name: "John Doe", email: "john@example.com" },
  { _id: 2, name: "Jane Smith", email: "jane@example.com" }
]);

db.orders.insertMany([
  { _id: 1, user_id: 1, product: "Laptop", amount: 1500 },
  { _id: 2, user_id: 2, product: "Phone", amount: 800 }
]);
```

### 3. Mengenal Query di MongoDB:
- Find: Mengambil data dari koleksi.

Contoh kode:
```javascript
db.users.find();
db.orders.find({ user_id: 1 });
```

- Insert: Menambahkan data baru ke dalam koleksi.

Contoh kode:
```javascript
db.users.insertOne({ name: "Alice Johnson", email: "alice@example.com" });
```

- Update: Memperbarui data dalam koleksi.

Contoh kode:
```javascript
db.users.updateOne({ _id: 1 }, { $set: { email: "john.doe@example.com" } });
```

- Delete: Menghapus data dari koleksi.

Contoh kode:
```javascript
db.users.deleteOne({ _id: 2 });
```

### 4. Referensi ke Koleksi Lain:
- Menghubungkan dokumen di koleksi orders dengan users menggunakan user_id.
- Melakukan lookup untuk menggabungkan data dari dua koleksi.

Contoh kode:
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user_info"
    }
  }
]);
```