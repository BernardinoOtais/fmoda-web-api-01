import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_ROTA_EMBARQUES } from "@repo/tipos/consts";
import { Metadata } from "next";
import React, { Suspense } from "react";

import AcessoriosWrapper from "./acessorio-wrapper";

import Android from "@/components/ui-personalizado/embarques/configurar/android";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export const metadata: Metadata = {
  title: "Embarques",
};

const ConfiguracaoEmbarques = ({ searchParams }: PageProps) => {
  return (
    <Suspense>
      <ConfigurarWrapper searchParams={searchParams} />
    </Suspense>
  );
};

export default ConfiguracaoEmbarques;

const ConfigurarWrapper = async ({ searchParams }: PageProps) => {
  await authorizePapelOrRedirect(PAPEL_ROTA_EMBARQUES);
  const { tipo, idItem } = await searchParams;

  const idRecebido =
    typeof idItem === "string" && !isNaN(parseInt(idItem, 10))
      ? parseInt(idItem, 10)
      : null;

  if (tipo === "ac") {
    return <AcessoriosWrapper idRecebido={idRecebido} />;
  }
  if (tipo === "ma") {
    return <div>Ma</div>;
  }

  return <Android />;
};
