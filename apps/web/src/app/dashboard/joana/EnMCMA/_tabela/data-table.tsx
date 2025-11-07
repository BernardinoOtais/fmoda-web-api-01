import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import { Table } from "@/components/ui/table";

type DataTableProps<TData extends Record<string, any>, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

const DataTable = <TData extends Record<string, any>, TValue>({
  columns,
  data = [],
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const safeData = Array.isArray(data) ? data : [];

  // Precompute row spans for the "op" column
  const rowSpans: Record<number, number> = {};
  for (let i = 0; i < safeData.length; i++) {
    const current = safeData[i]?.op;
    if (i > 0 && safeData[i - 1]?.op === current) {
      rowSpans[i] = 0; // skip duplicate
    } else {
      let span = 1;
      for (
        let j = i + 1;
        j < safeData.length && safeData[j]?.op === current;
        j++
      ) {
        span++;
      }
      rowSpans[i] = span;
    }
  }

  return (
    <Table className="w-full border border-border rounded-md text-sm">
      <thead className="bg-muted/50">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b border-border">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-4 py-2 text-left font-semibold text-foreground"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row, i) => (
          <tr
            key={row.id}
            className="border-b border-border hover:bg-muted/40 transition-colors"
          >
            {row.getVisibleCells().map((cell) => {
              if (cell.column.id === "op") {
                const span = rowSpans[i];
                if (span === 0) return null;

                return (
                  <td
                    key={cell.id}
                    rowSpan={span}
                    className="px-4 py-2 font-medium border-r border-border bg-muted/30 align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              }

              return (
                <td key={cell.id} className="px-4 py-2 border-r border-border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DataTable;
