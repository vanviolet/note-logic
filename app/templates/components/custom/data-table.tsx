import * as React from "react";
import { useSearchParams } from "react-router";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

import { cn } from "~/templates/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/templates/components/ui/table";
import { Button } from "~/templates/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/templates/components/ui/empty";
import { Spinner } from "~/templates/components/ui/spinner";

type SortDirection = "asc" | "desc";

export type DataTableColumn<TData> = {
  key: string;
  header: React.ReactNode;
  cell: (row: TData) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  minWidth?: string;
  pin?: "left" | "right";
  mobileLabel?: React.ReactNode;
  hideOnMobile?: boolean;
  className?: string;
  headerClassName?: string;
};

export type DataTableEmptyState = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  filteredTitle?: string;
  filteredDescription?: string;
  action?: React.ReactNode;
};

export type DataTableOrderConfig = {
  orderByParam?: string;
  orderDirParam?: string;
  defaultOrderBy?: string;
  defaultOrderDir?: SortDirection;
};

export type DataTablePaginationConfig = {
  pageParam?: string;
  pageSizeParam?: string;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
};

export type DataTableProps<TData> = {
  data: TData[];
  columns: Array<DataTableColumn<TData>>;
  getRowId?: (row: TData, index: number) => React.Key;
  renderActions?: (row: TData) => React.ReactNode;
  actionColumnLabel?: string;
  pinActions?: boolean;
  loading?: boolean;
  className?: string;
  emptyState?: DataTableEmptyState;
  orderConfig?: DataTableOrderConfig;
  pagination?: DataTablePaginationConfig;
  filterParamKeys?: string[];
};

const alignClassMap: Record<
  NonNullable<DataTableColumn<unknown>["align"]>,
  string
> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const pinBaseClass =
  "relative sticky z-20 bg-background before:pointer-events-none before:absolute before:top-0 before:h-full before:w-3 before:content-['']";

const pinClassMap: Record<
  NonNullable<DataTableColumn<unknown>["pin"]>,
  string
> = {
  left: [
    pinBaseClass,
    "left-0 shadow-[2px_0_8px_rgba(15,23,42,0.12)] before:-right-3 before:bg-gradient-to-r before:from-background before:via-background/80 before:to-transparent",
  ].join(" "),
  right: [
    pinBaseClass,
    "right-0 shadow-[-2px_0_8px_rgba(15,23,42,0.12)] before:-left-3 before:bg-gradient-to-l before:from-background before:via-background/80 before:to-transparent",
  ].join(" "),
};

function resolveDirection(
  value: string | null,
  fallback: SortDirection,
): SortDirection {
  return value === "desc" ? "desc" : value === "asc" ? "asc" : fallback;
}

function normalizePositiveInteger(
  value: string | null,
  fallback: number,
): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

function DataTableBase<TData>(
  {
    data,
    columns,
    getRowId,
    renderActions,
    actionColumnLabel = "Actions",
    pinActions,
    loading,
    className,
    emptyState,
    orderConfig,
    pagination,
    filterParamKeys,
  }: DataTableProps<TData>,
  ref: React.Ref<HTMLDivElement>,
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    orderByParam = "orderBy",
    orderDirParam = "orderDir",
    defaultOrderDir = "asc",
  } = orderConfig ?? {};
  const defaultOrderBy =
    orderConfig?.defaultOrderBy ??
    columns.find((column) => column.sortable)?.key ??
    columns[0]?.key;

  const {
    pageParam = "page",
    pageSizeParam = "pageSize",
    pageSize = 10,
    totalItems,
  } = pagination ?? {};

  const currentOrderBy = searchParams.get(orderByParam) ?? defaultOrderBy ?? "";
  const currentDirection = resolveDirection(
    searchParams.get(orderDirParam),
    defaultOrderDir,
  );
  const currentPage = normalizePositiveInteger(searchParams.get(pageParam), 1);
  const currentPageSize = pagination
    ? normalizePositiveInteger(searchParams.get(pageSizeParam), pageSize)
    : pageSize;

  const derivedTotalPages = React.useMemo(() => {
    if (!pagination) return 0;
    if (typeof pagination.totalPages === "number") {
      return Math.max(pagination.totalPages, 1);
    }
    if (typeof totalItems === "number" && currentPageSize > 0) {
      return Math.max(1, Math.ceil(totalItems / currentPageSize));
    }
    return currentPage;
  }, [pagination, totalItems, currentPageSize, currentPage]);

  const updateSearchParams = React.useCallback(
    (entries: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        Object.entries(entries).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") {
            next.delete(key);
            return;
          }
          next.set(key, value);
        });

        return next;
      });
    },
    [setSearchParams],
  );

  const handleSort = React.useCallback(
    (columnKey: string) => {
      const isCurrentColumn = columnKey === currentOrderBy;
      const nextDirection: SortDirection =
        isCurrentColumn && currentDirection === "asc" ? "desc" : "asc";

      updateSearchParams({
        [orderByParam]: columnKey,
        [orderDirParam]: nextDirection,
        [pageParam]: "1",
      });
    },
    [
      currentDirection,
      currentOrderBy,
      orderByParam,
      orderDirParam,
      pageParam,
      updateSearchParams,
    ],
  );

  const handlePageChange = React.useCallback(
    (nextPage: number) => {
      if (!pagination) return;

      const target = Math.max(
        1,
        pagination.totalPages
          ? Math.min(nextPage, pagination.totalPages)
          : nextPage,
      );

      updateSearchParams({
        [pageParam]: String(target),
      });
    },
    [pageParam, pagination, updateSearchParams],
  );

  const hasFilters = React.useMemo(() => {
    if (!searchParams) return false;
    if (filterParamKeys?.length) {
      return filterParamKeys.some((key) => {
        const value = searchParams.get(key);
        return value !== null && value.trim().length > 0;
      });
    }

    const ignoredKeys = new Set([
      orderByParam,
      orderDirParam,
      pageParam,
      pageSizeParam,
    ]);
    for (const key of searchParams.keys()) {
      if (
        !ignoredKeys.has(key) &&
        (searchParams.get(key) ?? "").trim().length > 0
      ) {
        return true;
      }
    }
    return false;
  }, [
    filterParamKeys,
    orderByParam,
    orderDirParam,
    pageParam,
    pageSizeParam,
    searchParams,
  ]);

  const resolvedEmptyState: Required<DataTableEmptyState> = {
    title: "Belum ada data",
    description: "Tambahkan data baru untuk mulai bekerja.",
    filteredTitle: "Tidak ada hasil",
    filteredDescription:
      "Ubah filter pencarian atau bersihkan parameter untuk melihat data lainnya.",
    icon: emptyState?.icon ?? null,
    action: emptyState?.action ?? null,
    ...(emptyState ?? {}),
  } as Required<DataTableEmptyState>;

  const renderSortIcon = (columnKey: string) => {
    if (columnKey !== currentOrderBy) {
      return (
        <ArrowUpDownIcon
          className="ml-2 hidden size-4 text-muted-foreground sm:inline"
          aria-hidden
        />
      );
    }

    return currentDirection === "asc" ? (
      <ArrowUpIcon
        className="ml-2 hidden size-4 text-muted-foreground sm:inline"
        aria-hidden
      />
    ) : (
      <ArrowDownIcon
        className="ml-2 hidden size-4 text-muted-foreground sm:inline"
        aria-hidden
      />
    );
  };

  const tableContent = (
    <div className="hidden rounded-xl border bg-background md:block p-2">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                data-pin={column.pin}
                className={cn(
                  "bg-muted/30 text-xs font-semibold uppercase tracking-wide text-foreground",
                  alignClassMap[column.align ?? "left"],
                  column.headerClassName,
                  column.pin ? pinClassMap[column.pin] : undefined,
                )}
                style={{ width: column.width, minWidth: column.minWidth }}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide",
                      column.align === "right" && "flex-row-reverse",
                    )}
                    onClick={() => handleSort(column.key)}
                  >
                    <span className="truncate">{column.header}</span>
                    {renderSortIcon(column.key)}
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
            {renderActions ? (
              <TableHead
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide text-right",
                  pinActions && pinClassMap.right,
                )}
              >
                <span className="sr-only">{actionColumnLabel}</span>
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => {
            const rowKey = getRowId?.(row, rowIndex) ?? rowIndex;
            return (
              <TableRow key={rowKey} className="border-b last:border-0">
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    data-pin={column.pin}
                    className={cn(
                      "py-4 text-sm",
                      alignClassMap[column.align ?? "left"],
                      column.className,
                      column.pin ? pinClassMap[column.pin] : undefined,
                    )}
                    style={{ width: column.width, minWidth: column.minWidth }}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
                {renderActions ? (
                  <TableCell
                    className={cn(
                      "py-4 text-right",
                      pinActions && pinClassMap.right,
                    )}
                  >
                    <div className="flex w-full justify-end gap-2">
                      {renderActions(row)}
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  const cardContent = (
    <div className="flex flex-col gap-3 md:hidden">
      {data.map((row, rowIndex) => {
        const rowKey = getRowId?.(row, rowIndex) ?? rowIndex;
        return (
          <div
            key={rowKey}
            className="rounded-2xl border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex flex-col gap-4 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {columns
                  .filter((column) => !column.hideOnMobile)
                  .map((column) => (
                    <div
                      key={column.key}
                      className="flex min-w-0 flex-col gap-1"
                    >
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {column.mobileLabel ?? column.header}
                      </span>
                      <div
                        className={cn(
                          "text-sm text-pretty wrap-break-word",
                          column.className,
                        )}
                      >
                        {column.cell(row)}
                      </div>
                    </div>
                  ))}
              </div>
              {renderActions ? (
                <div className="flex flex-wrap gap-2 border-t pt-3">
                  {renderActions(row)}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );

  let body: React.ReactNode = null;

  if (loading) {
    body = (
      <div
        className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-2xl border bg-background"
        aria-live="polite"
      >
        <Spinner className="size-6" />
        <p className="text-sm font-medium text-muted-foreground">
          Memuat data...
        </p>
      </div>
    );
  } else if (data.length === 0) {
    body = (
      <Empty className="min-h-60">
        {resolvedEmptyState.icon ? (
          <EmptyMedia variant="icon">{resolvedEmptyState.icon}</EmptyMedia>
        ) : null}
        <EmptyHeader>
          <EmptyTitle>
            {hasFilters
              ? resolvedEmptyState.filteredTitle
              : resolvedEmptyState.title}
          </EmptyTitle>
          <EmptyDescription>
            {hasFilters
              ? resolvedEmptyState.filteredDescription
              : resolvedEmptyState.description}
          </EmptyDescription>
        </EmptyHeader>
        {resolvedEmptyState.action ? (
          <EmptyContent>{resolvedEmptyState.action}</EmptyContent>
        ) : null}
      </Empty>
    );
  } else {
    body = (
      <React.Fragment>
        {tableContent}
        {cardContent}
      </React.Fragment>
    );
  }

  const showPagination = Boolean(pagination && data.length > 0);
  const canGoPrev = pagination ? currentPage > 1 : false;
  const canGoNext = pagination ? currentPage < derivedTotalPages : false;
  const fromItem = (currentPage - 1) * currentPageSize + 1;
  const toItem = Math.min(
    currentPage * currentPageSize,
    totalItems ?? currentPage * currentPageSize,
  );

  return (
    <section ref={ref} className={cn("flex flex-col gap-4", className)}>
      {body}
      {showPagination ? (
        <div className="flex flex-col gap-3 rounded-2xl border bg-background p-2 px-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {fromItem}
            {totalItems
              ? ` - ${toItem} dari ${totalItems} data`
              : ` - ${toItem}`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!canGoPrev}
            >
              Sebelumnya
            </Button>
            <div className="text-sm font-medium text-muted-foreground">
              Halaman {currentPage}{" "}
              {derivedTotalPages ? `dari ${derivedTotalPages}` : null}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!canGoNext}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

type DataTableComponent = <TData>(
  props: DataTableProps<TData> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;

const DataTable = React.forwardRef(DataTableBase) as DataTableComponent;

export { DataTable };
