"use client";
import { PesquisaFaturasPlaneadasSchema } from "@repo/tipos/joana/faturasplan";
import { useSuspenseQuery } from "@repo/trpc";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/use-debounce";
import { formatMoneyPT } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

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
                <div className="block lg:hidden w-full  flex-col">Móvel</div>

                {/* DESKTOP version (>= lg) */}
                <div className="hidden w-full lg:block">
                  <Table className="w-full border border-border rounded-md border-collapse ">
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Semana
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Data
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Pedido
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Op
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Cliente
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Modelo
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Fornecedor
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Valor Seriço
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Valor Total
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Qtt Prevista
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Valor Op
                        </TableHead>
                        <TableHead className="text-center font-semibold border border-border h-7">
                          Valor Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {data.dadosMoveis.map((s, sIdx) => {
                        let semanaRowAdded = false;
                        const rows: React.JSX.Element[] = [];
                        s.dataSemanda.map((d, dIdx) => {
                          let dataRowAdded = false;

                          d.detalhe.map((de, deIdx) => {
                            rows.push(
                              <TableRow key={`${sIdx}-${dIdx}-${deIdx}-`}>
                                {!semanaRowAdded && (
                                  <TableCell
                                    className="border border-border text-center  h-2 px-1 py-0"
                                    rowSpan={s.spanSemana}
                                  >
                                    {s.SemanaNumero}
                                  </TableCell>
                                )}

                                {!dataRowAdded && (
                                  <TableCell
                                    rowSpan={d.spanData}
                                    className="border border-border text-center  h-2 px-1 py-0"
                                  >
                                    {d.data.toLocaleDateString("pt-PT")}
                                  </TableCell>
                                )}

                                <>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    {de.pedido}
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    {de.obrano}
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    {de.cliente}
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    {de.design}
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    <div className="flex flex-col">
                                      {de.fornecedores.map((f) => (
                                        <span key={f.nome}>{f.nome}</span>
                                      ))}
                                    </div>
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    <div className="flex flex-col">
                                      {de.fornecedores.map((f) => (
                                        <span key={f.nome}>
                                          {formatMoneyPT(f.valorServico)}
                                        </span>
                                      ))}
                                    </div>
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    <div className="flex flex-col">
                                      {de.fornecedores.map((f) => (
                                        <span key={f.nome}>
                                          {formatMoneyPT(
                                            f.valorServico * de.qtt
                                          )}
                                        </span>
                                      ))}
                                    </div>
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    {de.qtt}
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    {formatMoneyPT(de.u_total)}
                                  </TableCell>
                                  <TableCell className="border border-border text-center h-2 px-1 py-0">
                                    {formatMoneyPT(de.valorTotail)}
                                  </TableCell>
                                </>
                              </TableRow>
                            );
                            semanaRowAdded = true;
                            dataRowAdded = true;
                          });
                        });

                        return rows;
                      })}
                    </TableBody>
                  </Table>
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
