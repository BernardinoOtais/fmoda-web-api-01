import {
  DestinoEnvioDto,
  ListaParaImprimrirDto,
} from "@repo/tipos/embarques_idenvio";
import React from "react";

import PackingListUmaPallet from "./packing-list/packing-list-uma-pallet";

type PrintPalletConteudoProps = {
  destino: DestinoEnvioDto;
  listaParaImprimrirDto?: ListaParaImprimrirDto;
};

const PrintPalletConteudo = ({
  destino,
  listaParaImprimrirDto,
}: PrintPalletConteudoProps) => {
  if (!listaParaImprimrirDto) return <div>Erro...</div>;
  if (listaParaImprimrirDto.length === 0) return <div>Nada a imprimir...</div>;

  const dados = listaParaImprimrirDto[0];

  if (!dados) return <div>Erro...</div>;

  return (
    <>
      {dados.idTipoContainer === 3 ? (
        dados.subContainer?.map((palete) => {
          return (
            <PackingListUmaPallet
              key={palete.idContainer}
              destino={destino}
              altura={palete.altura ?? 0}
              listaParaImprimrirDto={palete.subContainer}
              nContainer={palete.nContainer ?? 0}
            />
          );
        })
      ) : (
        <PackingListUmaPallet
          destino={destino}
          altura={dados.altura ?? 0}
          listaParaImprimrirDto={dados.subContainer}
          nContainer={dados.nContainer ?? 0}
        />
      )}
    </>
  );
};

export default PrintPalletConteudo;
