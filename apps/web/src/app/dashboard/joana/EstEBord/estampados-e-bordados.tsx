"use client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@repo/trpc";
import React, { useState, useEffect, Fragment } from "react";
import { toast } from "sonner";

import TabelaTamanhosQtt from "../_joana-aux/componentes/tabela-tamanhos-qtt";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import SwitchFechado from "@/components/ui-personalizado/meus-components/switch-fechado";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type EstampadosEBordadosProps = { veEscondidas: boolean };
const EstampadosEBordados = ({ veEscondidas }: EstampadosEBordadosProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [searchOp, setSearchOp] = useState<string>("");
  const debouncedOp = useDebounce(searchOp, 1500);
  const opValue = debouncedOp.trim() === "" ? null : Number(debouncedOp);

  const { data } = useSuspenseQuery(
    trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryOptions({
      op: opValue,
      veEscondidas,
    })
  );

  const { mutate: escondeOuMostra } = useMutation(
    trpc.joanaEstampadosEBordados.patchPostInsertEscondeBordadosEstampados.mutationOptions(
      {
        onMutate: async (valor) => {
          await queryClient.cancelQueries(
            trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryOptions({
              op: opValue,
              veEscondidas,
            })
          );
          const previousData = queryClient.getQueryData(
            trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryKey({
              op: opValue,
              veEscondidas,
            })
          );

          queryClient.setQueryData(
            trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryKey({
              op: opValue,
              veEscondidas,
            }),
            (old) => {
              if (!old) return old;
              return old.filter((o) => o.bostamp !== valor.bostamp);
            }
          );
          return { previousData };
        },
        onSuccess: () => {
          toast.success(
            veEscondidas ? "Visível com sucesso..." : "Escondida com sucesso..."
          );
        },
        onError: (_error, _updatedEnvio, context) => {
          toast.error("Error...");
          if (
            context?.previousData &&
            trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryKey({
              op: opValue,
              veEscondidas,
            })
          )
            queryClient.setQueryData(
              trpc.joanaEstampadosEBordados.getEstampadosEBordados.queryKey({
                op: opValue,
                veEscondidas,
              }),
              context.previousData
            );
        },
      }
    )
  );
  const [filtered, setFiltered] = useState(data);

  useEffect(() => {
    setFiltered(data);
  }, [data]);

  return (
    <>
      <header>
        <div className="flex flex-row   items-center p-1">
          <SwitchFechado
            titulo="Mostra Escondidos"
            fechado={veEscondidas}
            className="mx-auto"
            param="esc"
          />

          <div className="mx-auto flex flex-row items-center">
            <span className=" px-1">Op :</span>
            <Input
              placeholder="Pesquisar por op..."
              value={searchOp}
              onChange={(e) => setSearchOp(e.target.value)}
              className="w-44"
            />
          </div>
        </div>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto">
            {filtered.map((op, index) => (
              <Card
                key={index}
                className="w-full max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto gap-1 p-1"
              >
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 p-1 gap-1">
                  <div className="flex flex-col items-center justify-center border border-border rounded-md p-1 order-1">
                    <span
                      className=" cursor-pointer"
                      onClick={() => escondeOuMostra({ bostamp: op.bostamp })}
                    >
                      Op: <span className="font-bold">{op.obrano}</span>
                    </span>
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
                  </div>
                  <div className="flex items-center justify-center border border-border flex-col rounded-md p-1 order-2">
                    {op.bordadosEEstampados.map((be) => (
                      <Fragment key={be.tipoServico}>
                        <span className="font-bold">{be.tipoServico}</span>
                        {be.detalhe.map((de) => (
                          <Card key={de.enviado + de.recebido}>
                            <CardContent>
                              {de.fornecedores.length > 1 && (
                                <div className="flex flex-col">
                                  {
                                    <span className="font-bold text-center ">
                                      Totais
                                    </span>
                                  }

                                  {de.totais.map((t, i) => (
                                    <div key={i}>
                                      <TabelaTamanhosQtt
                                        dados={t.enviado}
                                        dados2={t.recebido}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {de.fornecedores.map((f) => (
                                <div
                                  key={f.fornecedor}
                                  className="flex flex-col"
                                >
                                  <span className="font-bold text-center">
                                    {f.fornecedor}
                                  </span>
                                  <span className="text-center text-xs">
                                    <strong>Enviado:</strong> {de.nomeEnviado}
                                  </span>

                                  <span className="text-center text-xs">
                                    <strong>Recebido:</strong> {de.nomeRecebido}
                                  </span>

                                  <TabelaTamanhosQtt
                                    dados={f.enviado}
                                    dados2={f.recebido}
                                  />
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        ))}
                      </Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default EstampadosEBordados;
