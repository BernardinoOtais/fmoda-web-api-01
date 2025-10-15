"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React, { useMemo } from "react";

import { colunasPlaneamentos } from "./_planeamentos/colunas";
import { DataTablePlaneamnetos } from "./_planeamentos/data-table";

import { useTRPC } from "@/trpc/client";

const PlaneamentoConteudo = () => {
  const colunas = useMemo(() => colunasPlaneamentos(), []);

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.planeamento.getPlaneamentos.queryOptions(
      { enviado: false },
      {
        staleTime: Infinity,
      }
    )
  );

  return <DataTablePlaneamnetos columns={colunas} data={data} />;
};

export default PlaneamentoConteudo;
