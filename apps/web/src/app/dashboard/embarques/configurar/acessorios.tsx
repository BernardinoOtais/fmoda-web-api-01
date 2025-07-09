"use client";
import { useSuspenseQuery } from "@repo/trpc";
import Link from "next/link";
import React from "react";

import SwitchItemInactivo from "./switch-item-inactivo";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type AcessoriosProps = { idRecebido: number | null };

const Acessorios = ({ idRecebido }: AcessoriosProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
  );
  return (
    <main className="relative grow">
      <div className="absolute top-0 bottom-0 flex w-full flex-col">
        <div className="flex w-full flex-col gap-1 overflow-auto">
          <Table className="">
            <TableCaption>Lista de itens traduzidos...</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-semibold">
                  Item PT
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Lingua
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Item Traduzido
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Inactivo
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.itemsSchema.map((d) => (
                <TableRow
                  key={d.idItem}
                  className={cn({
                    "border-border border bg-gray-400 dark:bg-gray-700":
                      idRecebido === d.idItem,
                  })}
                >
                  <TableCell>
                    {d._count.Conteudo === 0 ? (
                      <Button
                        variant="link"
                        className="h-0"
                        size="default"
                        asChild
                      >
                        <Link
                          className="bg-red-500"
                          href={`/dashboard/embarques/configurar?tipo=ac${
                            idRecebido === d.idItem
                              ? ""
                              : `&${new URLSearchParams({ idItem: d.idItem.toString() })}`
                          }`}
                        >
                          {d.Descricao}
                        </Link>
                      </Button>
                    ) : (
                      <span>{d.Descricao}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {d.ItemTraduzido.length > 0
                      ? d.ItemTraduzido[0]?.Idiomas?.nomeIdioma
                      : ""}
                  </TableCell>
                  <TableCell>
                    {d.ItemTraduzido.length > 0
                      ? d.ItemTraduzido[0]?.descItem
                      : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    <SwitchItemInactivo
                      inactivo={d.inativo}
                      idItem={d.idItem}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/*formAApresentar()*/}
        </div>
      </div>
    </main>
  );
};

export default Acessorios;
