"use client";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import {
  BmDadosParaConsumo,
  BmFaturado,
  BmTotais,
} from "@repo/tipos/qualidade_balancom";
import { useQueryClient, useSuspenseQuery } from "@repo/trpc";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import Consumos from "./consumos";
import Faturado from "./faturado";
import Malha from "./malha";
import OpsCompatives from "./ops-compativesi";
import ResetBm from "./reset-bm";
import Totais from "./totais";
import VerificoNovasFaturas from "./verifico-novas-faturas";

import { useTRPC } from "@/trpc/client";

type CorpoProps = { idBm: string; op: number };
const Corpo = ({ idBm, op }: CorpoProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
  );

  useEffect(() => {
    if (data.BmOp?.length === 0) {
      queryClient
        .getQueryCache()
        .findAll()
        .forEach((query) => {
          const queryKey = query.queryKey;
          if (
            Array.isArray(queryKey) &&
            Array.isArray(queryKey[0]) &&
            queryKey[0][1] === "getBms" &&
            typeof queryKey[1] === "object" &&
            queryKey[1] !== null &&
            "input" in queryKey[1]
          ) {
            const input = queryKey[1]
              .input as DadosParaPesquisaComPaginacaoEOrdemDto;
            queryClient.resetQueries(
              trpc.qualidadeBalancoM.getBms.queryOptions(input)
            );
          }
        });
      router.push("/dashboard/qualidade/balancom");
    }
  }, [data.BmOp?.length, queryClient, router, trpc.qualidadeBalancoM.getBms]);

  const consumos: BmDadosParaConsumo =
    data?.BmMalhas?.map((malha) => {
      return {
        malha: malha.malha,
        qttUsada:
          malha.BmMalhasFio && malha.BmMalhasFio?.length > 0
            ? malha.BmMalhasFio.reduce((totalF, itemF) => {
                return (
                  totalF +
                  itemF.qtdeEntrada -
                  itemF.sobras -
                  itemF.defeitosStock
                );
              }, 0)
            : malha.unidade === "Un"
              ? malha.qtdeEntrada * (malha.qtdeEntradaSeUnidade || 0) -
                malha.sobras -
                malha.defeitosStock
              : malha.qtdeEntrada - malha.sobras - malha.defeitosStock,
      };
    }) || [];

  const malhaTotalUsada =
    consumos?.reduce((total, item) => {
      return total + item.qttUsada;
    }, 0) ?? 0;

  const faturado: BmFaturado =
    data?.BmOp?.flatMap((movimentos) => {
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
              totalPesoLiquido: acc.totalPesoLiquido + curr.pesoLiquido,
            };
          },
          {
            totalQtt: 0,
            totalPesoBruto: 0,
            totalPesoLiquido: 0,
          }
        );

  return (
    <main className="relative grow ">
      <div className="absolute top-0 bottom-0 flex flex-col w-full space-y-2">
        <Malha idBm={idBm} op={op} />
        <Faturado idBm={idBm} />
        <OpsCompatives idBm={idBm} />
        <Consumos consumos={consumos} faturado={faturado} totais={totais} />
        <VerificoNovasFaturas idBm={idBm} op={op.toString()} />
        <Totais totais={totais} malhaTotalUsada={malhaTotalUsada} />
        <ResetBm idBm={idBm} op={op.toString()} />
      </div>
    </main>
  );
};

export default Corpo;
