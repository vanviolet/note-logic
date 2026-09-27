# DataTable Component

Komponen tabel responsif dengan integrasi URL search params untuk sorting, pagination, dan filtering.

## Fitur Utama
- Pinned column & action column dengan bayangan lembut agar tetap terbaca saat scroll horizontal.
- Sinkronisasi `orderBy`, `orderDir`, `page`, dan `pageSize` melalui `useSearchParams` sehingga backend bisa membaca query string yang sama.
- Tampilan mobile otomatis berubah menjadi kartu grid yang adaptif terhadap konten panjang.
- Status `loading`, pesan kosong standar, serta pesan kosong khusus ketika ada filter aktif.
- Pagination built-in dengan teks ringkasan "Menampilkan X - Y".

## API Singkat
| Prop | Tipe | Deskripsi |
| --- | --- | --- |
| `data` | `TData[]` | Baris data yang akan dirender. |
| `columns` | `DataTableColumn<TData>[]` | Definisi kolom (label, cell renderer, pin, dll). |
| `renderActions` | `(row: TData) => React.ReactNode` | Render fungsi untuk tombol aksi per baris (opsional). |
| `orderConfig` | `DataTableOrderConfig` | Atur nama param dan nilai default sorting. |
| `pagination` | `DataTablePaginationConfig` | Atur param, ukuran halaman, dan total item/halaman. |
| `emptyState` | `DataTableEmptyState` | Kustomisasi icon/teks/CTA ketika data kosong. |
| `filterParamKeys` | `string[]` | Daftar param yang dianggap sebagai filter untuk menentukan empty state "filtered". |

### `DataTableColumn`
- `key`: identifier unik & penghubung dengan `orderBy`.
- `header`: judul kolom.
- `cell(row)`: renderer untuk sel.
- `sortable`: aktifkan tombol sort.
- `pin`: `"left" | "right"` untuk sticky column.
- `mobileLabel`: label alternatif saat di kartu.
- `hideOnMobile`: sembunyikan kolom di tampilan kartu.

## Penggunaan Dasar
```tsx
import { DataTable } from "~/templates/components/custom/data-table";

const columns = [
  {
    key: "name",
    header: "Nama",
    sortable: true,
    pin: "left",
    cell: (row) => row.name,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => row.statusLabel,
  },
];

export function UsersTable({ data, loading, total }) {
  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      pagination={{ pageSize: 10, totalItems: total }}
      renderActions={(row) => (
        <Button size="sm" variant="outline">
          Detail
        </Button>
      )}
    />
  );
}
```

## Tips
- Gunakan `filterParamKeys` untuk memberi tahu tabel param mana yang dihitung sebagai filter sehingga empty state menampilkan pesan khusus.
- Jika backend menentukan total halaman secara eksplisit, isi `pagination.totalPages` agar tombol "Selanjutnya" berhenti tepat waktu.
- Komponen ini tidak melakukan fetch data; hubungkan dengan hook `useQuery`/`useMutation` sesuai panduan `app/hooks/fetch`.
