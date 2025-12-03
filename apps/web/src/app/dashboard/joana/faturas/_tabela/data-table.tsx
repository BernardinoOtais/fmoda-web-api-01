"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { Fragment, useMemo } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { formatMoneyPT } from "@/lib/my-utils";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  groupedColumns?: (keyof TData)[];
  emptyMessage?: string;
  totalSum: number;
};

type RowWithTotal = { total: number };

function computeRowSpans<TData>(
  data: TData[],
  columnId: keyof TData,
  parentColumnId?: keyof TData
): Record<number, number> {
  const spans: Record<number, number> = {};
  //console.log("dados a tratar : ", data);
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

  //console.log("spans : ", spans);
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

  if (safeData.length === 0) {
    return (
      <div className="w-full border border-border rounded-md text-center ">
        {emptyMessage}
      </div>
    );
  }

  const getTotalIndexes = (
    spans: Record<number, number> | undefined
  ): number[] => {
    if (!spans) return [];

    const totals: number[] = [];

    for (const [idxStr, span] of Object.entries(spans)) {
      const idx = Number(idxStr);

      if (span > 1) {
        totals.push(idx + span - 1);
      }
    }

    return totals;
  };

  const getGroupStart = (
    spans: Record<number, number> | undefined,
    endIndex: number
  ) => {
    if (!spans) return null;

    for (const [idxStr, span] of Object.entries(spans)) {
      const idx = Number(idxStr);

      if (span > 1 && idx + span - 1 === endIndex) {
        return idx;
      }
    }

    return null;
  };

  const listaIndexTotaisLista =
    groupedColumns.length === 0 || groupedColumns[0] === undefined
      ? []
      : getTotalIndexes(columnSpans[groupedColumns[0] as string] ?? {});

  //console.log(listaIndexTotaisLista);
  return (
    <Table className="w-full border border-border rounded-md border-collapse ">
      {/* Header */}
      <TableHeader className="bg-muted">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-center font-semibold border border-border h-7"
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
        {table.getRowModel().rows.map((row, rowIndex) => {
          console.log(row);
          return (
            <Fragment key={row.id}>
              <TableRow className="border border-border ">
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
                        className="border border-border "
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  }

                  const value = flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  );

                  const formatted =
                    typeof value === "number"
                      ? value.toLocaleString("pt-PT", {
                          minimumFractionDigits: 2,
                        })
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
              {listaIndexTotaisLista.includes(rowIndex) && (
                <TableRow className="bg-muted/30 font-semibold  h-2">
                  <TableCell
                    colSpan={6}
                    className="text-right px-2 py-0 border-r border-border"
                  >
                    T. do grupo:
                  </TableCell>

                  <TableCell className="text-center p-0">
                    {(() => {
                      const spans = columnSpans[groupedColumns[0] as string];
                      const startIndex = getGroupStart(spans, rowIndex);

                      if (startIndex == null) return null;

                      const slice = safeData.slice(startIndex, rowIndex + 1);

                      const sum = (slice as (TData & RowWithTotal)[]).reduce(
                        (acc, row) => acc + row.total,
                        0
                      );

                      return formatMoneyPT(sum);
                    })()}
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          );
        })}
      </TableBody>

      {/* 4️⃣ Footer: Totals row */}
      <TableFooter>
        <TableRow className="font-semibold border border-border h-2 ">
          <TableCell
            colSpan={6}
            className="text-right px-2 py-0 border-r border-border"
          >
            Total:
          </TableCell>
          <TableCell className="text-center p-0 ">
            {formatMoneyPT(totalSum)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DataTable;
