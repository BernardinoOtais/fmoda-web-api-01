import { useQuery } from "@repo/trpc";
import React from "react";

import InserConteudoCliente from "./insere-conteudo-cliente";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";

type WrapperInsereConteudoProps = {
  idEnvio: number;
  idConteudo?: number;
  idContainer: number;
};
const WrapperInsereConteudo = ({
  idEnvio,
  idConteudo,
  idContainer,
}: WrapperInsereConteudoProps) => {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useQuery(
    trpc.getUnidadesEItensEOps.queryOptions({ id: idContainer })
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>erro...</p>;

  const ops = data?.ops ?? [];
  const unidades = data?.unidades ?? [];
  const itens = data?.itens ?? [];
  const dadoOps = data?.containerOp ?? [];

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {idConteudo ? "Altera conteudo" : "Novo conteudo"}
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <InserConteudoCliente
          idEnvio={idEnvio}
          idConteudo={idConteudo}
          idContainer={idContainer}
          ops={ops}
          unidades={unidades}
          itens={itens}
          dadoOps={dadoOps}
        />
      </CardContent>
    </Card>
  );
};
export default WrapperInsereConteudo;

//<InsereConteudoCliente idContainer={idContainer} />
