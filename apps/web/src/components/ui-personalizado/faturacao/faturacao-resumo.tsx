"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React from "react";

import { formatMoneyPT } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type FaturacaoResumoProps = {
  dataIni: Date;
  dataFini: Date;
};
const FaturacaoResumo = ({ dataIni, dataFini }: FaturacaoResumoProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.joanaFaturacao.getFaturacao.queryOptions({
      dataIni,
      dataFini,
      op: null,
    })
  );
  return (
    <>
      <span className="text-center">
        {`Valor faturado de ${dataIni.toLocaleDateString("pt-PT")} a ${dataFini.toLocaleDateString("pt-PT")} = `}
        <span className="text-center font-semibold">
          {formatMoneyPT(data.totalGeral)}
        </span>
      </span>
    </>
  );
};

export default FaturacaoResumo;
