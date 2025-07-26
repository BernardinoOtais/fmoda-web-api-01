import {
  BmDadosParaConsumo,
  BmFaturado,
  BmTotais,
} from "@repo/tipos/qualidade_balancom";
import { useSuspenseQuery } from "@repo/trpc";
import React, { useRef } from "react";

import ComposicaoImprimir from "./composicao-imprimir/composicao-imprimir";
import ConsumoImprime from "./consumo-imprime/consumo-imprime";
import FaturadoImprimir from "./faturado-imprimir/faturado-imprimir";
import MalhaImprimir from "./malha-malha-fio-imprimir/malha-imprimir";
import TcssImprimir from "./tcss-imprimir/tcs-imprimir";
import TituloImprimir from "./titulo-imprimir/titulo-imprimir";
import TotalImprime from "./total-imprime/total-imprime";

import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type DadosParaImprimirProps = {
  idBm: string;
  contentRef?: React.Ref<HTMLDivElement>;
};
const DadosParaImprimir = ({ idBm, contentRef }: DadosParaImprimirProps) => {
  const trpc = useTRPC();

  const { data, isLoading, isError } = useSuspenseQuery(
    trpc.qualidade_balancom_op.getBmDataViaId.queryOptions(idBm)
  );
  const {
    data: dataTc,
    isLoading: isLoadingTc,
    isError: isErrorTc,
  } = useSuspenseQuery(trpc.qualidade_balancom_op.getTcsss.queryOptions(idBm));

  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions(containerRef);

  if (isLoading || isLoadingTc) return <div>Loading...</div>;
  if (!data || isError || !dataTc || isErrorTc) return <div>Erro...</div>;

  const bmOp = data.BmOp;

  const nOps = bmOp?.length;

  const opString = bmOp?.map((op) => op.op.toString()).join(", ") ?? "";

  const malhas = data?.BmMalhas;

  const tamanhoTcss = dataTc.length;

  const consumos: BmDadosParaConsumo =
    malhas?.map((malha) => {
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

  const totalMalha =
    malhas?.reduce((total, item) => {
      return (
        total +
        (item.BmMalhasFio && item.BmMalhasFio?.length > 0
          ? item.BmMalhasFio.reduce((totalF, itemF) => {
              return (
                totalF + itemF.qtdeEntrada - itemF.sobras - itemF.defeitosStock
              );
            }, 0)
          : (item.unidade === "Un"
              ? (item.qtdeEntradaSeUnidade || 0) * item.qtdeEntrada
              : item.qtdeEntrada) -
            item.sobras -
            item.defeitosStock)
      );
    }, 0) ?? 0;

  const faturado: BmFaturado =
    bmOp?.flatMap((movimentos) => {
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
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full overflow-y-auto bg-white text-black shadow-lg"
      )}
      ref={containerRef}
    >
      <div
        className={cn("", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <div className="space-y-1">
          {tamanhoTcss < 4 ? (
            <div className="relative w-full">
              <div className="absolute top-1 right-5">
                <TcssImprimir dataTc={dataTc} />
              </div>
              <div className="space-y-1">
                <TituloImprimir nOps={nOps} opString={opString} />
                <ComposicaoImprimir composicao={data.Composicao.composicao} />
              </div>
            </div>
          ) : (
            <>
              <TituloImprimir nOps={nOps} opString={opString} />
              <ComposicaoImprimir composicao={data.Composicao.composicao} />
              <TcssImprimir dataTc={dataTc} />
            </>
          )}
          <MalhaImprimir malhas={malhas} total={totalMalha} />
          <FaturadoImprimir bmOp={bmOp} />
          <ConsumoImprime
            consumos={consumos}
            faturado={faturado}
            totais={totais}
          />
          <TotalImprime totais={totais} malhaTotalUsada={malhaTotalUsada} />
        </div>
      </div>
    </div>
  );
};

export default DadosParaImprimir;
