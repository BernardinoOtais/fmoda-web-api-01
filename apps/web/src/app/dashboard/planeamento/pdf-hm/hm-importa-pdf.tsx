"use client";

import { EncomendaSchema, EncomendaHMDto } from "@repo/tipos/pdf";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
                </div>
                {data.encomenda.dadosDestino.map((d) => {
                  console.log(d.assortment.totalAs);
                  return (
                    <Card
                      key={d.destino.dCod}
                      className="w-full max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto p-2 hover:bg-muted"
                    >
                      <CardContent className="mx-auto">
                        <CardTitle className="text-2xl p-2">
                          <div className="flex flex-row items-center space-x-2 justify-center">
                            <span>
                              Destino:
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
                            <Card className="w-full text-center gap-1 p-1">
                              <CardContent>
                                <CardTitle className="font-bold p-2">
                                  {`${d.assortment.totalAs.nSortidos} Packs com ${d.assortment.totalAs.nPecasSortido} por Pack, Total Peças: ${d.assortment.totalAs.ttPecas}`}
                                </CardTitle>
                                <Table className="border border-border rounded-md border-collapse mx-auto">
                                  <TableHeader className="bg-muted">
                                    <TableRow>
                                      {d.assortment.assort.map((p) => (
                                        <TableHead
                                          key={p.tam}
                                          className="border border-border text-center min-w-25 max-w-36 h-7 "
                                        >
                                          {p.tam}
                                        </TableHead>
                                      ))}
                                      <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                                        Total
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      {d.assortment.assort.map((p) => (
                                        <TableCell
                                          key={p.tam}
                                          className="border border-border text-center min-w-25 max-w-36  h-2 p-0"
                                        >
                                          {p.qtt}
                                        </TableCell>
                                      ))}
                                      <TableCell className="border border-border text-center min-w-12 max-w-25 h-2 p-0 font-semibold">
                                        {d.assortment.totalAs.nPecasSortido}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                          )}

                          {d.single.totalsSingle.total !== 0 && (
                            <Card className="w-full  text-center gap-1 p-1">
                              <CardContent>
                                <CardTitle className="font-bold p-2">
                                  Single
                                </CardTitle>
                                <Table className="border border-border rounded-md border-collapse mx-auto">
                                  <TableHeader className="bg-muted">
                                    <TableRow>
                                      {d.single.dist.map((p) => (
                                        <TableHead
                                          key={p.tam}
                                          className="border border-border text-center min-w-25 max-w-36 h-7 "
                                        >
                                          {p.tam}
                                        </TableHead>
                                      ))}
                                      <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                                        Total
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      {d.single.dist.map((p) => (
                                        <TableCell
                                          key={p.tam}
                                          className="border border-border text-center min-w-25 max-w-36  h-2 p-0"
                                        >
                                          {p.qtt}
                                        </TableCell>
                                      ))}
                                      <TableCell className="border border-border text-center min-w-12 max-w-25 h-2 p-0 font-semibold">
                                        {d.single.totalsSingle.total}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                          )}
                          {d.single.totalsSingle.total !== 0 &&
                            d.assortment.totalAs.ttPecas !== 0 && (
                              <Card className="w-full  text-center gap-1 p-1">
                                <CardContent>
                                  <CardTitle className="font-bold p-2">
                                    Total
                                  </CardTitle>
                                  <Table className="border border-border rounded-md border-collapse mx-auto">
                                    <TableHeader className="bg-muted">
                                      <TableRow>
                                        {d.total.dist.map((p) => (
                                          <TableHead
                                            key={p.tam}
                                            className="border border-border text-center min-w-25 max-w-36 h-7 "
                                          >
                                            {p.tam}
                                          </TableHead>
                                        ))}
                                        <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                                          Total
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        {d.total.dist.map((p) => (
                                          <TableCell
                                            key={p.tam}
                                            className="border border-border text-center min-w-25 max-w-36  h-2 p-0"
                                          >
                                            {p.qtt}
                                          </TableCell>
                                        ))}
                                        <TableCell className="border border-border text-center min-w-12 max-w-25 h-2 p-0 font-semibold">
                                          {d.total.total.total}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>
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

/*
                <pre className="rounded-md bg-muted p-4 text-sm overflow-auto w-full">
                  {JSON.stringify(data, null, 2)}
                </pre>


*/
