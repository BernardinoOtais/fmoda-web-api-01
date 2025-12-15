import { FaturacaoMovelDto } from "@repo/tipos/joana/faturas";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LazyFotoClient } from "@/components/ui-personalizado/fotos/lazy-foto-client";
import { formatMoneyPT } from "@/lib/my-utils";

type FaturacaoMovelProps = {
  faturacaoMovel: FaturacaoMovelDto;
  totalGeral: number;
};
const FaturacaoMovel = ({
  faturacaoMovel,
  totalGeral,
}: FaturacaoMovelProps) => {
  return (
    <>
      {faturacaoMovel.map((f) => (
        <Card className="w-ful" key={f.obrano}>
          <CardContent>
            <div className="flex flex-col items-center justify-center border border-border rounded-md p-1 order-1">
              <span>
                Op: <span className="font-bold">{f.obrano}</span>
              </span>
              <span>
                Cliente: <span className="font-bold">{f.cliente}</span>
              </span>
              <span className="text-center ">{f.design}</span>
              <span className="text-center">
                Cor: <span className="font-bold">{f.cor}</span>
              </span>
              {process.env.NODE_ENV === "production" && (
                <LazyFotoClient
                  src={f.foto || ""}
                  alt="Foto Modelo"
                  cssImage="w-40 h-40 object-contain rounded-md border border-border"
                />
              )}
            </div>
            <Table className="border border-border rounded-md border-collapse max-w-[500px] mx-auto ">
              <TableHeader className="bg-muted">
                <TableRow className="border border-border text-center font-semibold h-7">
                  <TableHead className="border border-border text-center p-0 h-7 ">
                    Data
                  </TableHead>
                  <TableHead className="border border-border text-center p-0 h-7 ">
                    Doc.N.
                  </TableHead>
                  <TableHead className="border border-border text-center p-0 h-7 ">
                    Tipo Doc.
                  </TableHead>
                  <TableHead className="border border-border text-center p-0 h-7 ">
                    Qtt F.
                  </TableHead>
                  <TableHead className="border border-border text-center p-0 h-7 ">
                    Preço
                  </TableHead>
                  <TableHead className="border border-border text-center p-0 h-7 ">
                    Total F.
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {f.detalhe.map((d) => (
                  <TableRow key={d.fno}>
                    <TableCell className="border border-border text-center h-2 p-0">
                      {d.fdata.toLocaleDateString("pt-PT")}
                    </TableCell>
                    <TableCell className="border border-border text-center h-2 p-0">
                      {d.fno}
                    </TableCell>
                    <TableCell className="border border-border text-center h-2 p-0">
                      {d.nmdoc}
                    </TableCell>
                    <TableCell className="border border-border text-center h-2 p-0">
                      {d.qtt}
                    </TableCell>
                    <TableCell className="border border-border text-center h-2 p-0">
                      {formatMoneyPT(d.epv)}
                    </TableCell>
                    <TableCell className="border border-border text-center h-2 p-0">
                      {formatMoneyPT(d.total)}
                    </TableCell>
                  </TableRow>
                ))}
                {f.detalhe.length > 1 && (
                  <TableRow className="font-semibold border border-border h-2 ">
                    <TableCell
                      colSpan={5}
                      className="text-right px-2 py-0 border-r border-border"
                    >
                      T. do grupo:
                    </TableCell>
                    <TableCell className="text-center p-0">
                      {formatMoneyPT(f.totalGrupo)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
      <div className="w-full  flex justify-end items-center">
        <span className="font-semibold">Total:</span>
        <span className="ml-2 font-semibold">{formatMoneyPT(totalGeral)}</span>
      </div>
    </>
  );
};

export default FaturacaoMovel;
