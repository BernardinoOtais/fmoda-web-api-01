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

type ComposicaoConsunosProps = {
  totais: BmTotais;
  malhaTotalUsada: number;
};
const ComposicaoConsunos = ({
  totais,
  malhaTotalUsada,
}: ComposicaoConsunosProps) => {
  //console.log(totais);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="border rounded-lg text-center">
            Qtde T. peças
          </TableHead>
          <TableHead className="border rounded-lg text-center">
            Peso bruto
          </TableHead>
          <TableHead className="border rounded-lg text-center">
            Peso liquido
          </TableHead>
          <TableHead className="border rounded-lg text-center">
            Malha comprada
          </TableHead>
          <TableHead className="border rounded-lg text-center">
            Perdas totais
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="text-xs">
        <TableRow>
          <TableCell className="border rounded-lg text-center">
            {totais.totalQtt}
          </TableCell>
          <TableCell className="border rounded-lg text-center">
            {totais.totalPesoBruto}
          </TableCell>
          <TableCell className="border rounded-lg text-center">
            {totais.totalPesoLiquido}
          </TableCell>
          <TableCell className="border rounded-lg text-center">
            {formatNCasasDecimais(malhaTotalUsada, 4)}
          </TableCell>
          <TableCell className="border rounded-lg text-center">
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
  );
};

export default ComposicaoConsunos;
