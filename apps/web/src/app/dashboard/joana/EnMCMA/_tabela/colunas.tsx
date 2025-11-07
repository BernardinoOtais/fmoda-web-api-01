import { MalhasEntradasMcMaDto } from "@repo/tipos/joana/emmcma";
import { ColumnDef } from "@tanstack/react-table";

import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

const ColunasMalhaMaMc = (): ColumnDef<MalhasEntradasMcMaDto>[] => [
  {
    accessorKey: "op",
    header: "Op",
    cell: ({ row }) => {
      //console.log(row.original.foto);
      return (
        <div className="flex flex-row items-center">
          <span className="p-1">{row.original.op}</span>
          <LazyFotoClient
            src={row.original.foto || ""}
            alt="Foto Modelo"
            cssImage="w-24 h-24 object-contain mx-auto"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "ref",
    header: "Código",
    enableHiding: true,
  },
  {
    accessorKey: "design",
    header: "Designação",
    enableHiding: true,
  },
  {
    accessorKey: "pedido",
    header: "Qtt Pedida",
    enableHiding: true,
  },
  {
    accessorKey: "recebido",
    header: "Qtt Recebida",
    enableHiding: true,
  },
  {
    accessorKey: "enviado",
    header: "Qtt Enviada",
    enableHiding: true,
  },
  {
    accessorKey: "unidade",
    header: "Un",
    enableHiding: true,
  },
];

export default ColunasMalhaMaMc;
