"use client";

import React, { useState } from "react";

import { EnvioDto } from "@repo/tipos/embarques";
import EnvioCard from "./envio-card";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";

type WrapperEnviosProps = {
  envios: EnvioDto[];
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
};
const WrapperEnvios = ({ envios, dadosIniciais }: WrapperEnviosProps) => {
  const [disabledBotao, setDisabledBotao] = useState(false);

  return envios.map((envio) => {
    return (
      <EnvioCard
        key={envio.idEnvio}
        envio={envio}
        disabledBotao={disabledBotao}
        setDisabledBotao={setDisabledBotao}
        dadosIniciais={dadosIniciais}
      />
    );
  });
};

export default WrapperEnvios;
