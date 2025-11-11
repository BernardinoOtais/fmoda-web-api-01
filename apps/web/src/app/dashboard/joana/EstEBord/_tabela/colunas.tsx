import { EstampadoEBordadoDto } from "@repo/tipos/joana/esteborda";
import { ColumnDef } from "@tanstack/react-table";

import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ColunasMalhaMaMc = (): ColumnDef<EstampadoEBordadoDto>[] => [
  {
    accessorKey: "op",
    header: "Op",
    cell: ({ row }) => {
      //console.log(row.original.foto);
      return (
        <div className="flex flex-row items-center">
          <span className="p-1">{row.original.op}</span>
          {process.env.NODE_ENV === "production" && (
            <LazyFotoClient
              src={row.original.foto || ""}
              alt="Foto Modelo"
              cssImage="w-24 h-24 object-contain mx-auto"
            />
          )}
        </div>
      );
    },
  },
  {
    header: "Detalhe",
    cell: ({ row }) => {
      const detalhe = row.original.detalhe || [];

      return (
        <>
          <div className="flex flex-col gap-1">
            {detalhe.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                {d.enviadoRecebidoFornecedor.map((f) => {
                  return (
                    <div
                      key={f.fornecedor}
                      className="flex flex-col items-center"
                    >
                      <span className="font-extrabold">{f.fornecedor}</span>
                      <span className="font-bold">
                        {row.original.nomeEnviado}
                      </span>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {f.enviado.map((fc) => (
                              <TableHead key={fc.tam}>{fc.tam}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            {f.enviado.map((row) => (
                              <TableCell key={row.tam}>{row.qtt}</TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>

                      <span className="font-bold">
                        {row.original.nomeRecebido}
                      </span>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {f.recebido.map((fc) => (
                              <TableHead key={fc.tam}>{fc.tam}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            {f.recebido.map((row) => (
                              <TableCell key={row.tam}>{row.qtt}</TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      );
    },
  },
];

export default ColunasMalhaMaMc;
