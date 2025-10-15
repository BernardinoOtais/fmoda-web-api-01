"use client";
import { OPschema } from "@repo/tipos/qualidade_balancom";
import { useQuery } from "@repo/trpc";
import React, { useState } from "react";

import DatasQuantidades from "./_datas-e-quantidades/datas-quantidades";
import MutateFornecededor from "./mutate-fornecedor";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FotoClient from "@/components/ui-personalizado/fotos/foto-client";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

const OpDatasConteudo = () => {
  const trpc = useTRPC();

  const [opI, setOp] = useState("");
  const debouncedOp = useDebounce(opI, 1250); // Pass just the string

  const { data, isLoading, isError } = useQuery({
    ...trpc.planeamento.getOpCamioesEnvios.queryOptions({
      op: parseInt(debouncedOp),
    }),
    enabled: OPschema.safeParse({ op: debouncedOp }).success, // Wrap here instead
  });

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("pt-PT", options).format(date);
  };

  return (
    <>
      <header className="x-1 space-y-1.5 border-b py-3 text-center">
        <div className="flex flex-row space-x-1 items-center justify-center">
          <Label htmlFor="op">Op:</Label>
          <Input
            className="w-28"
            id="op"
            value={opI}
            onChange={(e) => setOp(e.target.value)}
          />
        </div>
      </header>
      <main className="relative grow" key={debouncedOp}>
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center m-2 space-y-2 overflow-auto">
            {debouncedOp === "" ? (
              <div>...</div>
            ) : isLoading ? (
              <div>isLoading...</div>
            ) : isError || !data || !data[0] ? (
              <div>error...</div>
            ) : !OPschema.safeParse({ op: debouncedOp }).success ? (
              <div>Erro na op...</div>
            ) : (
              <>
                <div className="flex flex-col">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
                    {`Pedido ${data[0].pedido}`}
                  </h3>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
                    {`${data[0].modelo} QTT: ${data[0].qttTotal}`}
                  </h3>
                </div>

                <FotoClient
                  src={data[0].foto}
                  alt="Foto Modelo"
                  cssImage="w-56 mx-auto"
                />

                {data[0].detalhe.map((d) => (
                  <div
                    key={d.cor + d.atedata}
                    className="flex flex-col lg:space-x-2 lg:flex-row  mx-auto items-center justify-center"
                  >
                    <div className="flex flex-row lg:flex-col space-x-2">
                      <span className="whitespace-nowrap">{d.cor}</span>
                      <span className="font-semibold">
                        {formatDate(d.atedata)}
                      </span>
                    </div>
                    <Table className="">
                      <TableHeader className="bg-accent">
                        <TableRow className="!border-0 border-none">
                          {d.quantidades.map((q) => (
                            <TableHead
                              key={q.tam}
                              className="border text-center"
                            >
                              {q.tam}
                            </TableHead>
                          ))}
                          <TableHead className="border text-center font-semibold">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-xs">
                        <TableRow className="!border-0 border-none !p-0 bg-transparent">
                          {d.quantidades.map((qq) => (
                            <TableCell
                              key={qq.tam}
                              className="border text-center w-16"
                            >
                              {qq.qtt}
                            </TableCell>
                          ))}
                          <TableCell className="border text-center w-16 font-semibold">
                            {d.quantidades.reduce(
                              (sum, item) => sum + item.qtt,
                              0
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
                <div className="flex flex-col ">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
                    {`Fornecedores`}
                  </h3>
                  <MutateFornecededor
                    key={debouncedOp}
                    op={debouncedOp}
                    valorOriginal={data[0].fornecedor ?? ""}
                  />
                </div>
                <div className="flex flex-col lg:flex-row lg:space-x-1 space-y-1 items-end">
                  <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
                      {`Camiões...`}
                    </h3>
                    <DatasQuantidades
                      op={parseInt(debouncedOp)}
                      dados={data[0].camioes}
                      variavelD="u_datacam"
                      variavelQ="u_camqtt"
                    />
                  </div>
                  <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
                      {`Envios...`}
                    </h3>
                    <DatasQuantidades
                      op={parseInt(debouncedOp)}
                      dados={data[0].envios}
                      variavelD="u_datafor"
                      variavelQ="u_dfqtt"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default OpDatasConteudo;
