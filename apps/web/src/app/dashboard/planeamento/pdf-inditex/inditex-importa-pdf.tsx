"use client";
import { EncomendaInditexDto, EncomendaInditexSchema } from "@repo/tipos/pdf";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import React from "react";

import { Button } from "@/components/ui/button";
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
              <div className="flex flex-col items-center justify-center space-y-2">
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
                  <span>
                    Desc:
                    <span className="font-bold ml-1">
                      {data.encomenda.detalhesPeca.descModelo}
                    </span>
                  </span>
                </div>
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
              </div>
            )}
          </div>
        </div>
      </main>
      {/*     <pre>{JSON.stringify(data, null, 2)}</pre>*/}
    </>
  );
};

export default InditexImportaPdf;
