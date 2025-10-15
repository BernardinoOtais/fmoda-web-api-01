import { useQuery } from "@repo/trpc";
import React, { useMemo } from "react";

import { colunasNovoPlaneamento } from "./colunas";
import { DataTable } from "./data-table";
import {
  OpState,
  usePlaneamentoContext,
} from "../contex-provider-novo-planeamento";

import { useTRPC } from "@/trpc/client";

const DataTableWrapper = () => {
  const { posting, idDestino, setIdDestino, state } = usePlaneamentoContext();

  const estado = state["op"];

  if (!estado) return null;

  return (
    <Tabela
      estado={estado}
      posting={posting}
      idDestino={idDestino}
      setIdDestino={setIdDestino}
    />
  );
};

export default DataTableWrapper;

type TabelaProps = {
  estado: OpState;
  posting: boolean;
  idDestino: string;
  setIdDestino: React.Dispatch<React.SetStateAction<string>>;
};

const Tabela = ({ estado, posting, idDestino, setIdDestino }: TabelaProps) => {
  const trpc = useTRPC();
  const colunas = useMemo(
    () => colunasNovoPlaneamento(estado.maisQueUmaOP, posting),
    [estado.maisQueUmaOP, posting]
  );

  const { data, isLoading, isError } = useQuery({
    ...trpc.planeamento.getOpsEClientes.queryOptions(),
  });

  return isLoading ? (
    <div>loading...</div>
  ) : !isError && data ? (
    <DataTable
      columns={colunas}
      data={data.ops}
      rowSelection={estado.rowSelection}
      setRowSelection={estado.setRowSelection}
      maisQueUmaOP={estado.maisQueUmaOP}
      setMaisQueUmaOp={estado.setMaisQueUmaOp}
      fornecedores={data.fornecedores}
      value={idDestino}
      setValue={setIdDestino}
      posting={posting}
      setOpsForSchema={estado.setOpsForSchema}
    />
  ) : (
    <div>erro...</div>
  );
};
