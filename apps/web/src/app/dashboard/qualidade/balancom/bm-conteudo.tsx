"use client";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import {
  BmDadosParaConsumo,
  BmFaturado,
  BmTotais,
} from "@repo/tipos/qualidade_balancom";
import { useSuspenseQuery } from "@repo/trpc";
import Link from "next/link";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AbreOuFechaBm from "@/components/ui-personalizado/balancom/abre-ou-fecha-bm";
import ComposicaoConsunos from "@/components/ui-personalizado/balancom/composicao-consumos";
import ImprimeEstandoFechado from "@/components/ui-personalizado/balancom/imprime-estando-fechado";
import NovoBalancoMassas from "@/components/ui-personalizado/balancom/novo-balanco-massas";
import Op from "@/components/ui-personalizado/balancom/op";
import NItensPorPagina from "@/components/ui-personalizado/meus-components/n-itens-por-pagina";
import Paginacao from "@/components/ui-personalizado/meus-components/paginacao";
import SwitchFechado from "@/components/ui-personalizado/meus-components/switch-fechado";
import { useTRPC } from "@/trpc/client";

type BmConteudoProps = {
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
  intensPorPagina: number;
  valorPageActual: number;
};

const BmConteudo = ({
  dadosIniciais,
  intensPorPagina,
  valorPageActual,
}: BmConteudoProps) => {
  const trpc = useTRPC();

  const { fechado: valorFechado } = dadosIniciais;

  const { data } = useSuspenseQuery(
    trpc.qualidadeBalancoM.getBms.queryOptions(dadosIniciais),
  );

  const heroItemCount = 0;
  const totalPages = Math.ceil(
    (data.tamanhoLista - heroItemCount) / intensPorPagina,
  );

  const tamanhoLista = data.tamanhoLista;
  const bms = data.lista;

  return (
    <>
      <header className="x-1 space-y-1.5 border-b py-3 text-center">
        <div className="flex items-center space-x-2">
          <SwitchFechado titulo="Bm's Fechados" fechado={valorFechado} />
          {valorFechado !== true && (
            <div className="mx-auto">
              <NovoBalancoMassas dadosIniciais={dadosIniciais} />
            </div>
          )}
          {tamanhoLista > 10 && (
            <div className="mx-auto">
              <NItensPorPagina
                itensPorPagina={intensPorPagina}
                tamanhoLista={tamanhoLista}
              />
            </div>
          )}
        </div>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto">
            <>
              {(bms ?? []).map((bm) => {
                const faturado: BmFaturado =
                  bm.BmOp?.flatMap((movimentos) => {
                    return (
                      movimentos.BmOpFaturado?.map((faturadoRecebido) => {
                        return {
                          fData: faturadoRecebido.fData,
                          nFatutura: faturadoRecebido.nFatutura,
                          qtt: faturadoRecebido.qtt,
                          pesoBruto: faturadoRecebido.pesoBruto,
                          pesoLiquido: faturadoRecebido.pesoLiquido,
                        };
                      }) || []
                    );
                  }) || [];

                const totais: BmTotais =
                  faturado === undefined
                    ? {
                        totalQtt: 0,
                        totalPesoBruto: 0,
                        totalPesoLiquido: 0,
                      }
                    : faturado.reduce(
                        (acc, curr) => {
                          return {
                            totalQtt: acc.totalQtt + curr.qtt,
                            totalPesoBruto: acc.totalPesoBruto + curr.pesoBruto,
                            totalPesoLiquido:
                              acc.totalPesoLiquido + curr.pesoLiquido,
                          };
                        },
                        {
                          totalQtt: 0,
                          totalPesoBruto: 0,
                          totalPesoLiquido: 0,
                        },
                      );

                const dadosParaConsumos: BmDadosParaConsumo =
                  bm.BmMalhas?.map((malha) => {
                    return {
                      malha: malha.malha,
                      qttUsada:
                        malha.qtdeEntrada - malha.sobras - malha.defeitosStock,
                    };
                  }) || [];

                const malhaTotalUsada =
                  dadosParaConsumos?.reduce((total, item) => {
                    return total + item.qttUsada;
                  }, 0) ?? 0;
                return (
                  <Card
                    key={bm.idBm}
                    className="w-full mt-1 pb-0 select-none  hover:text-sidebar-accent-foreground rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:bg-sidebar-accent hover:shadow-md"
                  >
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 ">
                        {/* OP Section */}
                        <div className="lg:col-span-2 col-span-4 flex flex-col  items-center justify-center rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
                          <Op bmOp={bm.BmOp} />
                        </div>

                        {/* Composição Section */}
                        <div className="col-span-4 flex flex-col items-center justify-center rounded-xl border border-dashed p-3 space-y-1 text-sm ">
                          {bm.BmOp && bm.BmOp.length > 0 ? (
                            <Link
                              href={`/dashboard/qualidade/balancom/${bm.BmOp[0]?.op}/ccomposicao`}
                              className="text-center font-medium text-primary underline-offset-4 hover:underline"
                            >
                              {bm.composicao}
                            </Link>
                          ) : (
                            <span className="text-center text-muted-foreground">
                              {bm.composicao}
                            </span>
                          )}
                          <Separator className="my-1" />
                          <ComposicaoConsunos
                            totais={totais}
                            malhaTotalUsada={malhaTotalUsada}
                          />
                        </div>

                        {/* TC Section */}
                        <div className="lg:col-auto col-span-4 flex flex-col items-center justify-center rounded-xl border border-dashed p-3 text-sm space-y-1">
                          {bm.BmTc?.length === 0 ? (
                            <span className="text-muted-foreground">
                              Falta inserir Tc...
                            </span>
                          ) : (
                            <ul className="list-disc list-inside space-y-1 text-sm pb-1">
                              {bm.BmTc?.map((tc) => (
                                <li
                                  key={tc.nomeTc}
                                  className="font-medium text-left"
                                >
                                  {tc.nomeTc}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="p-1 flex flex-row items-center justify-center space-x-1">
                        <AbreOuFechaBm
                          dadosIniciais={dadosIniciais}
                          idBm={bm.idBm}
                          estadoInicial={bm.fechado}
                        />
                        {bm.fechado && (
                          <ImprimeEstandoFechado
                            op={bm.BmOp?.[0]?.op ?? 0}
                            idBm={bm.idBm}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          </div>
        </div>
      </main>
      {totalPages > 1 && (
        <footer className="w-full px-1 py-3">
          <Paginacao
            fechado={valorFechado}
            paginaActual={valorPageActual}
            totalPaginas={totalPages}
            envpp={intensPorPagina}
          />
        </footer>
      )}
    </>
  );
};

export default BmConteudo;
