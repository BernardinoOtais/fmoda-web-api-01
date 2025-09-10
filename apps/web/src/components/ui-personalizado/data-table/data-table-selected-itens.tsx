import { Table } from "@tanstack/react-table";
import React from "react";

type DataTableSelectedItensProps<TData> = {
  table: Table<TData>;
};
const DataTableSelectedItens = <TData,>({
  table,
}: DataTableSelectedItensProps<TData>) => {
  return (
    <div className="text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} de{" "}
      {table.getFilteredRowModel().rows.length} linha(s) seleccionadas.
    </div>
  );
};

export default DataTableSelectedItens;
