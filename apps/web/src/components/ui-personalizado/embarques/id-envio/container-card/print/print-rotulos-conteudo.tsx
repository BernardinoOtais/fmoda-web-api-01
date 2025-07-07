import {
  ContainerSchemaDto,
  ConteudoImprimirDto,
  ListaParaImprimrirDto,
} from "@repo/tipos/embarques_idenvio";
import Image from "next/image";
import React from "react";

type PrintRotulosConteudoProps = {
  container: ContainerSchemaDto;
  listaParaImprimrirDto?: ListaParaImprimrirDto;
};

const PrintRotulosConteudo = ({
  listaParaImprimrirDto,
}: PrintRotulosConteudoProps) => {
  if (!listaParaImprimrirDto) return <div>Erro...</div>;
  if (listaParaImprimrirDto.length === 0) return <div>Nada a imprimir...</div>;

  const dados = listaParaImprimrirDto[0];

  if (!dados) return <div>Erro...</div>;

  return (
    <>
      {dados.idTipoContainer === 3
        ? dados.subContainer?.map((c) =>
            c.subContainer?.map((cc) => (
              <div
                key={cc.idContainer}
                className="flex flex-col"
                style={{ pageBreakAfter: "always" }}
              >
                <RotuloCaixa
                  conteudo={cc.conteudo}
                  numero={cc.nContainer ?? 0}
                  totalVolumes={c.subContainer?.length}
                />
              </div>
            ))
          )
        : dados.subContainer?.map((c) => (
            <div
              key={c.idContainer}
              className="flex flex-col"
              style={{ pageBreakAfter: "always" }}
            >
              <RotuloCaixa
                conteudo={c.conteudo}
                numero={c.nContainer ?? 0}
                totalVolumes={dados.subContainer?.length}
              />
            </div>
          ))}
    </>
  );
};

export default PrintRotulosConteudo;

type RotuloCaixaProps = {
  conteudo: ConteudoImprimirDto[] | undefined;
  numero: number;
  totalVolumes: number | undefined;
};

const RotuloCaixa = ({ conteudo, totalVolumes, numero }: RotuloCaixaProps) => {
  if (!conteudo) return;

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-row">
        <Image
          src={"/assets/fmoda-print.svg"}
          alt="Logo"
          width={534} // Use the actual width of your image
          height={149} // Use the actual height of your image
          className="h-[35px] w-[126px] object-contain"
        />
        <p className="mx-auto my-auto text-2xl font-semibold">
          FMODA INÚSTRIA TÊXTIL S.A.
        </p>
      </div>

      <table className="min-w-full border-collapse border border-gray-200 text-[12px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-200 px-1 whitespace-nowrap">
              Commande
            </th>
            <th className="border border-gray-200 px-1 whitespace-nowrap">
              Reférence
            </th>
            <th className="border border-gray-200 px-1 whitespace-nowrap">
              Couleur
            </th>
            <th className="w-full border border-gray-200 px-1 text-[13px] whitespace-nowrap">
              Contenu
            </th>
            <th className="border border-gray-200 px-1 text-[13px] whitespace-nowrap">
              Quantité
            </th>
            <th className="border border-gray-200 px-1 whitespace-nowrap">
              Unités
            </th>
          </tr>
        </thead>
        <tbody>
          {conteudo?.map((con) => (
            <tr key={con.idConteudo}>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {con.op}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {con.op}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {con.cor}
              </td>
              <td className="border border-gray-200 px-1 text-start text-[13px] whitespace-nowrap">
                {con.Descricao}
              </td>
              <td className="border border-gray-200 px-1 text-center text-[13px] whitespace-nowrap">
                {con.qtt}
              </td>
              <td className="border border-gray-200 px-1 text-center whitespace-nowrap">
                {con.descUnidade}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-row">
        <p className="ml-auto">
          {`Volume ${numero}/${totalVolumes} ${`Pallet: ${numero}`}`}
        </p>
        <p> </p>
      </div>
    </div>
  );
};
