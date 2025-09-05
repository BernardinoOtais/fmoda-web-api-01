"use client";

import { PlaneamentoOpsNaoPlaneadas } from "@repo/tipos/planeamento";
import { ColumnDef } from "@tanstack/react-table";

import FotoClient from "@/components/ui-personalizado/fotos/foto-client";

export const colunas: ColumnDef<PlaneamentoOpsNaoPlaneadas>[] = [
  {
    accessorKey: "op",
    header: "Op",
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
    cell: ({ row }) => {
      const { modelo, foto, descricao, departamento } = row.original;
      return (
        <div className="flex flex-col items-center justify-center">
          <p>{departamento}</p>
          <FotoClient
            src={foto}
            alt="Foto Modelo"
            cssImage="w-24 mx-auto m-2"
          />
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
    header: "Qtt",
  },
];
