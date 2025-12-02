import { FaturacaoWebDto } from "@repo/tipos/joana/faturas";
import React from "react";

import ColunasFaturacao from "./_tabela/colunas";
import DataTable from "./_tabela/data-table";

type FaturacaoWebPros = { faturacaoWeb: FaturacaoWebDto; totalGeral: number };
const FaturacaoWeb = ({ faturacaoWeb, totalGeral }: FaturacaoWebPros) => {
  const colunas = ColunasFaturacao;
  return (
    <DataTable
      columns={colunas()}
      data={faturacaoWeb}
      groupedColumns={["obrano"]}
      totalSum={totalGeral}
    />
  );
};

export default FaturacaoWeb;
