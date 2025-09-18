import { PlaneamentoLinha } from "@repo/tipos/planeamento";
import { ColumnDef } from "@tanstack/react-table";

import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

// PlaneamentoLinha
export const colunasPlaneamentos = (): ColumnDef<PlaneamentoLinha>[] => [
  {
    accessorKey: "id",
    header: "Foto",
    cell: ({ row }) => {
      const { plano_ops, plano_livres } = row.original;
      return (
        <div className="flex flex-col items-center justify-center">
          {process.env.NODE_ENV === "production" &&
            plano_ops?.map((op) => (
              <LazyFotoClient
                key={op.plan_op_id} // use a unique key field
                src={op.foto || ""}
                alt="Foto Modelo"
                cssImage="w-24 h-24 object-contain mx-auto"
              />
            ))}
        </div>
      );
    },
  },
  {
    accessorKey: "qtt",
    header: "Qtt",
  },
];

/*

              <LazyFotoClient
              key={op.op}
              src={op.foto}
              alt="Foto Modelo"
              cssImage="w-24 h-24 object-contain mx-auto"
            />

*/
