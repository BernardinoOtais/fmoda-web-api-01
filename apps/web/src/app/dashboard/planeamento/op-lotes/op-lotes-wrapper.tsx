"use client";
import { OPschema } from "@repo/tipos/planeamento/lotes";
import { useQuery } from "@repo/trpc";
import React, { useState } from "react";

import CorpoOpLotesWrapper from "./_aux/componentes/corpo-op-lotes-wrapper";
import TabelaTamanhosQtt from "./_aux/componentes/tabela-tamanhos-qtt";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

const OpLotesWrapper = () => {
  const trpc = useTRPC();

  const [opI, setOp] = useState("");
  const debouncedOp = useDebounce(opI, 1250);

  const { data, isLoading, isError } = useQuery({
    ...trpc.planeamentoLotes.getOpLotesPedido.queryOptions({
      op: parseInt(debouncedOp),
    }),
    enabled: OPschema.safeParse({ op: debouncedOp }).success,
  });

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
            ) : isError || !data ? (
              <div>error...</div>
            ) : !OPschema.safeParse({ op: debouncedOp }).success ? (
              <div>Erro na op...</div>
            ) : (
              <>
                <div className="flex flex-col w-full space-y-2">
                  <Card className="w-full max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto gap-1 p-1">
                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 p-1 gap-1">
                      <div className="flex flex-col items-center justify-center border border-border rounded-md p-1 order-1">
                        <span>
                          Op: <span className="font-bold">{data.obrano}</span>
                        </span>

                        <span>
                          Cliente:
                          <span className="font-bold">{data.cliente}</span>
                        </span>
                        <span className="text-center ">{data.design}</span>
                        <span className="text-center">
                          Cor: <span className="font-bold">{data.cor}</span>
                        </span>
                        {process.env.NODE_ENV === "production" && (
                          <LazyFotoClient
                            src={data.foto || ""}
                            alt="Foto Modelo"
                            cssImage="w-40 h-40 object-contain rounded-md border border-border"
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-center border border-border flex-col rounded-md p-1 order-2">
                        <span className="font-bold mx-auto">Pedido:</span>
                        <TabelaTamanhosQtt dados={data.quantidades} />
                      </div>
                    </CardContent>
                  </Card>
                  <CorpoOpLotesWrapper
                    bostamp={data.bostamp}
                    distPorCaixa={data.distPorCaixa}
                    op={parseInt(debouncedOp)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default OpLotesWrapper;
