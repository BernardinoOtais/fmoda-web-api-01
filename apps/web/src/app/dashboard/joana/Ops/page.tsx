"use client";

import { PesquisaOpsSchema } from "@repo/tipos/joana/ops";
import { skipToken, useQuery } from "@repo/trpc";
import React, { Fragment, useState } from "react";

import TabelaTamanhosQtt from "../_joana-aux/componentes/tabela-tamanhos-qtt";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import useDebounce from "@/hooks/use-debounce";
import { formatMoneyPT } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

const Ops = () => {
  const trpc = useTRPC();

  const [opI, setOp] = useState("");
  const [modeloI, setModelo] = useState("");
  const [pedidoI, setPedido] = useState("");

  const debouncedOp = useDebounce(opI, 1250);
  const debouncedModelo = useDebounce(modeloI, 1250);
  const debouncedPedido = useDebounce(pedidoI, 1250);

  const parsed = PesquisaOpsSchema.safeParse({
    op: debouncedOp || null,
    modelo: debouncedModelo || null,
    pedido: debouncedPedido || null,
  });

  const { data, isLoading, isError } = useQuery({
    ...trpc.JoanagetOps.getOps.queryOptions(
      parsed.success
        ? {
            op: parsed.data.op,
            modelo: parsed.data.modelo,
            pedido: parsed.data.pedido,
          }
        : skipToken,
    ),
    enabled: parsed.success,
  });

  return (
    <>
      <header className="space-y-2 border-b py-3 text-center">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center gap-1">
            <Label htmlFor="op">OP:</Label>
            <Input
              className="w-28"
              id="op"
              value={opI}
              onChange={(e) => setOp(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1">
            <Label htmlFor="modelo">Modelo:</Label>
            <Input
              className="w-40"
              id="modelo"
              value={modeloI}
              onChange={(e) => setModelo(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1">
            <Label htmlFor="pedido">Pedido:</Label>
            <Input
              className="w-40"
              id="pedido"
              value={pedidoI}
              onChange={(e) => setPedido(e.target.value)}
            />
          </div>
        </div>

        {/* Validation error */}
        {!parsed.success &&
          debouncedOp !== "" &&
          debouncedModelo !== "" &&
          debouncedPedido !== "" && (
            <p className="text-sm text-red-500">
              {parsed.error.issues[0]?.message}
            </p>
          )}

        {/* Loading */}
        {parsed.success && isLoading && (
          <p className="text-sm text-muted-foreground">A procurar...</p>
        )}

        {/* API error */}
        {isError && (
          <p className="text-sm text-red-500">Erro ao carregar dados.</p>
        )}
      </header>
      {data && (
        <main className="relative grow">
          <div className="absolute top-0 bottom-0 flex w-full">
            <div className="flex w-full flex-col items-center gap-1 overflow-auto ">
              {data.map((d) => (
                <Card
                  key={d.bostamp}
                  className="w-full max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto gap-1 p-1"
                >
                  <CardContent className="grid grid-cols-1 lg:grid-cols-2 p-1 gap-1">
                    {/* Element 1 */}
                    <div className="flex flex-col items-center justify-center border border-border rounded-md p-1 order-1">
                      <span role="button" className=" cursor-pointer">
                        Op: <span className="font-bold">{d.obrano}</span>
                      </span>

                      <span>
                        Cliente: <span className="font-bold">{d.cliente}</span>
                      </span>
                      <span>
                        Modelo: <span className="font-bold">{d.modelo}</span>
                      </span>
                      <span className="text-center ">{d.design}</span>
                      <span className="text-center">
                        Cor: <span className="font-bold">{d.cor}</span>
                      </span>
                      <span className="text-center">
                        Pedido:<span className="font-bold">{d.pCliente}</span>
                      </span>

                      <Table className="border border-border rounded-md border-collapse  mx-auto ">
                        <TableHeader className="bg-muted">
                          <TableRow>
                            <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                              Qtt Pedida
                            </TableHead>
                            <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                              Qtt Faturada
                            </TableHead>
                            <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                              Valor Faturado
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          <TableRow>
                            <TableCell className="border border-border text-center h-2 px-1 py-0 w-0">
                              {d.qttPedida}
                            </TableCell>
                            <TableCell className="border border-border text-center h-2 px-1 py-0 w-0">
                              {d.qttFaturada}
                            </TableCell>

                            <TableCell className="border border-border text-center h-2 px-1 py-0 w-0">
                              {formatMoneyPT(d.valorFaturada)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      {process.env.NODE_ENV === "production" && (
                        <LazyFotoClient
                          src={d.foto || ""}
                          alt="Foto Modelo"
                          cssImage="w-40 h-40 object-contain rounded-md border border-border"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-center border border-border flex-col rounded-md p-1 order-2 space-y-1">
                      <Card className="w-full">
                        <CardContent className="flex flex-col items-center">
                          <span className="font-bold">Pedido</span>
                          {d.pedido.map((p, idx) => (
                            <Fragment key={idx}>
                              <span className=" cursor-pointer">
                                Data Entrega:
                                <span className="font-bold">
                                  {p.dataEntrega.toLocaleDateString("pt-PT")}
                                </span>
                              </span>
                              <TabelaTamanhosQtt dados={p.detablhePedido} />
                            </Fragment>
                          ))}
                        </CardContent>
                      </Card>

                      {d.pedido.length > 1 && (
                        <Card className="w-full">
                          <CardContent className="flex flex-col items-center">
                            <span className="font-bold">Total Pedido</span>
                            {d.pedidoT.map((p, idx) => (
                              <Fragment key={idx}>
                                <TabelaTamanhosQtt dados={p.detablhePedido} />
                              </Fragment>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      <Card className="w-full">
                        <CardContent className="flex flex-col items-center">
                          <span className="font-bold">Faturado</span>
                          {d.faturado.map((p, idx) => (
                            <Fragment key={idx}>
                              <div className="flex flex-row space-x-2">
                                <span className=" cursor-pointer">
                                  {`${p.nmdoc}: `}
                                  <span className="font-bold">{p.fno}</span>
                                </span>

                                <span className=" cursor-pointer">
                                  Data:{" "}
                                  <span className="font-bold">
                                    {p.fdata.toLocaleDateString("pt-PT")}
                                  </span>
                                </span>
                                <span className="cursor-pointer">
                                  Valor:{" "}
                                  <span className="font-bold">
                                    {formatMoneyPT(p.valor)}
                                  </span>
                                </span>
                              </div>

                              <TabelaTamanhosQtt dados={p.detalheFaturado} />
                            </Fragment>
                          ))}
                        </CardContent>
                      </Card>

                      {d.faturado.length > 1 && (
                        <Card className="w-full">
                          <CardContent className="flex flex-col items-center">
                            <span className="font-bold">Total Faturado</span>
                            {d.faturadoT.map((p, idx) => (
                              <Fragment key={idx}>
                                <span className="cursor-pointer">
                                  Valor:{" "}
                                  <span className="font-bold">
                                    {formatMoneyPT(p.valor)}
                                  </span>
                                </span>

                                <TabelaTamanhosQtt dados={p.detalheFaturado} />
                              </Fragment>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Ops;
