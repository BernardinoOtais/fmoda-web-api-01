"use client";

import { useSuspenseQuery } from "@repo/trpc";
import React, { useState, useEffect, Fragment } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

const CortesPorOpConteudo = () => {
  const trpc = useTRPC();

  const [searchOp, setSearchOp] = useState<string>("");
  const debouncedOp = useDebounce(searchOp, 400);
  const opValue = debouncedOp.trim() === "" ? null : Number(debouncedOp);

  // Main query with dynamic op value
  const { data } = useSuspenseQuery(
    trpc.joanaCortesPorOp.getCortesPorOp.queryOptions({ op: opValue })
  );

  const [filtered, setFiltered] = useState(data);

  useEffect(() => {
    setFiltered(data);
  }, [data]);

  return (
    <>
      <header>
        <div className="flex flex-row ml-auto items-center pb-1">
          <span className="ml-auto px-1">Op :</span>
          <Input
            placeholder="Pesquisar por op..."
            value={searchOp}
            onChange={(e) => setSearchOp(e.target.value)}
            className="w-44"
          />
        </div>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center gap-1 overflow-auto">
            {filtered.map((op) => (
              <Card
                key={op.bostamp}
                className="w-full max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto gap-1 p-1"
              >
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 p-1 gap-1">
                  {/* Element 1 */}
                  <div className="flex flex-col items-center justify-center border border-border rounded-md p-1 order-1">
                    <span>
                      Op: <span className="font-bold">{op.obrano}</span>
                    </span>
                    <span>
                      Cliente: <span className="font-bold">{op.cliente}</span>
                    </span>
                    <span className="text-center ">{op.design}</span>
                    <span className="text-center">
                      Cor: <span className="font-bold">{op.cor}</span>
                    </span>
                    {process.env.NODE_ENV === "production" && (
                      <LazyFotoClient
                        src={op.foto || ""}
                        alt="Foto Modelo"
                        cssImage="w-40 h-40 object-contain rounded-md border border-border"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-center border border-border flex-col rounded-md p-1 order-2">
                    <span className="font-bold">Pedido</span>

                    <Table className="w-full border border-border rounded-md border-collapse">
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          {op.pedido.map((p) => (
                            <TableHead
                              key={p.tam}
                              className="border border-border text-center"
                            >
                              {p.tam}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          {op.pedido.map((p) => (
                            <TableCell
                              key={p.tam}
                              className="border border-border text-center"
                            >
                              {p.qtt}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                    {op.cortes.length > 1 && (
                      <Fragment>
                        {<span className="font-bold">Totais</span>}
                        {groupByCortado(op.total).map((group, idx) => (
                          <Fragment key={idx}>
                            <span className="font-bold text-center text-xs flex flex-col">
                              {group.designs.map((d) => (
                                <span key={d}>{d}</span>
                              ))}
                            </span>

                            <Table className="border border-border rounded-md border-collapse w-full">
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  {group.cortado?.map((item) => (
                                    <TableHead
                                      key={item.tam}
                                      className="border border-border text-center"
                                    >
                                      {item.tam}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>

                              <TableBody>
                                <TableRow>
                                  {group.cortado?.map((item) => (
                                    <TableCell
                                      key={item.tam}
                                      className="border border-border text-center"
                                    >
                                      {item.qtt}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Fragment>
                        ))}
                      </Fragment>
                    )}
                    <span className="font-bold">Cortado</span>
                    {op.cortes.map((c) => (
                      <Fragment key={c.fornecedor}>
                        <span className="font-bold text-center">
                          {c.fornecedor}
                        </span>
                        {groupByCortado(c.parte).map((group, idx) => (
                          <Fragment key={idx}>
                            <span className="font-bold text-center text-xs flex flex-col">
                              {group.designs.map((d) => (
                                <span key={d}>{d}</span>
                              ))}
                            </span>

                            <Table className="border border-border rounded-md border-collapse w-full">
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  {group.cortado?.map((item) => (
                                    <TableHead
                                      key={item.tam}
                                      className="border border-border text-center"
                                    >
                                      {item.tam}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>

                              <TableBody>
                                <TableRow>
                                  {group.cortado?.map((item) => (
                                    <TableCell
                                      key={item.tam}
                                      className="border border-border text-center"
                                    >
                                      {item.qtt}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Fragment>
                        ))}
                      </Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default CortesPorOpConteudo;

function groupByCortado(
  partes: {
    ref: string;
    design: string;
    cortado?: { tam: string; ordem: number; qtt: number }[];
  }[]
) {
  const groups: Record<
    string,
    {
      ref: string;
      design: string;
      cortado: { tam: string; ordem: number; qtt: number }[];
    }[]
  > = {};

  for (const p of partes) {
    // Always use a defined array
    const cortadoArr = p.cortado ?? [];

    const key = JSON.stringify(
      [...cortadoArr].sort((a, b) => a.ordem - b.ordem)
    );

    if (!groups[key]) groups[key] = [];

    groups[key].push({
      ...p,
      cortado: cortadoArr,
    });
  }

  return Object.values(groups).map((group) => ({
    designs: group.map((g) => g.design),
    cortado: group[0]?.cortado,
  }));
}
/*

            {c.parte.map((p) => (
                          <Fragment key={p.design}>
                            <span className="font-bold text-center text-xs">
                              {p.design}
                            </span>
                            <Table className=" border border-border rounded-md border-collapse w-full">
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  {p.cortado.map((p) => (
                                    <TableHead
                                      key={p.tam}
                                      className="border border-border text-center"
                                    >
                                      {p.tam}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  {p.cortado.map((p) => (
                                    <TableCell
                                      key={p.tam}
                                      className="border border-border text-center"
                                    >
                                      {p.qtt}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Fragment>
                        ))}

*/
