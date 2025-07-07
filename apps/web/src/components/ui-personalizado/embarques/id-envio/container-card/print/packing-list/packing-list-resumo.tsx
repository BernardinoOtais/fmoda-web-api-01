import React from "react";

type PackingListResumoProps = {
  dadosResumo: {
    idItem: number;
    descricao: string;
    qtt: number;
    peso: number;
  }[];
};
const PackingListResumo = ({ dadosResumo }: PackingListResumoProps) => {
  return (
    <table className="mx-auto border-collapse border border-gray-200 text-[9px]">
      <caption className="p-2 text-center">Résumé:</caption>
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Description
          </th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Quantité
          </th>
          <th className="border border-gray-200 px-1 whitespace-nowrap">
            Poids Kg
          </th>
        </tr>
      </thead>
      <tbody>
        {dadosResumo.map(item => (
          <tr key={item.idItem}>
            <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
              {item.descricao}
            </td>
            <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
              {item.qtt}
            </td>
            <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
              {item.peso}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PackingListResumo;
