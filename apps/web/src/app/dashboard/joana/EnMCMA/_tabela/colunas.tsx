import { MalhasEntradasMcMaDto } from "@repo/tipos/joana/emmcma";
import { ColumnDef } from "@tanstack/react-table";

import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

const ColunasMalhaMaMc = (): ColumnDef<MalhasEntradasMcMaDto>[] => [
  {
    accessorKey: "op",
    header: "Op",
    cell: ({ row }) => (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-pointer font-medium hover:underline">
              {row.original.op}
            </span>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="p-3 max-w-xs">
            <LazyFotoClient
              src={row.original.foto || ""}
              alt="Foto Modelo"
              cssImage="w-24 h-24 object-contain mx-auto"
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
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
