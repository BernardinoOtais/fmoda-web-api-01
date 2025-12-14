"use client";
import { PesquisaEnviosMarrocosSchema } from "@repo/tipos/joana/enviosmarrocos";
import { useSuspenseQuery } from "@repo/trpc";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

import TabelaTamanhosQtt from "../_joana-aux/componentes/tabela-tamanhos-qtt";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type EnviosAMarrocosConteudoProps = {
  dataIni: Date;
  dataFini: Date;
};

const EnviosAMarrocosConteudo = ({
  dataIni,
  dataFini,
}: EnviosAMarrocosConteudoProps) => {
  const trpc = useTRPC();

  const [openIni, setOpenIni] = React.useState(false);
  const [dateIni, setDateIni] = React.useState<Date | null>(dataIni);

  const [openFini, setOpenFini] = React.useState(false);
  const [dateFini, setDateFini] = React.useState<Date | null>(dataFini);

  const [searchOp, setSearchOp] = useState<string | null>(null);
  const debouncedOp = useDebounce(searchOp, 800);
  const opValue = debouncedOp?.trim() ? Number(debouncedOp) : null;

  const rawValues = {
    dataIni: dateIni,
    dataFini: dateFini,
    op: opValue === 0 ? null : opValue,
  };

  const parsed = PesquisaEnviosMarrocosSchema.safeParse(rawValues);

  const { data } = useSuspenseQuery(
    trpc.joanaEnviosAMarrocos.getEnviosMarrocos.queryOptions(
      parsed.success
        ? parsed.data
        : { dataIni: dataIni, dataFini: dataFini, op: null },
      {
        enabled: parsed.success,
      }
    )
  );
  return (
    <>
      <header>
        <div className="flex lg:flex-row flex-col ml-auto items-center p-2">
          {/* DATA INICIAL */}
          <div className="flex flex-row gap-3 mx-auto items-center">
            <Label className="px-1">Data Inicial</Label>
            <Popover open={openIni} onOpenChange={setOpenIni}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-48 justify-between font-normal"
                >
                  {dateIni
                    ? dateIni.toLocaleDateString("pt-PT")
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0">
                <Calendar
                  mode="single"
                  selected={dateIni ?? undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDateIni(date ?? null);
                    setOpenIni(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* DATA FINAL */}
          <div className="flex flex-row gap-3 mx-auto items-center">
            <Label className="px-1">Data Final</Label>
            <Popover open={openFini} onOpenChange={setOpenFini}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-48 justify-between font-normal"
                >
                  {dateFini
                    ? dateFini.toLocaleDateString("pt-PT")
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0">
                <Calendar
                  mode="single"
                  selected={dateFini ?? undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDateFini(date ?? null);
                    setOpenFini(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* OP */}
          <div className="flex flex-row gap-3 mx-auto items-center">
            <Label className="px-1">Op</Label>
            <Input
              placeholder="Pesquisar por op..."
              value={searchOp ?? ""}
              onChange={(e) => setSearchOp(e.target.value)}
              className="w-44"
            />
          </div>
        </div>
      </header>

      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center overflow-auto">
            {/* Show data only if valid */}
            {parsed.success
              ? data.map((op) => (
                  <Card
                    key={op.obrano}
                    className="w-full max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto gap-1 p-1"
                  >
                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 p-1 gap-1">
                      {/* Element 1 */}
                      <div className="flex flex-col items-center justify-center border border-border rounded-md p-1 order-1">
                        <span>
                          Op: <span className="font-bold">{op.obrano}</span>
                        </span>
                        <span>
                          Cliente:{" "}
                          <span className="font-bold">{op.cliente}</span>
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

                        <TabelaTamanhosQtt dados={op.pedido} />

                        <span className="font-bold">Cortado</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : "Preencha corretamente"}
          </div>
        </div>
      </main>
    </>
  );
};

export default EnviosAMarrocosConteudo;
