"use client";

import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { EnvioDto } from "@repo/tipos/embarques";
import React, { useState } from "react";

import EnvioCard from "./envio-card";

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
