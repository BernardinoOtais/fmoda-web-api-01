"use client";
import { EncomendaInditexDto, EncomendaInditexSchema } from "@repo/tipos/pdf";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useRef, useState } from "react";
import React from "react";

import DadosTabela from "../_aux/dados-table";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const InditexImportaPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault(); // required to allow drop
  };

  const { mutate, isPending, isError, data, error } = useMutation<
    EncomendaInditexDto,
    Error,
    File
  >({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/pdf2json", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Falha ao importar PDF");
      }

      const data = await res.json();

      // Validate with Zod
      const parsed = EncomendaInditexSchema.parse(data); // throws if invalid
      return parsed;
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    mutate(file);
  };
  return (
    <>
      <header className="x-1 space-y-1.5 border-b py-3 text-center">
        <form
          className="flex flex-row space-x-2 items-center justify-center"
          onSubmit={handleSubmit}
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? file.name : "Selecionar PDF"}
          </Button>

          <Button type="submit" disabled={!file || isPending}>
            {isPending ? "Importar..." : "Upload & importar PDF"}
          </Button>
        </form>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center m-2 space-y-2 overflow-auto">
            {isPending && <div>A Importar PDF...</div>}

            {isError && (
              <div className="text-red-500 font-medium">
                {error?.message ?? "Erro ao importar PDF"}
              </div>
            )}
            {!isPending && !isError && data && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex flex-row items-center space-x-2">
                  <span>
                    Pedido:
                    <span className="font-bold ml-1">
                      {data.encomenda.detalhesPeca.nPedido}
                    </span>
                  </span>
                  <span>
                    Modelo:
                    <span className="font-bold ml-1">
                      {data.encomenda.detalhesPeca.modelo}
                    </span>
                  </span>
                </div>
                <span>
                  Desc:
                  <span className="font-bold ml-1">
                    {data.encomenda.detalhesPeca.descModelo}
                  </span>
                </span>
                <div className="flex flex-row items-center space-x-2">
                  <span>
                    Temporada:
                    <span className="font-bold ml-1">
                      {data.encomenda.detalhesPeca.temporada}
                    </span>
                  </span>

                  {data.encomenda.detalhesPeca.dataEntrega && (
                    <span>
                      Data de Entrega:
                      <span className="font-bold ml-1">
                        {data.encomenda.detalhesPeca.dataEntrega.toLocaleDateString(
                          "pt-PT",
                        )}
                      </span>
                    </span>
                  )}
                </div>
                {data?.encomenda?.detalhesPeca?.pedido?.pedidoCores?.length !=
                  1 && (
                  <Card className="w-full max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto p-2 hover:bg-muted">
                    <DadosTabela
                      titulo={"Total"}
                      dados={data.encomenda.detalhesPeca.pedido.total.qtts}
                      total={data.encomenda.detalhesPeca.pedido.total.total}
                    />
                  </Card>
                )}

                {data?.encomenda?.detalhesPeca?.pedido?.pedidoCores?.length >
                  0 && (
                  <Card className="w-full  text-center gap-1 p-1 hover:bg-muted">
                    <CardTitle className="font-bold ">Cores</CardTitle>
                    {data.encomenda.detalhesPeca.pedido.pedidoCores.map((p) => (
                      <Fragment key={p.cor}>
                        <DadosTabela
                          titulo={p.cor}
                          dados={p.qtts}
                          total={p.total}
                        />
                      </Fragment>
                    ))}
                  </Card>
                )}

                {data?.encomenda?.detalhesPeca?.parciais &&
                  data.encomenda.detalhesPeca.parciais.length > 0 && (
                    <Card className="w-full text-center gap-1 p-1 hover:bg-muted">
                      <CardTitle className="font-bold">Parciais</CardTitle>

                      {data.encomenda.detalhesPeca.parciais.map((p) => (
                        <Fragment key={p.nParcial}>
                          <div className="flex flex-row items-center space-x-2 justify-center">
                            <span>
                              Pedido:
                              <span className="font-bold ml-1">{p.pedido}</span>
                            </span>
                            <span>
                              Data:
                              <span className="font-bold ml-1">
                                {new Date(p.dataParcial).toLocaleDateString(
                                  "pt-PT",
                                )}
                              </span>
                            </span>
                          </div>

                          {p.parcial.pedidoCores.map((cor) => (
                            <DadosTabela
                              key={cor.cor}
                              titulo={cor.cor}
                              dados={cor.qtts}
                              total={cor.total}
                            />
                          ))}
                        </Fragment>
                      ))}
                    </Card>
                  )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default InditexImportaPdf;
