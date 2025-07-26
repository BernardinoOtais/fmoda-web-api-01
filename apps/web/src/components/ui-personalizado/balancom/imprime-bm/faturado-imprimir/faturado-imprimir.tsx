import { BmOpDto } from "@repo/tipos/qualidade_balancom";
import React, { Fragment } from "react";

import FotoClient from "@/components/ui-personalizado/fotos/foto-client";

type FaturadoImprimirProps = {
  bmOp: BmOpDto;
};
const FaturadoImprimir = ({ bmOp }: FaturadoImprimirProps) => {
  const groupedByFoto = new Map<string, typeof bmOp>();

  bmOp?.forEach((item) => {
    if (!groupedByFoto.has(item.foto)) {
      groupedByFoto.set(item.foto, []);
    }
    groupedByFoto.get(item.foto)?.push(item);
  });
  return (
    <>
      <p className="text-center font-semibold text-[9px]">Faturado:</p>
      {Array.from(groupedByFoto.entries()).map(([foto, opsForFoto]) => (
        <Fragment key={foto}>
          <FotoClient
            src={foto}
            alt="Foto Modelo"
            cssImage="w-24 mx-auto m-2 mx-auto"
          />

          {opsForFoto?.map((op) => (
            <Fragment key={op.op}>
              <table className="min-w-full border-collapse border border-gray-400 text-[9px]">
                <caption className="text-center font-semibold ">{`op: ${op.op}`}</caption>
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-gray-400 px-1 ">Pedido</th>
                    <th className="border border-gray-400 px-1 ">Ref</th>
                    <th className="border border-gray-400 px-1 ">Fatura</th>
                    <th className="border border-gray-400 px-1 ">Data</th>
                    <th className="border border-gray-400 px-1 ">
                      Qtde Faturada
                    </th>
                    <th className="border border-gray-400 px-1">Peso Bruto</th>
                    <th className="border border-gray-400 px-1 ">
                      Peso Liquido
                    </th>
                    <th className="border border-gray-400 px-1 ">CMR</th>
                    <th className="border border-gray-400 px-1 ">OBS</th>
                  </tr>
                </thead>
                <tbody>
                  {op.BmOpFaturado?.map((faturado) => (
                    <tr key={faturado.nFatutura}>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.pedido}
                      </td>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.refModelo}
                      </td>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.nFatutura}
                      </td>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.dataFatura}
                      </td>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.qtt}
                      </td>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.pesoBruto}
                      </td>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.pesoLiquido}
                      </td>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.cmr}
                      </td>
                      <td className="border border-gray-400 px-1 text-center ">
                        {faturado.obs}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default FaturadoImprimir;
