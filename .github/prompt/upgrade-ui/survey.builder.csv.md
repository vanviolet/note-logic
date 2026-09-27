Implementasikan juga upload csv di step 3 dari template public/template-survey-builder.csv

setelah upload maka akan langsung tampil preview datanya dalam bentuk card,
sesuaikan juga dengan fitur languange artinya jika ada multiple language maka ada 2 aksi untuk upload csv per language.

jika ada error di csv maka tampilkan errornya di card
Yang membuat error adalah:
- Label tidak sesuai dengan rating scale yang dipilih di step 1, artinya jika rating scale ada 5 harus ada 5 label di csv
 
untuk pengambilan data csv ini jangan gunakan nama header tapi ambil dari index kolomnya, misalnya untuk mengambil data fullname jangan gunakan Full Name tapi ambil dari index di csvnya,