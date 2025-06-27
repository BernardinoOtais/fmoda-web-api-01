"use client";

import { useRouter } from "next/navigation";
import React, { JSX } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NItensPorPaginaProps = {
  itensPorPagina: number;
  tamanhoLista: number;
};

const NItensPorPagina = ({
  itensPorPagina,
  tamanhoLista,
}: NItensPorPaginaProps) => {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("envpp", value);
    currentUrl.searchParams.set("page", "1");

    router.push(currentUrl.toString());
  };

  return (
    <div className="inline-flex flex-wrap items-center">
      <p className="mr-2 items-center">Itens por página:</p>
      <Select
        value={itensPorPagina.toString()}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>{renderOptions(tamanhoLista)}</SelectContent>
      </Select>
    </div>
  );
};

export default NItensPorPagina;

const renderOptions = (tamanhoLista: number) => {
  const items: JSX.Element[] = [];

  const max =
    tamanhoLista > 100 ? 100 : Math.max(10, Math.ceil(tamanhoLista / 10) * 10);

  for (let i = 10; i <= max; i += 10) {
    items.push(
      <SelectItem key={i} value={i.toString()}>
        {i}
      </SelectItem>
    );
  }

  return items;
};
