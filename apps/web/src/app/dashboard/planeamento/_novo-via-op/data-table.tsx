"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RowSelectionState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTableComponent from "@/components/ui-personalizado/data-table/data-table-component";
import DataTablePagination from "@/components/ui-personalizado/data-table/data-table-pagination";
import DataTableSelectedItens from "@/components/ui-personalizado/data-table/data-table-selected-itens";

interface RowWithDepartamento {
  departamento: string;
}

interface DataTableProps<TData extends RowWithDepartamento, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;

  maisQueUmaOP: boolean;
  setMaisQueUmaOp: React.Dispatch<React.SetStateAction<boolean>>;
}

const INITIAL_COLUMN_VISIBILITY: VisibilityState = {
  modelo: false,
  op: false,
};

export function DataTable<TData extends RowWithDepartamento, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  maisQueUmaOP,
  setMaisQueUmaOp,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnVisibility = useMemo(() => INITIAL_COLUMN_VISIBILITY, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // 👈 add this
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  });

  useEffect(() => {
    setRowSelection({});
    setColumnFilters([]);
  }, [maisQueUmaOP, setRowSelection]);

  useEffect(() => {
    if (!maisQueUmaOP) return;

    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length !== 1) return;

    const selectedRow = data[Number(selectedIds[0])];
    if (!selectedRow) return;

    table.setColumnFilters((old) => [
      ...old.filter((f) => f.id !== "departamento"),
      { id: "departamento", value: selectedRow.departamento },
    ]);
  }, [maisQueUmaOP, rowSelection, data, table]);

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="w-full flex flex-col space-y-2">
        {/* Top Row */}
        <div className="w-full flex flex-col sm:flex-row items-center ">
          <div className="flex items-center gap-3 hover:bg-accent/50 cursor-pointer mx-auto">
            <Checkbox
              id="terms"
              checked={maisQueUmaOP}
              onCheckedChange={(checked) => setMaisQueUmaOp(!!checked)}
            />
            <Label htmlFor="terms">Mais que 1 op Planeamento...</Label>
          </div>
          <span className="mx-auto">Fornecedor</span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row pb-1 ">
          <div className="flex flex-col space-y-1">
            <Label>Op...</Label>
            <Input
              placeholder="Filtrar op..."
              value={(table.getColumn("op")?.getFilterValue() as string) ?? ""}
              onChange={(e) =>
                table.getColumn("op")?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label>Departamento...</Label>
            <Input
              disabled={maisQueUmaOP} // ⭐ improvement: automatically disabled when multi-op mode is on
              placeholder="Dep..."
              value={
                (table.getColumn("departamento")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) =>
                table.getColumn("departamento")?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label>Modelo...</Label>
            <Input
              placeholder="Modelo..."
              value={
                (table.getColumn("modelo")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("modelo")?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
          </div>

          <div className="flex items-end flex-1 justify-end">
            {/* Status */}
            <DataTableSelectedItens table={table} />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <DataTableComponent
        table={table}
        numeroColunas={columns.length}
        tableHeaderStyle="sticky top-0 z-10 bg-background border-b border-border"
      />

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
