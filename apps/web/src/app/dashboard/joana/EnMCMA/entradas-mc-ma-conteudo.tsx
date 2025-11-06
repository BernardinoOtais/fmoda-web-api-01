"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React from "react";

import ColunasMalhaMaMc from "./_tabela/colunas";
import DataTable from "./_tabela/data-table";

import { useTRPC } from "@/trpc/client";

const EntradasMCMAConteudo = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.joanaEntradasMcMa.getEntradasMcMa.queryOptions()
  );

  const colunas = ColunasMalhaMaMc;

  return (
    <>
      <header className="x-1 space-y-1.5 border-b py-3 text-center">
        <span className="text-center">Malhas</span>
      </header>

      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto">
            <DataTable columns={colunas()} data={data} />
          </div>
        </div>
      </main>
    </>
  );
};

export default EntradasMCMAConteudo;
