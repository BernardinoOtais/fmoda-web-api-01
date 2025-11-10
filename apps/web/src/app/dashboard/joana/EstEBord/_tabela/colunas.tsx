import { EstampadoEBordadoDto } from "@repo/tipos/joana/esteborda";
import { ColumnDef } from "@tanstack/react-table";

import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

const ColunasMalhaMaMc = (): ColumnDef<EstampadoEBordadoDto>[] => [
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
];

export default ColunasMalhaMaMc;
