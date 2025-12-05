"use client";
import { PesquisaFaturasPlaneadasSchema } from "@repo/tipos/joana/faturasplan";
import { useSuspenseQuery } from "@repo/trpc";
import { pt } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

import FaturacaoPlaneadaWeb from "./faturacao-planeada-web";

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
import FaturacaoPlaneadaMobile from "./faturacao-planeada-mobile";

type FaturacaoPlaneadaConteudoProps = {
  dataIni: Date;
  dataFini: Date;
};

const FaturacaoPlaneadaConteudo = ({
  dataIni,
  dataFini,
}: FaturacaoPlaneadaConteudoProps) => {
  const trpc = useTRPC();

  const [openIni, setOpenIni] = React.useState(false);
  const [dateIni, setDateIni] = React.useState<Date | null>(dataIni);

  const [openFini, setOpenFini] = React.useState(false);
  const [dateFini, setDateFini] = React.useState<Date | null>(dataFini);

  const [forncedor, setForncedor] = useState<string | null>(null);
  const debouncedFornecedor = useDebounce(forncedor, 1000);
  const fornecedor = debouncedFornecedor ? debouncedFornecedor : null;

  const rawValues = {
    dataIni: dateIni,
    dataFini: dateFini,
    fornecedor: fornecedor,
  };

  const parsed = PesquisaFaturasPlaneadasSchema.safeParse(rawValues);

  const { data } = useSuspenseQuery(
    trpc.joanaFaturacaoPlaneada.getFaturacaoPlaneada.queryOptions(
      parsed.success
        ? parsed.data
        : { dataIni: dataIni, dataFini: dataFini, fornecedor: null },
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
                  locale={pt}
                  startMonth={new Date(2020, 1)}
                  endMonth={new Date(2035, 12)}
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
                  locale={pt}
                  startMonth={new Date(2020, 1)}
                  endMonth={new Date(2035, 12)}
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
            <Label className="px-1">Fornecedor</Label>
            <Input
              placeholder="Pesquisar por For..."
              value={forncedor ?? ""}
              onChange={(e) => setForncedor(e.target.value)}
              className="w-44"
            />
          </div>
        </div>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center overflow-auto">
            {parsed.success ? (
              <>
                {/* MOBILE / TABLET version (< lg) */}
                <div className="block lg:hidden w-full  flex-col">
                  <FaturacaoPlaneadaMobile dadosPlaneados={data} />
                </div>

                {/* DESKTOP version (>= lg) */}
                <div className="hidden w-full lg:block">
                  <FaturacaoPlaneadaWeb dadosPlaneados={data} />
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

export default FaturacaoPlaneadaConteudo;
