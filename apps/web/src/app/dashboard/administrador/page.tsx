import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_ROTA_ADMINISTRADOR } from "@repo/tipos/consts";
import Link from "next/link";
import { Suspense } from "react";

import NovoUser from "./novo-user";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dados = [
  {
    chave: "criaConta",
    nome: "Cria Nova Conta",
    desc: "Aqui o administrador pode criar Utlizadores...",
  },
  {
    chave: "alteraPass",
    nome: "Altera Password User",
    desc: "Aqui o administrador pode alterar a password de um utilizador...",
  },
  {
    chave: "alteraTipoConta",
    nome: "Altera Tipo de Conta User",
    desc: "Aqui o administrador pode alterar o tipo da conta de um utilizador...",
  },
];

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Administrador = async ({ searchParams }: PageProps) => (
  <Suspense>
    <AdminidtradorLoader searchParams={searchParams} />
  </Suspense>
);

export default Administrador;

const AdminidtradorLoader = async ({ searchParams }: PageProps) => {
  await authorizePapelOrRedirect(PAPEL_ROTA_ADMINISTRADOR);

  const { tab } = await searchParams;
  const tabParam = Array.isArray(tab) ? tab[0] : tab || "criaConta";
  const tabRecebida = dados.some((dado) => dado.chave === tabParam)
    ? tabParam
    : "criaConta";

  const renderContent = (tab: string) => {
    switch (tab) {
      case "criaConta":
        return <NovoUser />;
      case "alteraPass":
        return <div>🔑 Formulário para alterar a senha de um usuário.</div>;
      case "alteraTipoConta":
        return <div>👤 Opções para alterar o tipo da conta do usuário.</div>;
      default:
        return <div>⚠ Selecione uma opção válida.</div>;
    }
  };

  return (
    <Tabs value={tabRecebida} className="m-2 mx-auto">
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
