"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoneyPT } from "@/lib/my-utils";
import { useTRPC } from "@/trpc/client";

type FaturacaoPlaneadaResumoProps = { dataIni: Date; dataFini: Date };
const FaturacaoPlaneadaResumo = ({
  dataIni,
  dataFini,
}: FaturacaoPlaneadaResumoProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.joanaFaturacaoPlaneada.getFaturacaoPlaneada.queryOptions({
      dataIni,
      dataFini,
      fornecedor: null,
    })
  );
  return (
    <div>
      <span className="font-bold text-center ">{`Faturação planeada de ${dataIni.toLocaleDateString("pt-PT")} a ${dataFini.toLocaleDateString("pt-PT")}`}</span>
      <Table className=" border border-border rounded-md border-collapse w-auto mx-auto">
        <TableHeader className="bg-muted ">
          <TableRow>
            <TableHead className="text-center font-semibold border border-border h-7">
              Semana
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Qtt
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Valor a Pagar
            </TableHead>
            <TableHead className="text-center font-semibold border border-border h-7">
              Valor a Receber
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.dados.map((d) => (
            <TableRow key={d.SemanaNumero}>
              <TableCell className="border border-border  h-2 px-1 py-0 text-center w-0">
                {d.SemanaNumero}
              </TableCell>
              <TableCell className="border border-border  h-2 px-1 py-0 text-right w-0">
                {d.qtt}
              </TableCell>
              <TableCell className="border border-border  h-2 px-1 py-0 text-right w-0">
                {formatMoneyPT(d.valorServicoT)}
              </TableCell>
              <TableCell className="border border-border  h-2 px-1 py-0 text-right w-0">
                {formatMoneyPT(d.valorTotalFatura)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-semibold border border-border h-2 ">
            <TableCell className="text-center px-1 py-0 border-r border-border">
              Total:
            </TableCell>
            <TableCell className="text-right px-1 py-0 border-r border-border">
              {data.qttTotal}
            </TableCell>
            <TableCell className="text-right px-1 py-0 border-r border-border">
              {formatMoneyPT(data.valorTotalAPagar)}
            </TableCell>
            <TableCell className="text-right px-1 py-0 border-r border-border">
              {formatMoneyPT(data.valorTotalAReceber)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default FaturacaoPlaneadaResumo;
