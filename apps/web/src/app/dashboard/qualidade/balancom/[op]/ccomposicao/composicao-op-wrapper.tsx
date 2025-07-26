"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React, { Fragment } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ComposicaoResultante from "@/components/ui-personalizado/balanco-op-composicao/composicao-resulltante";
import MutateComposicaoFio from "@/components/ui-personalizado/balanco-op-composicao/mutate-composicao-fio";
import MutateComposicaoMalha from "@/components/ui-personalizado/balanco-op-composicao/mutate-coposicao-malha";
import ImprimeEstandoFechado from "@/components/ui-personalizado/balancom/imprime-estando-fechado";
import { formatNCasasDecimais } from "@/lib/my-utils";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type ComposicaoOpWrapperProps = {
  op: number;
};
type DataItem = {
  composicao: string;
  idComposicao: number;
  composicaoAbreviatura: string;
  ordem: number;
  qtt: number;
};

type Accumulator = {
  [key: string]: DataItem;
};

const ComposicaoOpWrapper = ({ op }: ComposicaoOpWrapperProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.qualidade_balancom_op_composicao.getBmDadosParaCalculoComposicao.queryOptions(
      { op }
    )
  );
  if (!data) return <div>erro...</div>;

  if (data.fechado) {
    return (
      <ImprimeEstandoFechado mostraBotao={false} op={op} idBm={data.idBm} />
    );
  }

  const composicaoOriginal = data.composicao;
  const idBm = data.idBm;

  const qttTotal =
    data.BmMalhas?.reduce((valor, valorActual) => {
      return (
        valor +
        (valorActual.fio && valorActual.fio.length > 0
          ? valorActual.fio.reduce((total, fio) => {
              return total + fio.qtdeEntrada - fio.defeitosStock - fio.sobras;
            }, 0)
          : (valorActual.unidade === "Un"
              ? (valorActual.qtdeEntradaSeUnidade || 0) *
                valorActual.qtdeEntrada
              : valorActual.qtdeEntrada) -
            valorActual.defeitosStock -
            valorActual.sobras)
      );
    }, 0) || 0;

  const somatorioComposicoes = data.BmMalhas?.flatMap((malha) => {
    const valor =
      ((malha.unidade === "Un"
        ? (malha.qtdeEntradaSeUnidade || 0) * malha.qtdeEntrada
        : malha.qtdeEntrada) -
        malha.defeitosStock -
        malha.sobras) /
      qttTotal;

    const malhaF = malha.composicao.map((comp) => {
      return { ...comp, qtt: comp.qtt * valor };
    });

    const fios = malha.fio.flatMap((fioF) => {
      const valorF =
        (fioF.qtdeEntrada - fioF.defeitosStock - fioF.sobras) / qttTotal;

      return fioF.composicao.map((compF) => {
        return { ...compF, qtt: compF.qtt * valorF };
      });
    });

    return [...malhaF, ...fios];
  });

  if (!somatorioComposicoes) return <div>error ....</div>;

  const groupedSums: Accumulator = somatorioComposicoes.reduce<Accumulator>(
    (acc, item) => {
      const key = `${item.composicao}-${item.idComposicao}-${item.composicaoAbreviatura}-${item.ordem}`;

      if (!acc[key]) {
        acc[key] = {
          composicao: item.composicao,
          idComposicao: item.idComposicao,
          composicaoAbreviatura: item.composicaoAbreviatura,
          ordem: item.ordem,
          qtt: 0,
        };
      }
      acc[key].qtt += item.qtt;
      return acc;
    },
    {}
  );
  const resultArray: DataItem[] = Object.values(groupedSums);

  const totalPercentagemMesmo = (
    dados: {
      composicao: string;
      qtt: number;
      idComposicao: number;
      composicaoAbreviatura: string;
      ordem: number;
    }[],
    qttMalha: number
  ) => {
    return (
      dados.reduce((soma, valor) => {
        return soma + (qttMalha / qttTotal) * valor.qtt;
      }, 0) || 0
    );
  };

  const percentagemTotal = resultArray.reduce((ac, item) => {
    return ac + item.qtt;
  }, 0);

  return (
    <main className="relative grow ">
      <div className="absolute top-0 bottom-0 flex flex-col w-full space-y-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
          {`Op: ${op}`}
        </h3>
        <h4 className="scroll-m-20  font-semibold tracking-tight text-center mb-2">
          Composição inserida
        </h4>
        <Table className="max-w-4xl mx-auto">
          <TableHeader className="bg-accent">
            <TableRow className="!border-0 border-none">
              <TableHead className="border text-center">MATERIAL</TableHead>
              <TableHead className="border text-center">QTDE ENTRADA</TableHead>
              <TableHead className="border text-center">%</TableHead>
              {data.BmMateriaisComposicao?.map((comp) => {
                return (
                  <TableHead
                    key={comp.composicao}
                    className="border text-center"
                  >
                    {comp.composicao}
                  </TableHead>
                );
              })}
              <TableHead className="border text-center">SOMATÓRIO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {data.BmMalhas?.map((malha) => {
              if (malha.fio && malha.fio.length > 0) {
                return (
                  <Fragment key={malha.ref}>
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        className="border text-center font-semibold"
                      >
                        {malha.subGrupoDescricao}
                      </TableCell>
                    </TableRow>

                    {malha.fio.map((fio) => {
                      const totalFio = totalPercentagem(fio.composicao) !== 100;
                      const totalLinhaFio =
                        fio.qtdeEntrada - fio.sobras - fio.defeitosStock;
                      return (
                        <TableRow key={fio.refOriginal}>
                          <TableCell className="border text-center">
                            {fio.grupoDescricao + fio.subGrupoDescricao}
                          </TableCell>
                          <TableCell>{totalLinhaFio}</TableCell>
                          <TableCell className="border text-center">
                            {qttTotal === 0
                              ? ""
                              : formatNCasasDecimais(
                                  (totalLinhaFio / qttTotal) * 100,
                                  2
                                ) + "%"}
                          </TableCell>
                          {fio.composicao.map((compoF) => {
                            return (
                              <TableCell
                                key={compoF.idComposicao}
                                className="px-1 "
                              >
                                <MutateComposicaoFio
                                  idBm={data.idBm}
                                  op={op}
                                  referencia={fio.ref}
                                  refOriginal={fio.refOriginal}
                                  idComposicao={compoF.idComposicao}
                                  valorOriginal={compoF.qtt}
                                />
                              </TableCell>
                            );
                          })}

                          <TableCell
                            className={cn(
                              "border text-center ",
                              totalFio && "text-red-500"
                            )}
                          >
                            {totalPercentagem(fio.composicao)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                );
              }
              const totalPorLinha =
                (malha.unidade === "Un"
                  ? (malha.qtdeEntradaSeUnidade || 0) * malha.qtdeEntrada
                  : malha.qtdeEntrada) -
                malha.sobras -
                malha.defeitosStock;
              const totalP = totalPercentagem(malha.composicao).toString();
              return (
                <Fragment key={malha.ref}>
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="border text-center font-semibold"
                    >
                      {malha.subGrupoDescricao}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border text-center">
                      {malha.subGrupoDescricao}
                    </TableCell>
                    <TableCell className="border text-center">
                      {totalPorLinha}
                    </TableCell>
                    <TableCell className="border text-center">
                      {qttTotal === 0
                        ? ""
                        : formatNCasasDecimais(
                            (totalPorLinha / qttTotal) * 100,
                            2
                          ) + "%"}
                    </TableCell>
                    {malha.composicao.map((compo) => {
                      return (
                        <TableCell
                          key={compo.idComposicao}
                          className="border text-center"
                        >
                          <MutateComposicaoMalha
                            op={op}
                            idBm={data.idBm}
                            ref={malha.ref}
                            idComposicao={compo.idComposicao}
                            valorOriginal={compo.qtt}
                          />
                        </TableCell>
                      );
                    })}
                    <TableCell
                      className={cn(
                        "border text-center ",
                        totalP != "100" && "text-red-500"
                      )}
                    >
                      {totalP}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>

        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
          Percentagens
        </h3>

        <Table className="max-w-4xl mx-auto">
          <TableHeader className="bg-accent">
            <TableRow className="!border-0 border-none">
              <TableHead className="border text-center">MATERIAL</TableHead>
              <TableHead className="border text-center">QTDE ENTRADA</TableHead>
              <TableHead className="border text-center">%</TableHead>
              {data.BmMateriaisComposicao?.map((comp) => {
                return (
                  <TableHead
                    key={comp.composicao}
                    className="border text-center"
                  >
                    {comp.composicao}
                  </TableHead>
                );
              })}
              <TableHead className="border text-center">SOMATÓRIO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {data.BmMalhas?.map((malha) => {
              if (malha.fio && malha.fio.length > 0) {
                return (
                  <Fragment key={malha.ref}>
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        className="border text-center font-semibold"
                      >
                        {malha.subGrupoDescricao}
                      </TableCell>
                    </TableRow>
                    {malha.fio.map((fio) => {
                      const totalLinhaFio =
                        fio.qtdeEntrada - fio.sobras - fio.defeitosStock;

                      return (
                        <TableRow key={fio.refOriginal}>
                          <TableCell className="border text-center">
                            {fio.grupoDescricao + fio.subGrupoDescricao}
                          </TableCell>
                          <TableCell className="border text-center">
                            {`${totalLinhaFio}`}
                          </TableCell>
                          <TableCell className="border text-center">
                            {qttTotal === 0
                              ? ""
                              : formatNCasasDecimais(
                                  (totalLinhaFio / qttTotal) * 100,
                                  2
                                ) + "%"}
                          </TableCell>
                          {fio.composicao.map((compoF) => {
                            return (
                              <TableCell
                                key={compoF.idComposicao}
                                className="border text-center"
                              >
                                {qttTotal === 0
                                  ? ""
                                  : formatNCasasDecimais(
                                      (totalLinhaFio / qttTotal) * compoF.qtt,
                                      2
                                    ) + "%"}
                              </TableCell>
                            );
                          })}
                          <TableCell className="border text-center">
                            {formatNCasasDecimais(
                              totalPercentagemMesmo(
                                fio.composicao,
                                totalLinhaFio
                              ),
                              2
                            ) + "%"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                );
              }
              const totalPorLinha =
                (malha.unidade === "Un"
                  ? (malha.qtdeEntradaSeUnidade || 0) * malha.qtdeEntrada
                  : malha.qtdeEntrada) -
                malha.sobras -
                malha.defeitosStock;

              return (
                <Fragment key={malha.ref}>
                  <TableRow>
                    <TableCell className="border text-center">
                      {malha.subGrupoDescricao}
                    </TableCell>
                    <TableCell className="border text-center">
                      {totalPorLinha}
                    </TableCell>
                    <TableCell className="border text-center">
                      {qttTotal === 0
                        ? ""
                        : formatNCasasDecimais(
                            (totalPorLinha / qttTotal) * 100,
                            2
                          ) + "%"}
                    </TableCell>
                    {malha.composicao.map((compo) => {
                      return (
                        <TableCell
                          key={compo.idComposicao}
                          className="border text-center"
                        >
                          {qttTotal === 0
                            ? ""
                            : formatNCasasDecimais(
                                (totalPorLinha / qttTotal) * compo.qtt,
                                2
                              ) + "%"}
                        </TableCell>
                      );
                    })}
                    <TableCell className={cn("border text-center ")}>
                      {formatNCasasDecimais(
                        totalPercentagemMesmo(malha.composicao, totalPorLinha),
                        2
                      ) + "%"}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow>
              <TableCell colSpan={3} className="border text-center">
                Total
              </TableCell>
              {resultArray?.map((comp, indice) => {
                return (
                  <TableCell key={indice} className="border text-center ">
                    {formatNCasasDecimais(comp.qtt, 2) + "%"}
                  </TableCell>
                );
              })}
              <TableCell
                className={cn(
                  "border text-center ",
                  formatNCasasDecimais(percentagemTotal, 2) !== "100,00" &&
                    "text-red-500"
                )}
              >
                {formatNCasasDecimais(percentagemTotal, 2) + "%"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
          Composição Original
        </h3>
        <p className="text-center">{composicaoOriginal}</p>

        <ComposicaoResultante dataItens={resultArray} idBm={idBm} op={op} />
      </div>
    </main>
  );
};

export default ComposicaoOpWrapper;

const totalPercentagem = (
  dados: {
    composicao: string;
    qtt: number;
    idComposicao: number;
    composicaoAbreviatura: string;
    ordem: number;
  }[]
) => {
  return (
    dados.reduce((soma, valor) => {
      return soma + valor.qtt;
    }, 0) || 0
  );
};
