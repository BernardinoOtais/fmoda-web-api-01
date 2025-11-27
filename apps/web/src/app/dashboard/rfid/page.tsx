import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import Link from "next/link";
import React from "react";

import InsereCsv from "./_rfid-aux/insere-csv";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RfidProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
const Rfid = async ({ searchParams }: RfidProps) => {
  const dados = [
    {
      chave: "inserirRfid",
      nome: "Insiro Csv",
      desc: "Aqui pode fazer o upload do ficheiro csv...",
    },
    {
      chave: "porOp",
      nome: "Dados por Op",
      desc: "Listo quantidades enviadas por Op...",
    },
    {
      chave: "porPedido",
      nome: "Dados por Pedido",
      desc: "Listo quantidades enviadas por Pedido...",
    },
  ];

  const { tab } = await searchParams;
  const tabParam = Array.isArray(tab) ? tab[0] : tab || "inserirRfid";
  const tabRecebida = dados.some((dado) => dado.chave === tabParam)
    ? tabParam
    : "inserirRfid";

  await authorizePapelOrRedirect("Qualidade");

  const renderContent = (tab: string) => {
    switch (tab) {
      case "inserirRfid":
        return <InsereCsv />;
      case "porOp":
        return <div>🔑 Formulário para alterar a senha de um usuário.</div>;
      case "porPedido":
        return <div>👤 Opções para alterar o tipo da conta do usuário.</div>;
      default:
        return <div>⚠ Selecione uma opção válida.</div>;
    }
  };

  return (
    <Tabs value={tabRecebida} className="m-2 mx-auto w-[500px]">
      <TabsList className="grid w-full grid-cols-3">
        {dados.map((dado) => (
          <TabsTrigger key={dado.chave} value={dado.chave} asChild>
            <Link href={`?tab=${dado.chave}`}>{dado.nome}</Link>
          </TabsTrigger>
        ))}
      </TabsList>

      {dados.map((dado) => (
        <TabsContent key={dado.chave} value={dado.chave}>
          <Card>
            <CardHeader>
              <CardTitle>{dado.nome}</CardTitle>
              <CardDescription>{dado.desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderContent(dado.chave)}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Rfid;
