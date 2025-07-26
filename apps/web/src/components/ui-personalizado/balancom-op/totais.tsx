import { BmTotais } from "@repo/tipos/qualidade_balancom";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNCasasDecimais } from "@/lib/my-utils";

type TotaisProps = { totais: BmTotais; malhaTotalUsada: number };
const Totais = ({ totais, malhaTotalUsada }: TotaisProps) => {
  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mx-auto">
        Totais
      </h3>
      <div>
        <Table className="max-w-4xl mx-auto ">
          <TableHeader className="bg-accent">
            <TableRow className="!border-0 border-none">
              <TableHead className="border text-center">
                Qtde T. peças
              </TableHead>
              <TableHead className="border text-center">Peso bruto</TableHead>
              <TableHead className="border text-center">Peso liquido</TableHead>
              <TableHead className="border text-center">
                Malha comprada
              </TableHead>
              <TableHead className="border text-center">
                Perdas totais
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            <TableRow>
              <TableCell className="border text-center">
                {totais.totalQtt}
              </TableCell>
              <TableCell className="border text-center">
                {totais.totalPesoBruto}
              </TableCell>
              <TableCell className="border text-center">
                {totais.totalPesoLiquido}
              </TableCell>
              <TableCell className="border text-center">
                {formatNCasasDecimais(malhaTotalUsada, 4)}
              </TableCell>
              <TableCell className="border text-center">
                {malhaTotalUsada === 0
                  ? ""
                  : formatNCasasDecimais(
                      ((totais.totalPesoLiquido - malhaTotalUsada) /
                        malhaTotalUsada) *
                        100,
                      3
                    ) + "%"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export default Totais;
