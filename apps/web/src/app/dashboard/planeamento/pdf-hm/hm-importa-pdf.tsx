"use client";

import { EncomendaSchema, EncomendaHMDto } from "@repo/tipos/pdf";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

import DadosTabela from "../_aux/dados-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const HmImportaPdf = () => {
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
    EncomendaHMDto,
    Error,
    File
  >({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/pdf2json-hm", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Falha ao importar PDF");
      }

      const data = await res.json();

      // Validate with Zod
      const parsed = EncomendaSchema.parse(data); // throws if invalid
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
                      {data.encomenda.linhasCabecalho.orderNo}
                    </span>
                  </span>
                  <span>
                    Desc:
                    <span className="font-bold ml-1">
                      {data.encomenda.linhasCabecalho.prodDesc}
                    </span>
                  </span>
                  <span>
                    Destinos:
                    <span className="font-bold ml-1">
                      {data.encomenda.dadosDestino.length}
                    </span>
                  </span>
                </div>
                {data.encomenda.dadosDestino.map((d, idx) => {
                  return (
                    <Card
                      key={d.destino.dCod}
                      className="w-full max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto p-2 hover:bg-muted"
                    >
                      <CardContent className="mx-auto">
                        <CardTitle className="text-2xl p-2">
                          <div className="flex flex-row items-center space-x-2 justify-center">
                            <span>
                              {`Destino ${idx + 1}:`}
                              <span className="font-bold ml-1">
                                {d.destino.destino}
                              </span>
                            </span>
                            <span>
                              Cod:
                              <span className="font-bold ml-1">
                                {d.destino.dCod}
                              </span>
                            </span>
                          </div>
                        </CardTitle>

                        <div className="flex flex-row items-center justify-center space-x-2 pb-2">
                          <span>
                            Art N.:
                            <span className="font-bold ml-1">
                              {d.arttigo.artNo}
                            </span>
                          </span>
                          <span>
                            Cor:
                            <span className="font-bold ml-1">
                              {`${d.arttigo.hmColourCod.trim()} ${d.arttigo.colourName.trim()}`}
                            </span>
                          </span>
                          <span>
                            Desc:
                            <span className="font-bold ml-1">
                              {`${d.arttigo.description}`}
                            </span>
                          </span>
                        </div>
                        <div className="flex flex-col justify-center items-center space-y-2">
                          {d.assortment.totalAs.ttPecas !== 0 && (
                            <DadosTabela
                              titulo={`${d.assortment.totalAs.nSortidos} Packs com ${d.assortment.totalAs.nPecasSortido} peças por Pack, Total Peças: ${d.assortment.totalAs.ttPecas}`}
                              dados={d.assortment.assort}
                              total={d.assortment.totalAs.nPecasSortido}
                            />
                          )}

                          {d.single.totalsSingle.total !== 0 && (
                            <DadosTabela
                              titulo="Singles"
                              dados={d.single.dist}
                              total={d.single.totalsSingle.total}
                            />
                          )}
                          {d.single.totalsSingle.total !== 0 &&
                            d.assortment.totalAs.ttPecas !== 0 && (
                              <DadosTabela
                                titulo="Total"
                                dados={d.total.dist}
                                total={d.total.total.total}
                              />
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default HmImportaPdf;
