import { ListaParaImprimrirDto } from "@repo/tipos/embarques_idenvio";
import React from "react";

type PackingListConteudoProps = {
  containerAImprimir?: ListaParaImprimrirDto;
  numeroPai: number;
};
const PackingListConteudo = ({
  containerAImprimir,
  numeroPai,
}: PackingListConteudoProps) => {
  return (
    <table className="min-w-full border-collapse border border-gray-200 text-[9px]">
      <caption className="p-2 text-left">Packing List:</caption>
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            PALLET
          </th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">Ref</th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            couleur
          </th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Talle
          </th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Nº Commande
          </th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Nº Client
          </th>
          <th className="w-full border border-gray-200 px-1">Description</th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Quantité
          </th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Unités
          </th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Volume
          </th>
        </tr>
      </thead>
      <tbody>
        {containerAImprimir?.map((con) =>
          (con.conteudo ?? []).map((c) => (
            <tr key={c.idConteudo}>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {numeroPai}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {c.modelo}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {c.cor}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {c.tam == "nt" ? "" : c.tam}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {c.op}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {c.pedido}
              </td>
              <td className="w-full border border-gray-200 px-1">
                {c.Descricao}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {c.qtt}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {c.descUnidade}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {con.nContainer}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default PackingListConteudo;
