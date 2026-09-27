Pelajari component yang saya buat, sudah lama ini

nah saya ingin upgrade component ini

### Tambahkan Fitur Unfullscreen
- Fitur adalah fitur untuk mengembalikan posisi dan size ke posisi semula sebelum fullscreen

### Bug Di fitur minimized seperti gambar yang saya kirimkan
Jadi kasusnya adalah ketika kita open misal 4 window, trus kemudian saya close window ke 3, position tidak berubah, dan ketika saya tambah window lagi malah menimpah posisi minimizedWindow ke 4

- Saya ingin ketika window di close maka position minimized akan mengikuti index nya jadi misal ada 4 window maka , jika window ke 3 kita close minimized window 4 akan turun positionnya atau berubah posisi ke window ke posisi ke 3

- Lalu saya ingin position minimized window ini fixed sesuai dengan screen jadi window chrome di resize/zoom maka akan selalu mengikuti ukuran window

- lalu saya ingin agar jika minimizedWindow sudah banyak sampai ke atas window maka window selanjutnya taruh di samping kiri nya dan akan keatas lagi jika ada window baru

- Tambahkan Tooltip di komponent MinimizedWindow yang memunculkan title dan description


### Tambahkan fitur max window di config


### Ketika Mobile Mode Tidak ada fitur minimized,fullscreen/unfullscreen
- Saya ingin ketika mobile dan membuka new window akan automatis fullscreen dan buat agar scroll di body atau html hilang