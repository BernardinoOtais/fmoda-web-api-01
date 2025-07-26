import { BmTotais } from "@repo/tipos/qualidade_balancom";
import React from "react";

import { formatNCasasDecimais } from "@/lib/my-utils";

type TotalImprimeProps = { totais: BmTotais; malhaTotalUsada: number };
const TotalImprime = ({ totais, malhaTotalUsada }: TotalImprimeProps) => {
  return (
    <table className="min-w-full border-collapse border border-gray-400 text-[9px]">
      <caption className="pb-1 text-center font-semibold">Totais:</caption>
      <thead className="bg-gray-200">
        <tr>
          <th className="border border-gray-400 px-1 ">Qtde T. peças</th>
          <th className="border border-gray-400 px-1 ">Peso bruto</th>
          <th className="border border-gray-400 px-1 ">Peso liquido</th>
          <th className="border border-gray-400 px-1 ">Malha comprada</th>
          <th className="border border-gray-400 px-1">Perdas totais</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-400 px-1 text-center">
            {totais.totalQtt}
          </td>
          <td className="border border-gray-400 px-1 text-center">
            {totais.totalPesoBruto}
          </td>
          <td className="border border-gray-400 px-1 text-center">
            {totais.totalPesoLiquido}
          </td>
          <td className="border border-gray-400 px-1 text-center">
            {formatNCasasDecimais(malhaTotalUsada, 4)}
          </td>
          <td className="border border-gray-400 px-1 text-center">
            {malhaTotalUsada === 0
              ? ""
              : formatNCasasDecimais(
                  ((totais.totalPesoLiquido - malhaTotalUsada) /
                    malhaTotalUsada) *
                    100,
                  3
                ) + "%"}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TotalImprime;
