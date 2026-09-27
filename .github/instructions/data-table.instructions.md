# DataTable Instructions

---
file: app/templates/components/custom/data-table.tsx
---

Panduan cepat untuk mengintegrasikan `DataTable` dengan pipeline fetch & search params.

## 1. Tentukan Source Data
- Ambil data melalui `useQuery` dari `app/hooks/fetch`.
- Pastikan hook membaca param `orderBy`, `orderDir`, `page`, `pageSize`, dan filter lain dari `useSearchParams` sehingga backend menerima query yang identik dengan tabel.

## 2. Susun Definisi Kolom
```ts
const columns: DataTableColumn<Job>[] = [
  {
    key: "title",
    header: "Judul",
    pin: "left",
    sortable: true,
    cell: (row) => row.title,
  },
  {
    key: "salary",
    header: "Gaji",
    align: "right",
    cell: (row) => formatCurrency(row.salary),
    mobileLabel: "Gaji (IDR)",
  },
];
```
- Gunakan `pin` hanya pada kolom penting atau action column.
- Simpan teks panjang dalam `cell` dan biarkan wrapper kartu menangani wrapping.

## 3. Konfigurasi Search Params
```tsx
<DataTable
  columns={columns}
  data={data}
  orderConfig={{
    orderByParam: "orderBy",
    orderDirParam: "orderDir",
    defaultOrderBy: "title",
    defaultOrderDir: "asc",
  }}
  pagination={{
    pageParam: "page",
    pageSizeParam: "limit",
    pageSize: Number(searchParams.get("limit") ?? 10),
    totalItems: query.data?.meta.total,
  }}
  filterParamKeys={["q", "status"]}
/>
```
- Ketika parameter diubah melalui tabel, komponen otomatis memutakhirkan URL dan me-reset halaman ke 1 jika perlu.

## 4. Loading & Empty State
- Gunakan prop `loading` dari status hook.
- Isi `emptyState` bila ingin icon/CTA khusus.
- `filterParamKeys` membantu membedakan pesan kosong saat ada filter aktif.

## 5. Responsiveness & Aksi
- `renderActions` menerima satu baris data; gunakan button, dropdown, dsb.
- Pada mobile, action ditempatkan di bawah grid konten dengan border-top agar konsisten.

## 6. Styling Opsional
- Tambah kelas lewat `columns[].className` atau `headerClassName`.
- Gunakan `pinActions` untuk menempelkan kolom aksi di desktop.

## 7. Testing Checklist
- Scroll horizontal: pinned column dan action harus tetap terlihat.
- Ubah sort/pagination: URL harus berubah dan data refetch.
- Mobile viewport: kartu tampil grid, teks panjang ter-wrap.
- Filter aktif tanpa data: pesan "Tidak ada hasil" muncul.
