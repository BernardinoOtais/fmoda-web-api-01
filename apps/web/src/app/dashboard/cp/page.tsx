import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_CP } from "@repo/tipos/consts";
import Link from "next/link";
import React, { Suspense } from "react";

import PlaneamentoFornecedorReport from "./planeamento-fornecedor-report";
import PlaneamentoGeralReport from "./planeamento-geral-report";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
const dados = [
  {
    chave: "plan",
    nome: "Planification Générale",
    desc: "Planification Générale...",
  },
  {
    chave: "planfor",
    nome: "Planification Par Fournisseur",
    desc: "Planification Par Fournisseur...",
  },
];

const CpReports = async ({ searchParams }: PageProps) => (
  <Suspense>
    <CpReportsLoader searchParams={searchParams} />
  </Suspense>
);

export default CpReports;

const CpReportsLoader = async ({ searchParams }: PageProps) => {
  await authorizePapelOrRedirect(PAPEL_CP);

  const { tab } = await searchParams;
  const tabParam = Array.isArray(tab) ? tab[0] : tab || "plan";
  const tabRecebida = dados.some((dado) => dado.chave === tabParam)
    ? tabParam
    : "plan";

  const renderContent = (tab: string) => {
    switch (tab) {
      case "plan":
        return <PlaneamentoGeralReport />;
      case "planfor":
        return <PlaneamentoFornecedorReport />;
      default:
        return <div>⚠ Selecione uma opção válida.</div>;
    }
  };

  return (
    <Tabs value={tabRecebida} className="w-full h-full flex flex-col">
      <TabsList className="w-full flex-shrink-0">
        {dados.map((dado) => (
          <TabsTrigger key={dado.chave} value={dado.chave} asChild>
            <Link href={`?tab=${dado.chave}`}>{dado.nome}</Link>
          </TabsTrigger>
        ))}
      </TabsList>

      <main className="flex-1 overflow-auto">
        {/* REMOVED: bg-amber-200 */}
        {dados.map((dado) => (
          <TabsContent key={dado.chave} value={dado.chave} className="h-full">
            {renderContent(dado.chave)}
          </TabsContent>
        ))}
      </main>
    </Tabs>
  );
};
