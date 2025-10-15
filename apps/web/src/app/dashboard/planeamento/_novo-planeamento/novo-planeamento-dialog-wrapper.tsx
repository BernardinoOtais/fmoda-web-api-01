"use client";
import React from "react";

import ContextProviderNovoPlaneamento from "./contex-provider-novo-planeamento";
import NovoPlaneamentoDialog from "./novo-planeamento-dialog";

type NovoPlaneamentoDialogoWrapperProps = {
  novo?: string | string[] | undefined;

  tab: string | string[] | undefined;
};

const NovoPlaneamentoDialogoWrapper = ({
  novo,
  tab,
}: NovoPlaneamentoDialogoWrapperProps) => {
  return (
    <ContextProviderNovoPlaneamento tab={tab}>
      <NovoPlaneamentoDialog novo={novo} />
    </ContextProviderNovoPlaneamento>
  );
};

export default NovoPlaneamentoDialogoWrapper;
