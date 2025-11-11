import { EstampadoEBordadoDto } from "@repo/tipos/joana/esteborda";
import { ColumnDef } from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

const ColunasMalhaMaMc = (): ColumnDef<EstampadoEBordadoDto>[] => [
  {
    accessorKey: "op",
    header: "Op",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-3">
          <span className="font-semibold text-sm">{row.original.op}</span>
          {process.env.NODE_ENV === "production" && (
            <LazyFotoClient
              src={row.original.foto || ""}
              alt="Foto Modelo"
              cssImage="w-20 h-20 object-contain rounded-md border border-border"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "tipoServico",
    header: "Serviço",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.tipoServico}</span>
    ),
  },
  {
    header: "Detalhe",
    cell: ({ row }) => {
      const detalhe = row.original.detalhe || [];

      return (
        <div className="flex flex-col ">
          {detalhe.map((d, i) => (
            <div key={i} className="flex flex-col ">
              {d.enviadoRecebidoFornecedor.map((f) => {
                return (
                  <Card
                    key={f.fornecedor}
                    className="overflow-hidden transition-shadow hover:shadow-md gap-0 "
                  >
                    <CardHeader className="p-2">
                      <CardTitle className="text-base font-semibold text-center">
                        {f.fornecedor}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="">
                      {/* Enviado Section */}
                      <div className="">
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          {`${row.original.nomeEnviado} Enviado:`}
                        </h4>
                        <div className="rounded-lg overflow-hidden border border-border">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50">
                                {f.enviado.map((fc) => (
                                  <TableHead
                                    key={fc.tam}
                                    className="text-center font-semibold h-9 border-r border-border last:border-r-0 p-2 w-20"
                                  >
                                    {fc.tam}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="hover:bg-muted/30">
                                {f.enviado.map((item) => (
                                  <TableCell
                                    key={item.tam}
                                    className="text-center font-medium border-r border-border last:border-r-0 p-2 w-20"
                                  >
                                    {item.qtt}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Recebido Section */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          {`${row.original.nomeRecebido} Recebido:`}
                        </h4>
                        <div className="rounded-lg overflow-hidden border border-border">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50">
                                {f.recebido.map((fc) => (
                                  <TableHead
                                    key={fc.tam}
                                    className="text-center font-semibold h-9 border-r border-border last:border-r-0 p-2 w-20"
                                  >
                                    {fc.tam}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="hover:bg-muted/30">
                                {f.recebido.map((item) => (
                                  <TableCell
                                    key={item.tam}
                                    className="text-center font-medium border-r border-border last:border-r-0 p-2 w-20"
                                  >
                                    {item.qtt}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {d.enviadoRecebidoFornecedor.length > 1 &&
                d.totais.map((t, i) => (
                  <div key={i} className="flex flex-col ">
                    <Card className="overflow-hidden transition-shadow hover:shadow-md gap-0 ">
                      <CardHeader className="p-2">
                        <CardTitle className="text-base font-semibold text-center">
                          Totais
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="">
                        {/* Enviado Section */}
                        <div className="">
                          <h4 className="text-sm font-semibold text-muted-foreground">
                            {`${row.original.nomeEnviado} Enviado:`}
                          </h4>
                          <div className="rounded-lg overflow-hidden border border-border">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/50">
                                  {t.enviado.map((fc) => (
                                    <TableHead
                                      key={fc.tam}
                                      className="text-center font-semibold h-9 border-r border-border last:border-r-0 p-2 w-20"
                                    >
                                      {fc.tam}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow className="hover:bg-muted/30">
                                  {t.enviado.map((item) => (
                                    <TableCell
                                      key={item.tam}
                                      className="text-center font-medium border-r border-border last:border-r-0 p-2 w-20"
                                    >
                                      {item.qtt}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        {/* Recebido Section */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-muted-foreground">
                            {`${row.original.nomeRecebido} Recebido:`}
                          </h4>
                          <div className="rounded-lg overflow-hidden border border-border">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/50">
                                  {t.recebido.map((fc) => (
                                    <TableHead
                                      key={fc.tam}
                                      className="text-center font-semibold h-9 border-r border-border last:border-r-0 p-2 w-20"
                                    >
                                      {fc.tam}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow className="hover:bg-muted/30">
                                  {t.recebido.map((item) => (
                                    <TableCell
                                      key={item.tam}
                                      className="text-center font-medium border-r border-border last:border-r-0 p-2 w-20"
                                    >
                                      {item.qtt}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          ))}
        </div>
      );
    },
  },
];

export default ColunasMalhaMaMc;
