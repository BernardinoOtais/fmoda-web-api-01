"use client";

import { PlaneamentoOpsNaoPlaneadas } from "@repo/tipos/planeamento";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

export const colunasNovoPlaneamento = (
  maisQueUmaOP: boolean,
  posting: boolean
): ColumnDef<PlaneamentoOpsNaoPlaneadas>[] => [
  {
    id: "select",
    accessorKey: "op",
    header: ({ table, column }) => (
      <div className="flex flex-row gap-2 items-center justify-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-2 py-2 ">
        <label className="flex items-center cursor-pointer">
          <Checkbox
            disabled={maisQueUmaOP || posting}
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="mr-2"
          />
          <span>Op</span>
        </label>
        <Button
          variant="ghost"
          disabled={posting}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex justify-center items-center "
          size="icon"
        >
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-row gap-2 items-center  justify-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-2 py-2 ">
        <label className="flex items-center cursor-pointer">
          <Checkbox
            disabled={posting}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Select ${row.original.op}`}
            className="mr-2"
          />
          <span>{row.original.op}</span>
        </label>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "departamento",
    header: ({ column }) => {
      return (
        <Button
          disabled={posting}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex justify-center items-center w-full"
        >
          Modelo / Departamento
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const { modelo, foto, descricao, departamento } = row.original;
      return (
        <div className="flex flex-col items-center justify-center ">
          <p>{departamento}</p>
          <div className="w-36 h-36 flex items-center justify-center relative">
            <LazyFotoClient
              src={foto}
              alt="Foto Modelo"
              cssImage="w-36 h-36 object-contain mx-auto"
            />
          </div>
          <p>{modelo}</p>
          <p>{descricao}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "quantidade",
    header: ({ column }) => {
      return (
        <Button
          disabled={posting}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full mx-auto"
        >
          Qtt
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const { quantidade } = row.original;
      return (
        <div className="flex flex-col items-center justify-center">
          {quantidade}
        </div>
      );
    },
  },
  {
    accessorKey: "pedido",
    header: "Pedido",
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
    enableHiding: true,
  },
  {
    accessorKey: "op",
    header: "Op",
    enableHiding: true,
  },
];
