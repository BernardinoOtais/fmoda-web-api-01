"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FornecedorNoDto,
  FornecedorNoSchema,
} from "@repo/tipos/joana/naoregularizada";
import { useQuery, skipToken } from "@repo/trpc";
import { useSuspenseQuery } from "@repo/trpc";
import React, { Fragment, useState } from "react";
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
import { useTRPC } from "@/trpc/client";

const ContaCorrenteConteudo = () => {
  const [fornecedor, setFornecedor] = useState<string | null>(null);
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.joanaContaCorrente.getFonecedores.queryOptions(),
  );
  const { data: contaCorrente } = useQuery(
    trpc.joanaContaCorrente.getContaCorrente.queryOptions(
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
          className="flex  flex-col lg:space-x-3 lg:space-y-0 space-y-1 justify-center items-center lg:flex-row m-1"
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
            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? "..." : "Pesquisa"}
            </Button>
          </Form>
        </form>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 ">
            {contaCorrente && (
              <Table className="w-fit border border-border rounded-md border-collapse mx-auto my-0">
                <TableHeader className="bg-muted ">
                  <TableRow>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      D.Compra
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      D.Doc
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      D.Vence
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Tipo
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Ndoc
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Debito
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Crédito
                    </TableHead>
                    <TableHead className="text-center font-semibold border border-border h-7">
                      Acc
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contaCorrente.map((c, idx) => (
                    <Fragment key={idx}>
                      {!c.dataCompra && !c.dataDoc && !c.dataVen ? (
                        <TableRow>
                          <TableCell
                            className="border border-border  h-2 px-1 py-0 text-right font-semibold"
                            colSpan={5}
                          >
                            Total :
                          </TableCell>
                          <TableCell className="border border-border  h-2 px-1 py-0 text-right font-semibold">
                            {formatMoneyPT(c.edeb)}
                          </TableCell>

                          <TableCell className="border border-border  h-2 px-1 py-0 text-right font-semibold">
                            {formatMoneyPT(c.ecred)}
                          </TableCell>
                          <TableCell
                            className="border border-border  h-2 px-1 py-0"
                            colSpan={1}
                          ></TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                            {!c.dataCompra ||
                            c.dataCompra.getTime() ===
                              new Date("1900-01-01").getTime()
                              ? "..."
                              : c.dataCompra.toLocaleDateString("pt-PT")}{" "}
                          </TableCell>
                          <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                            {c.dataDoc?.toLocaleDateString("pt-PT")}
                          </TableCell>
                          <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                            {c.dataVen?.toLocaleDateString("pt-PT")}
                          </TableCell>
                          <TableCell className="border border-border  h-2 px-1 py-0">
                            {c.doc}
                          </TableCell>
                          <TableCell className="border border-border  h-2 px-1 py-0 text-center">
                            {c.nDoc}
                          </TableCell>

                          <TableCell className="border border-border  h-2 px-1 py-0 text-right font-semibold">
                            {formatMoneyPT(c.edeb)}
                          </TableCell>

                          <TableCell className="border border-border  h-2 px-1 py-0 text-right font-semibold">
                            {formatMoneyPT(c.ecred)}
                          </TableCell>

                          <TableCell className="border border-border  h-2 px-1 py-0 text-right font-semibold">
                            {formatMoneyPT(c.valorAcumulado || 0)}
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
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

export default ContaCorrenteConteudo;
