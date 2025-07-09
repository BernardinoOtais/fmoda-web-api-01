import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { Rows4, Tags } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";

import AcessoriosWrapper from "./acessorio-wrapper";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export const metadata: Metadata = {
  title: "Embarques",
};

const ConfiguracaoEmbarques = ({ searchParams }: PageProps) => {
  return (
    <Suspense>
      <ConfigurarWrapper searchParams={searchParams} />
    </Suspense>
  );
};

export default ConfiguracaoEmbarques;

const ConfigurarWrapper = async ({ searchParams }: PageProps) => {
  await authorizePapelOrRedirect("Embarques");
  const { tipo, idItem } = await searchParams;

  const idRecebido =
    typeof idItem === "string" && !isNaN(parseInt(idItem, 10))
      ? parseInt(idItem, 10)
      : null;

  if (tipo === "ac") {
    return <AcessoriosWrapper idRecebido={idRecebido} />;
  }
  if (tipo === "ma") {
    return <div>Ma</div>;
  }

  return (
    <main className="relative grow">
      <div className="absolute top-0 bottom-0 flex w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="m-1 mx-auto">
              Insere Itens
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-1 mx-auto w-56">
            <DropdownMenuLabel>Dados a Inserir...</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/embarques/configurar?tipo=ma">
                  <Rows4 className="mr-2" />
                  <span>Insere Malha</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/embarques/configurar?tipo=ac">
                  <Tags className="mr-2" />
                  <span>Insere Itens</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="m-1 mx-auto">
          Preços Embarque
        </Button>
      </div>
    </main>
  );
};
