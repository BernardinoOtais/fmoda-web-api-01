"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FornecedorNoDto,
  FornecedorNoSchema,
} from "@repo/tipos/joana/naoregularizada";
import { useQuery, skipToken } from "@repo/trpc";
import { useSuspenseQuery } from "@repo/trpc";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AutoCompleteFormFieldString } from "@/components/ui-personalizado/meus-components/AutoCompleteFormFieldString";
import { formatMoneyPT } from "@/lib/my-utils";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const NaoRegularizadoConteudo = () => {
  const [fornecedor, setFornecedor] = useState<string | null>(null);
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.joanaNaoRegularizado.getFonecedores.queryOptions(),
  );
  const { data: naoRegularizado } = useQuery(
    trpc.joanaNaoRegularizado.getNaoRegularizado.queryOptions(
      fornecedor ?? skipToken,
    ),
  );
  const form = useForm<FornecedorNoDto>({
    resolver: zodResolver(FornecedorNoSchema),
    defaultValues: {
      value: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;
  const onSubmit = async (data: FornecedorNoDto) => {
    setFornecedor(data.value);
  };

  if (!data) return <div>erro..</div>;

  return (
    <>
      <header>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex  flex-row space-x-3 justify-center"
        >
          <Form {...form}>
            <AutoCompleteFormFieldString
              form={form}
              name="value"
              options={data}
              placeholder="Escolhe fornecedor..."
              largura="w-full"
              mostraErro={false}
              disable={false}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "..." : "Pesquisa"}
            </Button>
          </Form>
        </form>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto ">
            {naoRegularizado && (
              <>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
                  {naoRegularizado[0]?.cPagamento}
                </h3>
                <Table className="w-fit border border-border rounded-md border-collapse mx-auto my-0">
                  <TableHeader className="bg-muted ">
                    <TableRow>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Doc
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        NDoc
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        UDoc
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Data Doc
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Data Compra
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Data Vencimento
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Valor
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Valor Acc
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Idade
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Idade venc.
                      </TableHead>
                      <TableHead className="text-center font-semibold border border-border h-7">
                        Id
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {naoRegularizado?.map((d, idx) => (
                      <TableRow
                        key={`${d.intid}-${idx}`}
                        className={cn({ "bg-accent": d.cPagamento === "T" })}
                      >
                        {d.cPagamento !== "T" && (
                          <>
                            <TableCell className="border border-border  h-2 px-1 py-0">
                              {d.tipoDoc}
                            </TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                              {d.nDOc}
                            </TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0">
                              {d.ultdoc}
                            </TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                              {d.docdata.toLocaleDateString("pt-PT")}
                            </TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                              {d.datalc.toLocaleDateString("pt-PT")}
                            </TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                              {d.dataven.toLocaleDateString("pt-PT")}
                            </TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0 text-right">
                              {formatMoneyPT(d.valor)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "border border-border h-2 px-1 py-0 text-right",
                              )}
                            >
                              {formatMoneyPT(d.valorAcumulado)}
                            </TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                              {d.idadeEmissao}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "border border-border  h-2 px-1 py-0 text-center",
                                { "text-destructive": d.idadeVencimento > 0 },
                              )}
                            >
                              {d.idadeVencimento}
                            </TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                              {d.intid}
                            </TableCell>
                          </>
                        )}
                        {d.cPagamento == "T" && (
                          <>
                            <TableCell
                              className="border border-border  h-2 px-1 py-0"
                              colSpan={5}
                            ></TableCell>
                            <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                              {d.dataven.toLocaleDateString("pt-PT")}
                            </TableCell>

                            <TableCell className="border border-border  h-2 px-1 py-0 text-right">
                              {formatMoneyPT(d.valorAcumulado)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "border border-border h-2 px-1 py-0 text-right",
                              )}
                            >
                              {formatMoneyPT(
                                naoRegularizado[idx - 1]?.valorAcumulado || 0,
                              )}
                            </TableCell>
                            <TableCell
                              className="border border-border  h-2 px-1 py-0"
                              colSpan={3}
                            ></TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default NaoRegularizadoConteudo;
