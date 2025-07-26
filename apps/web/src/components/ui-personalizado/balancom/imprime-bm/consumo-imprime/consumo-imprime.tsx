import {
  BmDadosParaConsumo,
  BmFaturado,
  BmTotais,
} from "@repo/tipos/qualidade_balancom";
import React from "react";

import { formatNCasasDecimais } from "@/lib/my-utils";

type ConsumoImprimeProps = {
  consumos: BmDadosParaConsumo;
  faturado: BmFaturado;
  totais: BmTotais;
};
const ConsumoImprime = ({
  consumos,
  faturado,
  totais,
}: ConsumoImprimeProps) => {
  return (
    <>
      <p className="text-center font-semibold text-[9px] min-w-full ">
        Consumos:
      </p>
      {consumos.map((con) => (
        <table
          className="min-w-full border-collapse border border-gray-400 text-[9px]"
          key={con.malha}
        >
          <caption className="text-center font-semibold  whitespace-nowrap">
            {con.malha}
          </caption>
          <thead className="bg-gray-200">
            <tr>
              {faturado.map((fa) => (
                <th className="border border-gray-400 px-1" key={fa.nFatutura}>
                  {`F.${fa.nFatutura}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {faturado.map((faa) => (
                <td
                  key={faa.nFatutura}
                  className="border border-gray-400 px-1 text-center w-20"
                >
                  {totais.totalQtt === 0
                    ? ""
                    : formatNCasasDecimais(
                        (con.qttUsada * faa.qtt) / totais.totalQtt,
                        3
                      )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ))}
    </>
  );
};

export default ConsumoImprime;
