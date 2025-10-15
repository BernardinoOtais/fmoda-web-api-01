"use client";

import { AutocompleteStringDto } from "@repo/tipos/comuns";
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
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import { PostPorOp } from "../contex-provider-novo-planeamento";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTableComponent from "@/components/ui-personalizado/data-table/data-table-component";
import DataTablePagination from "@/components/ui-personalizado/data-table/data-table-pagination";
import DataTableSelectedItens from "@/components/ui-personalizado/data-table/data-table-selected-itens";
import DropdownSelect from "@/components/ui-personalizado/meus-components/dropdown-select";

interface RowWithDepartamento {
  departamento: string;
  op: string;
}

interface DataTableProps<TData extends RowWithDepartamento, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  maisQueUmaOP: boolean;
  setMaisQueUmaOp: React.Dispatch<React.SetStateAction<boolean>>;
  fornecedores: AutocompleteStringDto[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  posting: boolean;
  setOpsForSchema: React.Dispatch<React.SetStateAction<PostPorOp[]>>;
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
  fornecedores,
  value,
  setValue,
  posting,
  setOpsForSchema,
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
    getPaginationRowModel: getPaginationRowModel(),
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

  const numeroDeLinhas = table.getRowCount();
  const paginadas = table.getState().pagination.pageSize;

  const [mostraPaginacao, setMostraPaginacao] = useState(
    paginadas <= numeroDeLinhas
  );

  useEffect(() => {
    setMostraPaginacao(paginadas <= numeroDeLinhas);
  }, [numeroDeLinhas, paginadas]);

  useEffect(() => {
    const opSeleccionadas = Object.keys(rowSelection)
      .map((key) => {
        const row = data[Number(key)];
        return row ? { op: Number(row.op) } : null;
      })
      .filter((item): item is { op: number } => item !== null);
    if (opSeleccionadas.length > 0) setOpsForSchema(opSeleccionadas);
  }, [data, rowSelection, setOpsForSchema]);

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="w-full flex flex-col space-y-2">
        {/* Top Row */}
        <div className="w-full flex flex-col space-y-1 sm:flex-row items-center ">
          <div className="flex items-center gap-3 hover:bg-accent/50 cursor-pointer mx-auto">
            <Checkbox
              id="terms"
              disabled={posting}
              checked={maisQueUmaOP}
              onCheckedChange={(checked) => setMaisQueUmaOp(!!checked)}
            />
            <Label htmlFor="terms">Mais que 1 op Planeamento...</Label>
          </div>
          <div className="mx-auto">
            <DropdownSelect
              valorOriginal={value}
              setValue={setValue}
              dados={fornecedores}
              posting={posting}
              placeholder="Fornecedor..."
              tituloPesquisa="Procurar por Fornecedor..."
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row pb-1 sm:space-x-1 ">
          <div className="flex flex-col space-y-1">
            <Label>Op...</Label>
            <Input
              disabled={posting}
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
              disabled={maisQueUmaOP || posting}
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
              disabled={posting}
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
      {mostraPaginacao && !posting && <DataTablePagination table={table} />}

      {/* Mostras paginacao NumberLinhas>10*/}
      {/* Mostra paginação quando numeroDeLinhas > 10 */}
      {!mostraPaginacao && numeroDeLinhas > 10 && !posting && (
        <Button
          variant="link"
          className="p-0 h-auto cursor-pointer"
          onClick={() => setMostraPaginacao(!mostraPaginacao)}
        >
          Mostrar paginação...
        </Button>
      )}
    </div>
  );
}
