"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatMoneyPT } from "@/lib/my-utils";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  groupedColumns?: (keyof TData)[];
  emptyMessage?: string;
  totalSum: number;
};

// 1️⃣ Helper: Compute rowspan for grouped columns
function computeRowSpans<TData>(
  data: TData[],
  columnId: keyof TData,
  parentColumnId?: keyof TData
): Record<number, number> {
  const spans: Record<number, number> = {};

  for (let i = 0; i < data.length; i++) {
    const currentValue = data[i]?.[columnId];
    const parentValue = parentColumnId ? data[i]?.[parentColumnId] : undefined;

    const isDuplicate =
      i > 0 &&
      data[i - 1]?.[columnId] === currentValue &&
      (!parentColumnId || data[i - 1]?.[parentColumnId] === parentValue);

    if (isDuplicate) {
      spans[i] = 0;
      continue;
    }

    let span = 1;
    for (let j = i + 1; j < data.length; j++) {
      const matchesValue = data[j]?.[columnId] === currentValue;
      const matchesParent =
        !parentColumnId || data[j]?.[parentColumnId] === parentValue;

      if (matchesValue && matchesParent) {
        span++;
      } else break;
    }

    spans[i] = span;
  }

  return spans;
}

// 2️⃣ Helper: Compute totals for numeric columns

const DataTable = <TData, TValue>({
  columns,
  data,
  groupedColumns = [],
  emptyMessage = "Nada a apresentar...",
  totalSum,
}: DataTableProps<TData, TValue>) => {
  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const table = useReactTable({
    data: safeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const columnSpans = useMemo(() => {
    const spans: Record<string, Record<number, number>> = {};
    groupedColumns.forEach((col, i) => {
      const parent = i > 0 ? groupedColumns[i - 1] : undefined;
      spans[String(col)] = computeRowSpans(safeData, col, parent);
    });
    return spans;
  }, [safeData, groupedColumns]);

  const getGroupedCellStyles = (index: number) => {
    const shades = ["bg-muted/40", "bg-muted/25", "bg-muted/10"];
    const bg = shades[index] ?? "bg-muted/40";
    return `font-medium border-r border-border ${bg} align-middle`;
  };

  if (safeData.length === 0) {
    return (
      <div className="w-full border border-border rounded-md p-8 text-center text-muted-foreground bg-muted/10">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table className="w-full border border-border rounded-md p-2 border-collapse shadow-sm bg-background">
      {/* Header */}
      <TableHeader className="bg-muted/50">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-center font-semibold text-foreground border-b border-border"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {/* Body */}
      <TableBody>
        {table.getRowModel().rows.map((row, rowIndex) => (
          <TableRow
            key={row.id}
            className="border-b border-border hover:bg-muted/30 transition-colors"
          >
            {row.getVisibleCells().map((cell) => {
              const colId = cell.column.id as keyof TData;
              const groupedIndex = groupedColumns.indexOf(colId);

              if (groupedIndex !== -1) {
                const span = columnSpans[String(colId)]?.[rowIndex] ?? 1;
                if (span === 0) return null;

                return (
                  <TableCell
                    key={cell.id}
                    rowSpan={span}
                    className={`${getGroupedCellStyles(groupedIndex)} px-4 py-2`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              }

              const value = flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              );

              // 3️⃣ Format numbers/money in pt-PT
              const formatted =
                typeof value === "number"
                  ? value.toLocaleString("pt-PT", { minimumFractionDigits: 2 })
                  : value;

              return (
                <TableCell
                  key={cell.id}
                  className="border-r border-border text-center"
                >
                  {formatted}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>

      {/* 4️⃣ Footer: Totals row */}
      <tfoot>
        <TableRow className="bg-muted/30 font-semibold border-t border-border">
          <TableCell colSpan={6} className="text-right">
            Total:
          </TableCell>
          <TableCell colSpan={6} className="text-center">
            {formatMoneyPT(totalSum)}
          </TableCell>
        </TableRow>
      </tfoot>
    </Table>
  );
};

export default DataTable;
