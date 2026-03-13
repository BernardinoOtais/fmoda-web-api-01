"use client";

import { useSuspenseQuery } from "@repo/trpc";
import React, { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/use-debounce";
import { formatMoneyPT } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

const ContasCorrentesConteudo = () => {
  const [fornecedor, setFornecedor] = useState("");
  const debouncedSearch = useDebounce(fornecedor, 500);
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.joanaContaCorrente.getContasCorrentes.queryOptions(),
  );
  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;

    return data?.filter((c) =>
      c.nome.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [data, debouncedSearch]);
  if (!data) return <div>erro..</div>;
  return (
    <>
      <header className="flex justify-center p-2">
        <Input
          placeholder="Pesquisar Fornecedor..."
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
          className="max-w-sm"
        />
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 ">
            {data && (
              <Table className="w-fit border border-border rounded-md border-collapse mx-auto my-0">
                <TableHeader className="bg-muted ">
                  <TableRow>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Nome
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Crédito
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Débito
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Saldo
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData?.map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="border border-border  h-2 px-1 py-0 text-left">
                        {c.nome}
                      </TableCell>
                      <TableCell className="border border-border  h-2 px-1 py-0 text-right font-semibold">
                        {formatMoneyPT(c.credito)}
                      </TableCell>
                      <TableCell className="border border-border  h-2 px-1 py-0 text-right font-semibold">
                        {formatMoneyPT(c.debito)}
                      </TableCell>
                      <TableCell className="border border-border  h-2 px-1 py-0 text-right font-semibold">
                        {formatMoneyPT(c.total || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ContasCorrentesConteudo;
