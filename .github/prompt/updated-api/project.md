Ada Perubahan API di bagian Module Project

- Di bagian Step 1 Rating Scale sudah bukan enum lagi tapi number artinya field diganti menjadi dropdown dari angka 2 sampai 10
- Di bagian step 2 itu setiap label memiliki description
- Di Bagian Step 3 Hilangkan bagian Question Queue, dan aksi add to queue langung hit backend yang sudah pasti masuk ke saved question, di bagian saved question ada tombol remove dan update yang akan langsung membuka add Question, Buat bagian Add question ini berbentuk collapse yang bisa dibuka default tertutup dan akan tertutup kembali setelah submit question.
- Di Bagian Step 3 jika project memiliki useDefaultRatingScale: false maka jika question tidak memiliki label buat question berwarna merah dan ada warning "Question must have a label if not using default rating scale"



Sisa nya Cek dan analisa generated.ts dan sesuaikan perubahan property atau jika ada tambahan property baru