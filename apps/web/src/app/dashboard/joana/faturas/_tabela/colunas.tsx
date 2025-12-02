//FaturacaoLinhaDto

import { FaturacaoWebLinhaDto } from "@repo/tipos/joana/faturas";
import { ColumnDef } from "@tanstack/react-table";

import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import { formatMoneyPT } from "@/lib/my-utils";

const ColunasFaturacao = (): ColumnDef<FaturacaoWebLinhaDto>[] => [
  {
    accessorKey: "obrano",
    header: "Op",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-center justify-center rounded-md ">
          <span>
            Op: <span className="font-bold">{row.original.obrano}</span>
          </span>
          <span>
            Cliente: <span className="font-bold">{row.original.cliente}</span>
          </span>
          <span className="text-center ">{row.original.design}</span>
          <span className="text-center">
            Cor: <span className="font-bold">{row.original.cor}</span>
          </span>
          {process.env.NODE_ENV === "production" && (
            <LazyFotoClient
              src={row.original.foto || ""}
              alt="Foto Modelo"
              cssImage="w-40 h-40 object-contain rounded-md border border-border"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "fdata",
    header: "Data",
    cell: ({ row }) => {
      return <span>{row.original.fdata.toLocaleDateString("pt-PT")}</span>;
    },
  },
  {
    accessorKey: "fno",
    header: "Doc.N.",
    enableHiding: true,
  },
  {
    accessorKey: "nmdoc",
    header: "Tipo Doc.",
    enableHiding: true,
  },
  {
    accessorKey: "qtt",
    header: "Qtt F.",
    enableHiding: true,
  },
  {
    accessorKey: "epv",
    header: "Preço",
    enableHiding: true,
    cell: ({ row }) => {
      return <span>{formatMoneyPT(row.original.epv)}</span>;
    },
  },
  {
    accessorKey: "total",
    header: "Total F.",
    cell: ({ row }) => {
      return <span>{formatMoneyPT(row.original.total)}</span>;
    },
    enableHiding: true,
  },
];

export default ColunasFaturacao;
//Tue Nov 04 2025 00:00:00 GMT+0000 (Western European Standard Time)
