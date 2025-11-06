import { MalhasEntradasMcMaDto } from "@repo/tipos/joana/emmcma";
import { ColumnDef } from "@tanstack/react-table";

const ColunasMalhaMaMc = (): ColumnDef<MalhasEntradasMcMaDto>[] => [
  {
    accessorKey: "op",
    header: "Op",
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
