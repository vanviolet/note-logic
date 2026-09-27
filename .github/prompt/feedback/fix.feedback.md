- Buat Modal Create Company untuk Superadmin Ketika Create dan tidak ada error maka auto close modal,jika error maka tampilkan toast errornya.

- Matikan Fitur Change Theme di aplikasi 
  - Hilangkan tombol change theme di header
  - Hilangkan CTRL + > dan CTRL + < shortcut untuk change theme
  - Gunakan Theme corporate di aplikasi tanpa bisa diubah-ubah lagi
  - Tetap sediakan Darkmode

- Ubah Wording di beberapa tempat:
  - "Choose how you want to provide rating scale labels. Template mode saves project-level labels via surveyBuilder.upsertRatingScale, while Custom mode defers everything to Step 3 so you can set question-level labels." Menjadi "Decide how rating scale labels will be applied in this survey.
  You can use one label set for all questions, or define different labels for each question."
  - "Use Template Automatically preload labels from /survey/rating-scale based on your rating scale and languages." Menjadi "**One Label Set for All Questions**
  Use the same rating scale labels across all questions in this survey.
  Labels can be entered directly on the platform or uploaded using a file."
  - "Custom builder mode will respect the rating labels defined on each question." Menjadi "**Different Labels per Question**
  Define labels and descriptions at the question level.
  Use this when label meanings vary across questions."
