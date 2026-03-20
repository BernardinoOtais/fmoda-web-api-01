"use client";

import { FaturaGetSchema } from "@repo/tipos/qualidade/faturascp";
import { skipToken, useQuery } from "@repo/trpc";
import React, { useState } from "react";

import FaturacaoPesos from "./faturacao-pesos";
import FaturasOpComposicao from "./faturas-op-composicao";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

const FaturasComposcaoPLiquidoEPBruto = () => {
  const trpc = useTRPC();

  const year = new Date().getFullYear().toString();

  const [ano, setAno] = useState(year);

  const [fatura, setFatura] = useState("");

  const debouncedAno = useDebounce(ano, 1250);
  const debouncedFatura = useDebounce(fatura, 1250);

  const parsed = FaturaGetSchema.safeParse({
    ano: debouncedAno,
    fatura: debouncedFatura,
  });

  const { data, isLoading, isError } = useQuery({
    ...trpc.faturasComnposicaoPbEPl.getBmDadosParaCalculoComposicao.queryOptions(
      parsed.success
        ? {
            ano: parsed.data.ano,
            fatura: parsed.data.fatura,
          }
        : skipToken,
    ),
    enabled: parsed.success,
  });

  return (
    <>
      <header className="space-y-2 border-b py-3 text-center">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center gap-1">
            <Label htmlFor="op">Ano:</Label>
            <Input
              className="w-28"
              id="ano"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1">
            <Label htmlFor="modelo">Fatura:</Label>
            <Input
              className="w-40"
              id="fatura"
              value={fatura}
              onChange={(e) => setFatura(e.target.value)}
            />
          </div>
        </div>

        {/* Validation error */}
        {!parsed.success && debouncedAno !== "" && debouncedFatura !== "" && (
          <p className="text-sm text-red-500">
            {parsed.error.issues[0]?.message}
          </p>
        )}

        {/* Loading */}
        {parsed.success && isLoading && (
          <p className="text-sm text-muted-foreground">A procurar...</p>
        )}

        {/* API error */}
        {isError && (
          <p className="text-sm text-red-500">Erro ao carregar dados.</p>
        )}
      </header>
      {data && parsed.data?.ano && parsed.data.fatura && (
        <main className="relative grow">
          <div className="absolute top-0 bottom-0 flex w-full">
            <div className="flex w-full flex-col items-center gap-1 space-y-1 overflow-auto ">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Pesos
              </h3>
              <Card>
                <CardContent>
                  <FaturacaoPesos
                    ftstamp={data.ftstamp}
                    u_pnet={data.u_pnet.toString()}
                    u_pbruto={data.u_pbruto.toString()}
                    ano={parsed.data.ano}
                    fatura={parsed.data.fatura}
                  />
                </CardContent>
              </Card>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Composições
              </h3>
              <div className="w-fit flex flex-col gap-1">
                {data.composicao.map((c) => (
                  <Card key={c.opStamp} className="w-full">
                    <CardContent className=" ">
                      <FaturasOpComposicao
                        dados={c}
                        ano={parsed.data.ano}
                        fatura={parsed.data.fatura}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default FaturasComposcaoPLiquidoEPBruto;
