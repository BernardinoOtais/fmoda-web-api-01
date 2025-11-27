"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Item = {
  id: number;
  name: string;
  quantity: number;
};

// 2) Define columns
export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "quantity",
    header: "quantity",
  },
];

const Faturacao = () => {
  const data: Item[] = [
    { id: 1, name: "Item A", quantity: 10 },
    { id: 2, name: "Item B", quantity: 5 },
    { id: 3, name: "Item C", quantity: 8 },
  ];
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Desenho fatura</h2>
      <DataTable
        columns={columns}
        data={data}
        renderDetail={(row) => (
          <div className="p-4 bg-muted/40 rounded-md">
            <p className="text-sm">ID: {row.id}</p>
            <p className="text-sm">Name: {row.name}</p>
            <p className="text-sm">Quantity: {row.quantity}</p>
          </div>
        )}
      />
    </div>
  );
};

export default Faturacao;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderDetail?: (row: TData) => React.ReactNode;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  renderDetail,
}: DataTableProps<TData, TValue>) => {
  const [openRow, setOpenRow] = useState<number | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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

        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <React.Fragment key={row.id}>
              <TableRow
                key={`${row.id}-main`}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setOpenRow(openRow === index ? null : index)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>

              {renderDetail && (
                <TableRow key={`${row.id}-detail`}>
                  <TableCell
                    colSpan={row.getVisibleCells().length}
                    className="p-0"
                  >
                    <div
                      className={`overflow-hidden transition-all duration-500 ${openRow === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="p-4 text-sm flex flex-col">
                        <span>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Harum debitis accusamus cum laboriosam error ut
                          iste alias quisquam eaque nisi minima molestiae,
                          reiciendis in aut id ex? Sequi, velit aperiam?
                        </span>
                        <span>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Harum debitis accusamus cum laboriosam error ut
                          iste alias quisquam eaque nisi minima molestiae,
                          reiciendis in aut id ex? Sequi, velit aperiam?
                        </span>

                        <span>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Harum debitis accusamus cum laboriosam error ut
                          iste alias quisquam eaque nisi minima molestiae,
                          reiciendis in aut id ex? Sequi, velit aperiam?
                        </span>

                        <span>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Harum debitis accusamus cum laboriosam error ut
                          iste alias quisquam eaque nisi minima molestiae,
                          reiciendis in aut id ex? Sequi, velit aperiam?
                        </span>

                        <span>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Harum debitis accusamus cum laboriosam error ut
                          iste alias quisquam eaque nisi minima molestiae,
                          reiciendis in aut id ex? Sequi, velit aperiam?
                        </span>
                        <span>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Harum debitis accusamus cum laboriosam error ut
                          iste alias quisquam eaque nisi minima molestiae,
                          reiciendis in aut id ex? Sequi, velit aperiam?
                        </span>
                        <span>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Harum debitis accusamus cum laboriosam error ut
                          iste alias quisquam eaque nisi minima molestiae,
                          reiciendis in aut id ex? Sequi, velit aperiam?
                        </span>
                        <span>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Harum debitis accusamus cum laboriosam error ut
                          iste alias quisquam eaque nisi minima molestiae,
                          reiciendis in aut id ex? Sequi, velit aperiam?
                        </span>

                        <span>{`id: ${row.original}`}</span>
                        <span></span>
                        <span></span>
                        {renderDetail(row.original)}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

/*

              {renderDetail && openRow === index && (
                <TableRow key={`${row.id}-detail`}>
                  <TableCell colSpan={row.getVisibleCells().length}>
                    <div className="p-4 text-sm">
                      {renderDetail(row.original)}
                    </div>
                  </TableCell>
                </TableRow>
              )}

*/
