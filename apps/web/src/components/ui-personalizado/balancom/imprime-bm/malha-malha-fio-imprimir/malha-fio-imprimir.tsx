import { BmMalhasFio } from "@repo/tipos/qualidade_balancom";
import React from "react";
import z from "zod";

import { fornecedoresPedidos } from "@/components/ui-personalizado/meus-components/fornecedores-pedidos";
import { formatNCasasDecimais } from "@/lib/my-utils";

type MalhaFioImprirProps = {
  fio: z.infer<typeof BmMalhasFio>;
};
const MalhaFioImprir = ({ fio }: MalhaFioImprirProps) => {
  const totalFio =
    fio?.reduce((total, item) => {
      return total + item.qtdeEntrada - item.sobras - item.defeitosStock;
    }, 0) || 0;
  return (
    <table className="min-w-full border-collapse border border-gray-400 text-[9px] ">
      <caption className="pb-1 text-center font-semibold">Fio:</caption>
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
        {fio?.map((fioR) => {
          const dadosFornecedoresPedidos =
            fioR.BmOpsPorMalhaFio?.flatMap((movimentos) =>
              movimentos.BmMalhasFioMovimentos?.map((lote) => ({
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
            fioR.qtdeEntrada - fioR.sobras - fioR.defeitosStock;
          return (
            <tr key={fioR.refOrigem}>
              <td className="border border-gray-400 px-1 text-center  ">
                {fioR.fio}
              </td>
              <td className="border border-gray-400 px-1 text-center  ">
                {fornecedoresPedidos(dadosFornecedoresPedidos)}
              </td>
              <td className="border border-gray-400 px-1 text-center  ">
                {fioR.qtdePedida}
              </td>
              <td className="border border-gray-400 px-1 text-center  ">
                {fioR.qtdeEntrada}
              </td>
              <td className="border border-gray-400 px-1 text-center  ">
                {fioR.lote}
              </td>
              <td className="border border-gray-400 px-1 text-center  ">
                {fioR.sobras}
              </td>
              <td className="border border-gray-400 px-1 text-center  ">
                {fioR.defeitosStock}
              </td>
              <td className="border border-gray-400 px-1 text-center  ">
                {formatNCasasDecimais(qtdeTotalLinha, 3)}
              </td>
            </tr>
          );
        })}
        {totalFio !== 0 && (
          <tr>
            <td className="border border-gray-400 px-1 text-left  " colSpan={7}>
              Total
            </td>
            <td className="border border-gray-400 px-1 text-center  ">
              {formatNCasasDecimais(totalFio, 4)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MalhaFioImprir;
