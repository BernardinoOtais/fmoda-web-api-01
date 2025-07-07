import {
  DestinoEnvioDto,
  ListaParaImprimrirDto,
} from "@repo/tipos/embarques_idenvio";
import React from "react";

import PackingListConteudo from "./packing-list-conteudo";
import PackingListDestino from "./packing-list-destino";
import PackingListDizeres from "./packing-list-dizeres";
import PackingListPesoTotalVolume from "./packing-list-peso-total-volume";
import PackingListResumo from "./packing-list-resumo";

type PackingListUmaPalletProps = {
  destino: DestinoEnvioDto;
  altura: number;
  listaParaImprimrirDto?: ListaParaImprimrirDto;
  nContainer: number;
};

const tratarDadosDeUmaPalete = (container: ListaParaImprimrirDto) => {
  const containerAImprimir = container ?? [];
  const dados = containerAImprimir.flatMap((con) => con.conteudo ?? []);

  const groupedData = dados.reduce<
    Record<
      number,
      { idItem: number; descricao: string; qtt: number; peso: number }
    >
  >((acc, item) => {
    const descricao = item.Descricao;

    if (typeof item.idItem === "number") {
      if (!acc[item.idItem]) {
        acc[item.idItem] = { idItem: item.idItem, descricao, qtt: 0, peso: 0 };
      }
      const grupo = acc[item.idItem]!;
      grupo.qtt += item.qtt;
      grupo.peso += item.peso;
    }

    return acc;
  }, {});

  const dadosResumo = Object.values(groupedData);
  const pesoTotal = dadosResumo.reduce((acc, item) => acc + item.peso, 0);
  const numeroDeCaixas = containerAImprimir.filter(
    (c) => c.idTipoContainer === 5
  ).length;
  const pesoPallet = 10;
  const pesoDaPallet = pesoTotal + numeroDeCaixas + pesoPallet;

  return { dadosResumo, pesoDaPallet };
};

const PackingListUmaPallet = ({
  destino,
  altura,
  listaParaImprimrirDto,
  nContainer,
}: PackingListUmaPalletProps) => {
  if (!listaParaImprimrirDto) return <div>erro...</div>;
  if (listaParaImprimrirDto.length === 0) return <div>erro...</div>;

  const { dadosResumo, pesoDaPallet } = tratarDadosDeUmaPalete(
    listaParaImprimrirDto
  );

  return (
    <>
      <PackingListDestino destino={destino} />
      <PackingListConteudo
        containerAImprimir={listaParaImprimrirDto}
        numeroPai={nContainer}
      />
      <div
        style={{ breakInside: "avoid", display: "block" }}
        className="max-w-full"
      >
        <PackingListResumo dadosResumo={dadosResumo} />
        <PackingListPesoTotalVolume altura={altura} peso={pesoDaPallet} />
        <PackingListDizeres />
      </div>
    </>
  );
};

export default PackingListUmaPallet;
