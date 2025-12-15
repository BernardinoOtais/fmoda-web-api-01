"use client";

import { PesquisaFaturasSchema } from "@repo/tipos/joana/faturas";
import { useSuspenseQuery } from "@repo/trpc";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

import FaturacaoMovel from "./faturacao-movel";
import FaturacaoWeb from "./faturacao-web";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type FaturacaoConteudoProps = {
  dataIni: Date;
  dataFini: Date;
};

const FaturacaoConteudo = ({ dataIni, dataFini }: FaturacaoConteudoProps) => {
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

  const parsed = PesquisaFaturasSchema.safeParse(rawValues);

  const { data } = useSuspenseQuery(
    trpc.joanaFaturacao.getFaturacao.queryOptions(
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
            {parsed.success ? (
              <>
                {/* MOBILE / TABLET version (< lg) */}
                <div className="block lg:hidden w-full  flex-col">
                  <FaturacaoMovel
                    faturacaoMovel={data.faturacaoMobile}
                    totalGeral={data.totalGeral}
                  />
                </div>

                {/* DESKTOP version (>= lg) */}
                <div className="hidden w-full lg:block">
                  <FaturacaoWeb
                    faturacaoWeb={data.faturacaoWeb}
                    totalGeral={data.totalGeral}
                  />
                </div>
              </>
            ) : (
              "Preencha corretamente"
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default FaturacaoConteudo;
