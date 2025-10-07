import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import DataTableComponent from "@/components/ui-personalizado/data-table/data-table-component";

type DataTablePlaneamnetosProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export const DataTablePlaneamnetos = <TData, TValue>({
  columns,
  data,
}: DataTablePlaneamnetosProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="w-full flex flex-col space-y-2"></div>
      {/* Tabela */}
      <DataTableComponent
        table={table}
        numeroColunas={columns.length}
        tableHeaderStyle="sticky top-0 z-10 bg-background border-b border-border"
      />
    </div>
  );
};
