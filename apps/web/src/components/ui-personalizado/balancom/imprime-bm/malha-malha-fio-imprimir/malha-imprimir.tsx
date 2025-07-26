import { BmMalhas } from "@repo/tipos/qualidade_balancom";
import React, { Fragment } from "react";
import z from "zod";

import MalhaFioImprir from "./malha-fio-imprimir";

import { formatNCasasDecimais } from "@/lib/my-utils";

type MalhaImprimirProps = {
  malhas: z.infer<typeof BmMalhas>;
  total: number;
};

const MalhaImprimir = ({ malhas, total }: MalhaImprimirProps) => {
  return (
    <table className="min-w-full border-collapse border border-gray-400 text-[9px]">
      <caption className="text-center font-semibold pb-1">Malhas:</caption>
      <thead className="bg-gray-200">
        <tr>
          <th className="border border-gray-400 px-1 whitespace-nowrap">
            Material
          </th>
          <th className="border border-gray-400 px-1 ">Fornecedor / Pedidos</th>
          <th className="border border-gray-400 px-1 ">Qtde Pedida</th>
          <th className="border border-gray-400 px-1 ">Qtde Entrada</th>
          <th className="border border-gray-400 px-1 ">Lote</th>
          <th className="border border-gray-400 px-1">Qtde Sobras</th>
          <th className="border border-gray-400 px-1 ">Qtde Defeitos</th>
          <th className="border border-gray-400 px-1 ">Qtde Usada</th>
        </tr>
      </thead>
      <tbody>
        {malhas?.map((malha) => {
          const dadosFornecedoresPedidos =
            malha.BmOpsPorMalha?.flatMap((movimentos) =>
              movimentos.BmMovimentosLotes?.map((lote) => ({
                idBm: lote.idBm,
                ref: lote.ref,
                unidade: lote.unidade,
                op: lote.op,
                idBmMovimentosLote: lote.idBmMovimentosLote,
                idMovimento: lote.idMovimento,
                nMovimento: lote.nMovimento,
                nome: lote.nome.trim(),
                idTipo: lote.idTipo,
                tipo: lote.tipo,
                qtt: lote.qtt,
                lote: lote.lote,
              }))
            ) || [];

          const qtdeTotalLinha =
            (malha.unidade === "Un"
              ? malha.qtdeEntrada * (malha.qtdeEntradaSeUnidade || 0)
              : malha.qtdeEntrada) -
            malha.sobras -
            malha.defeitosStock;

          type Result = {
            [key: string]: number[];
          };

          const result: Result = {};

          dadosFornecedoresPedidos.forEach((item) => {
            if (item && item.idTipo === 2) {
              const { nome, nMovimento } = item;
              if (!result[nome]) {
                result[nome] = [];
              }
              result[nome].push(nMovimento);
            }
          });

          if (malha.BmMalhasFio && malha.BmMalhasFio.length > 0)
            return (
              <Fragment key={malha.ref}>
                <tr>
                  <td
                    colSpan={8}
                    className="border border-gray-400 px-1 text-center  "
                  >
                    {malha.malha}
                  </td>
                </tr>
                <tr>
                  <td colSpan={8} className="p-1">
                    <MalhaFioImprir fio={malha.BmMalhasFio} />
                  </td>
                </tr>
              </Fragment>
            );
          return (
            <tr key={malha.ref}>
              <td className="border border-gray-400 px-1 text-center  ">
                {malha.malha}
              </td>
              <td className="border border-gray-400 px-1 text-center ">
                {
                  <div>
                    {Object.entries(result).map(([nome, nCompras]) => (
                      <div
                        className="flex flex-col items-center justify-center"
                        key={nome}
                      >
                        <span>{nome}</span>
                        <span>{nCompras.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                }
              </td>
              <td className="border border-gray-400 px-1 text-center ">
                {malha.unidade === "Un"
                  ? formatNCasasDecimais(
                      malha.qtdeEntradaSeUnidade ?? 0 * malha.qtdeEntrada,
                      3
                    )
                  : malha.qtdePedida.toString()}
              </td>
              <td className="border border-gray-400 px-1 text-center ">
                {malha.qtdeEntrada}
              </td>
              <td className="border border-gray-400 px-1 text-center ">
                {malha.lote}
              </td>
              <td className="border border-gray-400 px-1 text-center ">
                {malha.sobras}
              </td>
              <td className="border border-gray-400 px-1 text-center ">
                {malha.defeitosStock}
              </td>
              <td className="border border-gray-400 px-1 text-center ">
                {formatNCasasDecimais(qtdeTotalLinha, 3)}
              </td>
            </tr>
          );
        })}
        <tr>
          <td className="border border-gray-400 px-1 text-left " colSpan={7}>
            Total
          </td>
          <td className="border border-gray-400 px-1 text-center ">
            {formatNCasasDecimais(total, 4)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MalhaImprimir;
