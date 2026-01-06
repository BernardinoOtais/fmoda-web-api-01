import { FaturasPlaneadasDto } from "@repo/tipos/joana/faturasplan";
import React, { useRef } from "react";

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
import { formatMoneyPT } from "@/lib/my-utils";
import { cn } from "@/lib/utils";

type FaturacaoPlaneadaMobileProps = {
  dadosPlaneados: FaturasPlaneadasDto;
};
const FaturacaoPlaneadaMobile = ({
  dadosPlaneados,
}: FaturacaoPlaneadaMobileProps) => {
  const { dados, valorTotalAPagar, valorTotalAReceber, qttTotal } =
    dadosPlaneados;
  const semanaRefs = useRef<HTMLDivElement[]>([]);
  return (
    <>
      <div className="mx-auto space-x-1  font-semibold text-center">
        <span>{`V.Serv: ${formatMoneyPT(valorTotalAPagar)}`}</span>
        <span>{`Qtt: ${qttTotal}`}</span>
        <span>{`V.Rec: ${formatMoneyPT(valorTotalAReceber)}`}</span>
      </div>
      {dados.map((s, sIdx) => (
        <Card
          key={s.SemanaNumero}
          ref={(el) => {
            semanaRefs.current[sIdx] = el!;
          }}
          className="m-1 py-1 gap-0 "
        >
          <CardHeader className="gap-0.5 px-2">
            <CardTitle className="flex flex-row ">
              <span
                className="cursor-pointer"
                onClick={() => {
                  const next =
                    sIdx === dados.length - 1
                      ? semanaRefs.current[0]
                      : semanaRefs.current[sIdx + 1];
                  if (next) {
                    next.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >{`Semana: ${s.SemanaNumero}`}</span>

              <div className="ml-auto space-x-1  text-xs font-semibold">
                <span>{`V.Serv: ${formatMoneyPT(s.valorServicoT)}`}</span>
                <span>{`Qtt: ${s.qtt}`}</span>
                <span>{`V.Rec: ${formatMoneyPT(s.valorTotalFatura)}`}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-1">
            {s.dataSemanda.map((d) => (
              <Card key={d.data.toISOString()} className="m-1 py-1 gap-0">
                <CardHeader className="gap-0.5 px-2">
                  <CardTitle>
                    {`Data: ${d.data.toLocaleDateString("pt-PT")}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-1">
                  {d.detalhe.map((de) => {
                    return (
                      <Card key={de.obrano} className="m-1 py-1 gap-0">
                        <CardHeader className="gap-0.5 px-2">
                          <CardTitle>{`Op: ${de.obrano}`}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                          <div className="flex flex-col items-center justify-center border border-border rounded-md p-1 order-1">
                            <span>
                              <span className="font-bold">{de.cliente}</span>
                            </span>
                            <span className="text-center ">{de.design}</span>
                            {process.env.NODE_ENV === "production" && (
                              <LazyFotoClient
                                src={de.foto || ""}
                                alt="Foto Modelo"
                                cssImage="w-40 h-40 object-contain rounded-md border border-border"
                              />
                            )}
                            <Table className="border border-border rounded-md border-collapse mx-auto ">
                              <TableHeader className="bg-muted">
                                <TableRow>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Fornecedor
                                  </TableHead>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Valor Seriço
                                  </TableHead>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Valor Total
                                  </TableHead>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Qtt Prevista
                                  </TableHead>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Valor Op
                                  </TableHead>
                                  <TableHead className="text-center font-semibold border border-border h-7">
                                    Valor Total
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {de.fornecedores.map((f, fIdx) => {
                                  return (
                                    <TableRow key={fIdx}>
                                      <TableCell className="border border-border text-center h-2 px-1 py-0 w-0">
                                        {f.nome}
                                      </TableCell>
                                      <TableCell className="border border-border text-center h-2 px-1 py-0 w-0">
                                        {formatMoneyPT(f.valorServico)}
                                      </TableCell>
                                      {fIdx === 0 && (
                                        <>
                                          <TableCell
                                            rowSpan={de.fornecedores.length}
                                            className="border border-border text-right h-2 px-1 py-0 w-0"
                                          >
                                            {formatMoneyPT(
                                              de.fornecedores.reduce(
                                                (acc, f) =>
                                                  acc + f.valorServico * de.qtt,
                                                0
                                              )
                                            )}
                                          </TableCell>
                                          <TableCell
                                            rowSpan={de.fornecedores.length}
                                            className="border border-border text-center h-2 px-1 py-0 w-0"
                                          >
                                            {de.qtt}
                                          </TableCell>
                                          <TableCell
                                            rowSpan={de.fornecedores.length}
                                            className={cn(
                                              "border border-border text-center h-2 px-1 py-0 w-0",
                                              de.nPrecosDif !== 1
                                                ? "border-red-500 bg-red-500 text-white"
                                                : "border-gray-300 dark:border-gray-700"
                                            )}
                                          >
                                            {formatMoneyPT(de.u_total)}
                                          </TableCell>
                                          <TableCell
                                            rowSpan={de.fornecedores.length}
                                            className="border border-border text-right h-2 px-1 py-0 w-0"
                                          >
                                            {formatMoneyPT(de.u_total * de.qtt)}
                                          </TableCell>
                                        </>
                                      )}
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default FaturacaoPlaneadaMobile;
