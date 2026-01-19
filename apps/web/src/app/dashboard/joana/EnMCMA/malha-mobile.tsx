import { MalhasEntradasMcMaDto } from "@repo/tipos/joana/emmcma";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";

type MalhaMobileProps = {
  dados: MalhasEntradasMcMaDto[];
  escondeOuMostra: (variables: { bostamp: string }) => void;
  veEscondidas: boolean;
};
const MalhaMobile = ({
  dados,
  escondeOuMostra,
  veEscondidas,
}: MalhaMobileProps) => {
  return (
    <>
      {dados.map((op) => (
        <Card key={op.obrano} className="m-1 py-1 gap-0 ">
          <CardContent>
            <div className="flex flex-col items-center justify-center  p-1 order-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    role="button"
                    className=" cursor-pointer"
                    onClick={() => escondeOuMostra({ bostamp: op.bostamp })}
                  >
                    Op: <span className="font-bold">{op.obrano}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{veEscondidas ? "_Mostra op_" : "_Esconde Op_"}</p>
                </TooltipContent>
              </Tooltip>
              <span>
                Cliente: <span className="font-bold">{op.cliente}</span>
              </span>
              <span className="text-center ">{op.design}</span>
              <span className="text-center">
                Cor: <span className="font-bold">{op.cor}</span>
              </span>
              {process.env.NODE_ENV === "production" && (
                <LazyFotoClient
                  src={op.foto || ""}
                  alt="Foto Modelo"
                  cssImage="w-40 h-40 object-contain rounded-md border border-border"
                />
              )}

              {op.detalheMalha.map((de) => (
                <div className="flex flex-col" key={de.perfix}>
                  <Card>
                    <CardContent className="flex flex-col sm:flex-row">
                      <div className="border-b sm:border-b-0 sm:border-r border-border flex justify-center items-center p-0.5">
                        <span className="font-semibold">
                          {de.perfix.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-col p-0.5">
                        {de.malhas.map((ma, maIdx) => (
                          <div key={maIdx} className="flex flex-col">
                            <span className="font-bold mx-auto">{ma.nome}</span>
                            <span className="mx-auto"> {ma.design}</span>

                            <Table className=" border border-border rounded-md border-collapse">
                              <TableHeader className="bg-muted ">
                                <TableRow>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Pedido
                                  </TableHead>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Recebido
                                  </TableHead>
                                  <TableHead className="text-center font-semibold border border-border h-7 ">
                                    Enviado
                                  </TableHead>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Unid
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                                    {ma.qtt}
                                  </TableCell>
                                  <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                                    {ma.recebido}
                                  </TableCell>
                                  <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                                    {ma.enviado}
                                  </TableCell>
                                  <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                                    {ma.unidade}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default MalhaMobile;
