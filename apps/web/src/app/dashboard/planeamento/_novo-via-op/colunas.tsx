"use client";

import { PlaneamentoOpsNaoPlaneadas } from "@repo/tipos/planeamento";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

export const colunas: ColumnDef<PlaneamentoOpsNaoPlaneadas>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex flex-row gap-2 items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-2 py-2 ">
        <label className="flex items-center cursor-pointer">
          <Checkbox
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
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-row gap-2 items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-2 py-2 ">
        <label className="flex items-center cursor-pointer">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Select ${row.original.op}`}
            className="mr-2"
          />
          <span>{row.original.op}</span>
        </label>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "op",
    header: "Op",
    enableHiding: true, // allow hiding
  },
  {
    accessorKey: "departamento",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex justify-center items-center w-full"
        >
          Modelo / Departamento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { modelo, foto, descricao, departamento } = row.original;
      return (
        <div className="flex flex-col items-center justify-center">
          <p>{departamento}</p>
          {process.env.NODE_ENV === "production" && (
            <LazyFotoClient
              src={foto}
              alt="Foto Modelo"
              cssImage="w-24 mx-auto m-2"
            />
          )}
          <p>{modelo}</p>
          <p>{descricao}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "pedido",
    header: "Pedido",
  },
  {
    accessorKey: "quantidade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Qtt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
    enableHiding: true, // allow hiding
  },
];
