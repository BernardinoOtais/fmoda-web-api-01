import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import Link from "next/link";
import { Suspense } from "react";

import ContaCorrentePorFornecedor from "./conta-corrente-por-fornecedor";
import ContasCorrentes from "./contas-correntes";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dados = [
  {
    chave: "contaCorrente",
    nome: "Conta Corrente",
    desc: "Aqui pode ver a conta Corrente de um fornecedor",
  },
  {
    chave: "contasCorrentes",
    nome: "Contas Correntes de Fornecedores",
    desc: "Aqui pode ver a conta Corrente de todos fornecedor",
  },
];

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ContaCorrente = ({ searchParams }: PageProps) => {
  return (
    <Suspense>
      <ContaCorrenteLoader searchParams={searchParams} />
    </Suspense>
  );
};

export default ContaCorrente;

const ContaCorrenteLoader = async ({ searchParams }: PageProps) => {
  await authorizePapelOrRedirect(PAPEL_JOANA);

  const { tab } = await searchParams;
  const tabParam = Array.isArray(tab) ? tab[0] : tab || "criaConta";
  const tabRecebida = dados.some((dado) => dado.chave === tabParam)
    ? tabParam
    : "contaCorrente";

  const renderContent = (tab: string) => {
    switch (tab) {
      case "contaCorrente":
        return <ContaCorrentePorFornecedor />;
      case "contasCorrentes":
        return <ContasCorrentes />;
      default:
        return <div>⚠ Selecione uma opção válida.</div>;
    }
  };

  return (
    <>
      <Tabs value={tabRecebida} className=" mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          {dados.map((dado) => (
            <TabsTrigger key={dado.chave} value={dado.chave} asChild>
              <Link href={`?tab=${dado.chave}`}>{dado.nome}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {renderContent(tabRecebida ?? "contaCorrente")}
    </>
  );
};
