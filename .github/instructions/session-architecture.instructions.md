---
applyTo: '**'
---

# Session Architecture & Reusability Instructions

Pedoman ini merangkum keputusan arsitektur dari sesi pengembangan terbaru agar fitur berikutnya tetap konsisten, reusable, dan performa baik.

## 1) App Direction (Current Product Shape)

Aplikasi saat ini bergerak ke:
- **Music learning UI** dengan visual modern, dark/light mode, dan mobile-first.
- **Chord Explorer** berbasis kartu (1 chord = 1 card) dengan filter, search, dan pagination.
- **Interactive Fretboard** untuk klik note, audio playback, tuning per string, dan live mic pitch mapping.

Semua perubahan baru harus menjaga arah ini, bukan mengganti pola yang sudah stabil.

## 2) Route & Page Composition Rules

- Pertahankan pola route modular di `app/routes/*`.
- Route-level page hanya sebagai **orchestrator**; pecah UI besar ke komponen terpisah.
- Gunakan shell visual yang konsisten antar halaman (header/nav/footer/background behavior).
- Jangan campur logika berat audio/pitch ke page route; simpan di hooks/template components.

## 3) Reusable Component Rules

Untuk komponen reusable (terutama di `app/templates/components`):
- Gunakan primitive yang sudah ada (shadcn/radix) sebelum membuat custom HTML ad-hoc.
- Gunakan API props yang jelas dan kecil (`value`, `onChange`, `onXxx`).
- Hindari coupling ke route tertentu; komponen harus bisa dipakai lintas halaman.
- Pisahkan state internal vs controlled state dengan tegas.
- Untuk UI dengan update cepat (real-time), utamakan strategi minim rerender.

### Fretboard-specific conventions
- `Fretboard` tetap jadi sumber utama interaksi gitar visual.
- Tuning input berada di sisi kiri fretboard dan menggunakan **shadcn Select**.
- Jika menambah mode baru (trainer/tuner), gunakan prop berbasis fitur (`enableX`, `onX`).
- Data atribut (`data-midi`, `data-string-index`, `data-fret`) dipertahankan untuk mapping cepat.

## 4) Reusable Hook / Function Rules

Untuk hook reusable di `app/templates/hooks`:
- Satu hook = satu tanggung jawab utama.
- Ekspor dari barrel `app/templates/hooks/index.ts`.
- Hook real-time wajib punya:
  - `start()` / `stop()`
  - status (`isStarting`, `isListening`/`isReady`)
  - `error` yang jelas
  - cleanup lengkap saat unmount
- Untuk pipeline audio/pitch, urutan standar:
  1. Mic
  2. Web Audio API
  3. Filter
  4. Pitch detection
  5. Smoothing
  6. Stabilization lock
  7. Mapping callback

## 5) Performance Rules (Critical)

- Untuk update frekuensi tinggi (mic/pitch/frame), **jangan** pakai state React per frame.
- Gunakan:
  - `requestAnimationFrame`
  - `AnalyserNode` buffer reuse
  - DOM class toggling untuk efek visual live
- Emit callback ke React hanya saat data sudah stabil (lock/debounce/throttle).
- Gunakan lazy loading komponen berat (fretboard card visibility-based) bila daftar panjang.

## 6) UX Rules from This Session

- Filter utama tampil di atas konten.
- Pagination compact dengan ellipsis.
- Inactive note = border-only, active note = filled/highlight.
- Label tone/degree tetap terlihat pada note relevan.
- Error audio/mic harus tampil ringkas dan informatif.

## 7) Styling & Accessibility

- Ikuti token theme yang sudah ada (`bg-card`, `border-border`, dsb).
- Gunakan focus state yang jelas untuk elemen interaktif.
- Hormati `prefers-reduced-motion` untuk animasi live effect.
- Jangan menurunkan kontras teks pada dark mode.

## 8) Validation Checklist Before Finish

Sebelum menyelesaikan perubahan:
1. Pastikan tidak ada error type/lint pada file yang diubah.
2. Cek mobile layout (terutama panel kiri fretboard/tuning).
3. Cek dark mode behavior.
4. Cek performa interaksi live mic (tanpa stutter berlebih).
5. Pastikan perubahan tetap reusable dan tidak hardcode ke satu route.

## 9) Future Tuner Readiness Contract

Fitur tuner berikutnya harus memakai kontrak data live pitch yang sudah ada:
- note
- octave
- frequency
- smoothedFrequency
- midi
- cents
- confidence
- timestamp

Tambahan tuner (needle, in-tune threshold, target string) dibangun sebagai layer UI di atas kontrak ini, bukan mengubah pipeline dasar.
