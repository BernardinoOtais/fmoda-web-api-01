import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import { OPschema } from "@repo/tipos/qualidade_balancom";
import React, { Suspense } from "react";

import BmOpWraper from "./bm-op-wrapper";

import ImprimeEstandoFechado from "@/components/ui-personalizado/balancom/imprime-estando-fechado";
import { caller } from "@/trpc/server";

type BalancoDeMassaOpProps = {
  params: Promise<{ op: string }>;
};

const BalancoMacasOp = ({ params }: BalancoDeMassaOpProps) => {
  return (
    <Suspense>
      <BalancoMacasOpWrapper params={params} />
    </Suspense>
  );
};

export default BalancoMacasOp;

const BalancoMacasOpWrapper = async ({ params }: BalancoDeMassaOpProps) => {
  await authorizePapelOrRedirect(PAPEL_ROTA_QUALIDADE);
  const op = await params;
  const opRecebida = OPschema.safeParse(op);
  if (!opRecebida.success) {
    return <div>Não tem Op...</div>;
  }

  const bm = await caller.qualidade_balancom_op.getBmViaOp({
    op: opRecebida.data.op,
  });

  if (!bm) return <div>Erro...</div>;

  if (bm.fechado) {
    return (
      <ImprimeEstandoFechado
        mostraBotao={false}
        op={opRecebida.data.op}
        idBm={bm.idBm}
      />
    );
  }

  return <BmOpWraper bm={bm} op={opRecebida.data.op} />;
};
