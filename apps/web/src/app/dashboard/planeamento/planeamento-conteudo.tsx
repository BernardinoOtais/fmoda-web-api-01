"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React from "react";

import { useTRPC } from "@/trpc/client";

const PlaneamentoConteudo = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.planeamento.getOpAbertas.queryOptions()
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default PlaneamentoConteudo;
