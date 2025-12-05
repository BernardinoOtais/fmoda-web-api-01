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

/*
dados:  {
  "totalGeral": 182431.65,
  "faturacaoWeb": [
    {
      "nmdoc": "Invoice",
      "fno": 727,
      "fdata": "2025-12-03T00:00:00.000Z",
      "obrano": 3773,
      "design": "5643/705 SUD CAPUCHA CON ESTAMPADO ANIMAL PRINT BOLA BILLAR",
      "cor": "812 - GRIS.VIG",
      "foto": "Desenhos\\2025\\CLI-1029-2025\\SUDADERA BILLAR.JPG",
      "cliente": "ZARA MENINA",
      "qtt": 2941,
      "epv": 6,
      "total": 17646
    },
    {
      "nmdoc": "Credit Note NLS",
      "fno": 44,
      "fdata": "2025-12-05T00:00:00.000Z",
      "obrano": 3779,
      "design": "5643/935 HOODIE KIDS-O TEXTO (GRANATE)",
      "cor": "791 - GRANATE",
      "foto": "Desenhos\\2025\\CLI-1541-2025\\GRANATE.JPG",
      "cliente": "ZARA BEBÉ MENINO",
      "qtt": 0,
      "epv": 28.01,
      "total": -28.01
    },
    {
      "nmdoc": "Credit Note NLS",
      "fno": 43,
      "fdata": "2025-12-03T00:00:00.000Z",
      "obrano": 3847,
      "design": "5643/500 SUDADERA KIDS-O EST. NEW YORK",
      "cor": "805 - HIELO",
      "foto": "Desenhos\\2025\\CLI-1567-2025\\NOVA IORQUE.JPG",
      "cliente": "ZARA BEBÉ MENINO",
      "qtt": 0,
      "epv": 40.86,
      "total": -40.86
    },
    {
      "nmdoc": "Invoice",
      "fno": 725,
      "fdata": "2025-12-03T00:00:00.000Z",
      "obrano": 3873,
      "design": "5643/628 KIDS-A SUDADERA SUPER FAMILY",
      "cor": "681 - BURGUNDY",
      "foto": "Desenhos\\2025\\CLI-1920-2025\\SUDADERA BURGUNDY DAD_PREVIEW.JPG",
      "cliente": "ZARA BEBÉ MENINA",
      "qtt": 13000,
      "epv": 4.25,
      "total": 55250
    },
    {
      "nmdoc": "Invoice",
      "fno": 728,
      "fdata": "2025-12-04T00:00:00.000Z",
      "obrano": 3874,
      "design": "5646/600 CTA K POP DH GOLDEN",
      "cor": "712 - CRUDO",
      "foto": "Desenhos\\2025\\CLI-2078-2025\\K-POP.JPG",
      "cliente": "ZARA MENINA",
      "qtt": 6500,
      "epv": 3.35,
      "total": 21775
    },
    {
      "nmdoc": "Invoice",
      "fno": 726,
      "fdata": "2025-12-03T00:00:00.000Z",
      "obrano": 3876,
      "design": "5643/628 KIDS-A SUDADERA SUPER FAMILY",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-1919-2025\\SUDADERA VIGORE MOM V1_PREVIEW.JPG",
      "cliente": "ZARA BEBÉ MENINA",
      "qtt": 12506,
      "epv": 4.25,
      "total": 53150.5
    },
    {
      "nmdoc": "Invoice",
      "fno": 722,
      "fdata": "2025-12-02T00:00:00.000Z",
      "obrano": 3893,
      "design": "9006/629 CTA OSO Y PERRO (E) PASIES PICO DIC",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-2067-2025\\RIB URSO MESCLA.JPG",
      "cliente": "ZARA MENINA",
      "qtt": 7470,
      "epv": 2.9,
      "total": 21663
    },
    {
      "nmdoc": "Invoice",
      "fno": 723,
      "fdata": "2025-12-02T00:00:00.000Z",
      "obrano": 3896,
      "design": "9006/630 CTA OSO Y PERRO (E) CALOR",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-2070-2025\\CAPTURARGRIS.JPG",
      "cliente": "ZARA MENINA",
      "qtt": 4093,
      "epv": 2.9,
      "total": 11869.7
    },
    {
      "nmdoc": "Invoice",
      "fno": 729,
      "fdata": "2025-12-05T00:00:00.000Z",
      "obrano": 3901,
      "design": "5643/612 SUDADERA CAPIBARA ESTAMPADO DELANTERO Y TRASERO",
      "cor": "620 - ROSA",
      "foto": "Desenhos\\2025\\CLI-2044-2025\\FICHA_V1_PREVIEW.JPG",
      "cliente": "ZARA MENINA",
      "qtt": 14,
      "epv": 4.98,
      "total": 69.72
    },
    {
      "nmdoc": "Invoice",
      "fno": 724,
      "fdata": "2025-12-02T00:00:00.000Z",
      "obrano": 3911,
      "design": "9006/629 CTA OSO Y PERRO (E) PASIES PICO DIC",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-2067-2025\\RIB URSO MESCLA.JPG",
      "cliente": "ZARA MENINA",
      "qtt": 110,
      "epv": 2.9,
      "total": 319
    },
    {
      "nmdoc": "Invoice",
      "fno": 729,
      "fdata": "2025-12-05T00:00:00.000Z",
      "obrano": 3912,
      "design": "5643/509 KIDS-A SUDADERAS DIVERTIDAS ENERO (E) USA",
      "cor": "621 - ROSA PAST",
      "foto": "Desenhos\\2025\\CLI-2116-2025\\FICHA V1_01.JPG",
      "cliente": "ZARA BEBÉ MENINA",
      "qtt": 18,
      "epv": 4.65,
      "total": 83.7
    },
    {
      "nmdoc": "Invoice",
      "fno": 729,
      "fdata": "2025-12-05T00:00:00.000Z",
      "obrano": 3915,
      "design": "5643/509 KIDS-A SUDADERAS DIVERTIDAS ENERO (E) USA",
      "cor": "712 - CRUDO",
      "foto": "Desenhos\\2025\\CLI-2131-2025\\SUDADERA STICKERS_PREVIEW.JPG",
      "cliente": "ZARA BEBÉ MENINA",
      "qtt": 18,
      "epv": 4.65,
      "total": 83.7
    },
    {
      "nmdoc": "Invoice",
      "fno": 729,
      "fdata": "2025-12-05T00:00:00.000Z",
      "obrano": 3916,
      "design": "5643/559 - KIDS-O CTA M/C AOP PERRO FC FEB",
      "cor": "251 - BLAN. ROTO",
      "foto": "Desenhos\\2025\\CLI-2103-2025\\PEÇA.JPG",
      "cliente": "ZARA BEBÉ MENINO",
      "qtt": 18,
      "epv": 2.5,
      "total": 45
    },
    {
      "nmdoc": "Invoice",
      "fno": 724,
      "fdata": "2025-12-02T00:00:00.000Z",
      "obrano": 3929,
      "design": "9006/630 CTA OSO Y PERRO (E) CALOR",
      "cor": "250 - BLANCO",
      "foto": "Desenhos\\2025\\CLI-2071-2025\\CAPTURARBEG.JPG",
      "cliente": "ZARA MENINA",
      "qtt": 90,
      "epv": 2.9,
      "total": 261
    },
    {
      "nmdoc": "Invoice",
      "fno": 724,
      "fdata": "2025-12-02T00:00:00.000Z",
      "obrano": 3930,
      "design": "9006/630 CTA OSO Y PERRO (E) CALOR",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-2070-2025\\CAPTURARGRIS.JPG",
      "cliente": "ZARA MENINA",
      "qtt": 80,
      "epv": 2.9,
      "total": 232
    },
    {
      "nmdoc": "Invoice",
      "fno": 729,
      "fdata": "2025-12-05T00:00:00.000Z",
      "obrano": 3943,
      "design": "5643/572 - KIDS - O CTA M/C CAPS ENERO AOP PATOS (E).COM",
      "cor": "310 - AMAR. MED",
      "foto": "Desenhos\\2025\\CLI-2072-2025\\PEÇA.JPG",
      "cliente": "ZARA BEBÉ MENINO",
      "qtt": 18,
      "epv": 2.9,
      "total": 52.2
    }
  ],
  "faturacaoMobile": [
    {
      "obrano": 3773,
      "design": "5643/705 SUD CAPUCHA CON ESTAMPADO ANIMAL PRINT BOLA BILLAR",
      "cor": "812 - GRIS.VIG",
      "foto": "Desenhos\\2025\\CLI-1029-2025\\SUDADERA BILLAR.JPG",
      "cliente": "ZARA MENINA",
      "totalGrupo": 17646,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 727,
          "fdata": "2025-12-03T00:00:00.000Z",
          "qtt": 2941,
          "epv": 6,
          "total": 17646
        }
      ]
    },
    {
      "obrano": 3779,
      "design": "5643/935 HOODIE KIDS-O TEXTO (GRANATE)",
      "cor": "791 - GRANATE",
      "foto": "Desenhos\\2025\\CLI-1541-2025\\GRANATE.JPG",
      "cliente": "ZARA BEBÉ MENINO",
      "totalGrupo": -28.01,
      "detalhe": [
        {
          "nmdoc": "Credit Note NLS",
          "fno": 44,
          "fdata": "2025-12-05T00:00:00.000Z",
          "qtt": 0,
          "epv": 28.01,
          "total": -28.01
        }
      ]
    },
    {
      "obrano": 3847,
      "design": "5643/500 SUDADERA KIDS-O EST. NEW YORK",
      "cor": "805 - HIELO",
      "foto": "Desenhos\\2025\\CLI-1567-2025\\NOVA IORQUE.JPG",
      "cliente": "ZARA BEBÉ MENINO",
      "totalGrupo": -40.86,
      "detalhe": [
        {
          "nmdoc": "Credit Note NLS",
          "fno": 43,
          "fdata": "2025-12-03T00:00:00.000Z",
          "qtt": 0,
          "epv": 40.86,
          "total": -40.86
        }
      ]
    },
    {
      "obrano": 3873,
      "design": "5643/628 KIDS-A SUDADERA SUPER FAMILY",
      "cor": "681 - BURGUNDY",
      "foto": "Desenhos\\2025\\CLI-1920-2025\\SUDADERA BURGUNDY DAD_PREVIEW.JPG",
      "cliente": "ZARA BEBÉ MENINA",
      "totalGrupo": 55250,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 725,
          "fdata": "2025-12-03T00:00:00.000Z",
          "qtt": 13000,
          "epv": 4.25,
          "total": 55250
        }
      ]
    },
    {
      "obrano": 3874,
      "design": "5646/600 CTA K POP DH GOLDEN",
      "cor": "712 - CRUDO",
      "foto": "Desenhos\\2025\\CLI-2078-2025\\K-POP.JPG",
      "cliente": "ZARA MENINA",
      "totalGrupo": 21775,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 728,
          "fdata": "2025-12-04T00:00:00.000Z",
          "qtt": 6500,
          "epv": 3.35,
          "total": 21775
        }
      ]
    },
    {
      "obrano": 3876,
      "design": "5643/628 KIDS-A SUDADERA SUPER FAMILY",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-1919-2025\\SUDADERA VIGORE MOM V1_PREVIEW.JPG",
      "cliente": "ZARA BEBÉ MENINA",
      "totalGrupo": 53150.5,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 726,
          "fdata": "2025-12-03T00:00:00.000Z",
          "qtt": 12506,
          "epv": 4.25,
          "total": 53150.5
        }
      ]
    },
    {
      "obrano": 3893,
      "design": "9006/629 CTA OSO Y PERRO (E) PASIES PICO DIC",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-2067-2025\\RIB URSO MESCLA.JPG",
      "cliente": "ZARA MENINA",
      "totalGrupo": 21663,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 722,
          "fdata": "2025-12-02T00:00:00.000Z",
          "qtt": 7470,
          "epv": 2.9,
          "total": 21663
        }
      ]
    },
    {
      "obrano": 3896,
      "design": "9006/630 CTA OSO Y PERRO (E) CALOR",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-2070-2025\\CAPTURARGRIS.JPG",
      "cliente": "ZARA MENINA",
      "totalGrupo": 11869.7,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 723,
          "fdata": "2025-12-02T00:00:00.000Z",
          "qtt": 4093,
          "epv": 2.9,
          "total": 11869.7
        }
      ]
    },
    {
      "obrano": 3901,
      "design": "5643/612 SUDADERA CAPIBARA ESTAMPADO DELANTERO Y TRASERO",
      "cor": "620 - ROSA",
      "foto": "Desenhos\\2025\\CLI-2044-2025\\FICHA_V1_PREVIEW.JPG",
      "cliente": "ZARA MENINA",
      "totalGrupo": 69.72,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 729,
          "fdata": "2025-12-05T00:00:00.000Z",
          "qtt": 14,
          "epv": 4.98,
          "total": 69.72
        }
      ]
    },
    {
      "obrano": 3911,
      "design": "9006/629 CTA OSO Y PERRO (E) PASIES PICO DIC",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-2067-2025\\RIB URSO MESCLA.JPG",
      "cliente": "ZARA MENINA",
      "totalGrupo": 319,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 724,
          "fdata": "2025-12-02T00:00:00.000Z",
          "qtt": 110,
          "epv": 2.9,
          "total": 319
        }
      ]
    },
    {
      "obrano": 3912,
      "design": "5643/509 KIDS-A SUDADERAS DIVERTIDAS ENERO (E) USA",
      "cor": "621 - ROSA PAST",
      "foto": "Desenhos\\2025\\CLI-2116-2025\\FICHA V1_01.JPG",
      "cliente": "ZARA BEBÉ MENINA",
      "totalGrupo": 83.7,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 729,
          "fdata": "2025-12-05T00:00:00.000Z",
          "qtt": 18,
          "epv": 4.65,
          "total": 83.7
        }
      ]
    },
    {
      "obrano": 3915,
      "design": "5643/509 KIDS-A SUDADERAS DIVERTIDAS ENERO (E) USA",
      "cor": "712 - CRUDO",
      "foto": "Desenhos\\2025\\CLI-2131-2025\\SUDADERA STICKERS_PREVIEW.JPG",
      "cliente": "ZARA BEBÉ MENINA",
      "totalGrupo": 83.7,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 729,
          "fdata": "2025-12-05T00:00:00.000Z",
          "qtt": 18,
          "epv": 4.65,
          "total": 83.7
        }
      ]
    },
    {
      "obrano": 3916,
      "design": "5643/559 - KIDS-O CTA M/C AOP PERRO FC FEB",
      "cor": "251 - BLAN. ROTO",
      "foto": "Desenhos\\2025\\CLI-2103-2025\\PEÇA.JPG",
      "cliente": "ZARA BEBÉ MENINO",
      "totalGrupo": 45,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 729,
          "fdata": "2025-12-05T00:00:00.000Z",
          "qtt": 18,
          "epv": 2.5,
          "total": 45
        }
      ]
    },
    {
      "obrano": 3929,
      "design": "9006/630 CTA OSO Y PERRO (E) CALOR",
      "cor": "250 - BLANCO",
      "foto": "Desenhos\\2025\\CLI-2071-2025\\CAPTURARBEG.JPG",
      "cliente": "ZARA MENINA",
      "totalGrupo": 261,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 724,
          "fdata": "2025-12-02T00:00:00.000Z",
          "qtt": 90,
          "epv": 2.9,
          "total": 261
        }
      ]
    },
    {
      "obrano": 3930,
      "design": "9006/630 CTA OSO Y PERRO (E) CALOR",
      "cor": "803 - GRIS VIGO",
      "foto": "Desenhos\\2025\\CLI-2070-2025\\CAPTURARGRIS.JPG",
      "cliente": "ZARA MENINA",
      "totalGrupo": 232,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 724,
          "fdata": "2025-12-02T00:00:00.000Z",
          "qtt": 80,
          "epv": 2.9,
          "total": 232
        }
      ]
    },
    {
      "obrano": 3943,
      "design": "5643/572 - KIDS - O CTA M/C CAPS ENERO AOP PATOS (E).COM",
      "cor": "310 - AMAR. MED",
      "foto": "Desenhos\\2025\\CLI-2072-2025\\PEÇA.JPG",
      "cliente": "ZARA BEBÉ MENINO",
      "totalGrupo": 52.2,
      "detalhe": [
        {
          "nmdoc": "Invoice",
          "fno": 729,
          "fdata": "2025-12-05T00:00:00.000Z",
          "qtt": 18,
          "epv": 2.9,
          "total": 52.2
        }
      ]
    }
  ]
}

*/
