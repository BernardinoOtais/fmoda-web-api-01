import { SizeQuantityDto } from "@repo/tipos/pdf";
import React from "react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DadosTabelaProps = {
  titulo: string;
  dados: SizeQuantityDto[];
  total: number;
  cor?: string;
};
const DadosTabela = ({ titulo, dados, total, cor }: DadosTabelaProps) => {
  return (
    <Card className="w-full  text-center gap-1 p-1">
      <CardContent>
        <CardTitle className="font-bold p-2">{titulo}</CardTitle>
        <Table className="border border-border rounded-md border-collapse mx-auto">
          <TableHeader className="bg-muted">
            <TableRow>
              {cor && (
                <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                  Cor
                </TableHead>
              )}
              {dados.map((p) => (
                <TableHead
                  key={p.tam}
                  className="border border-border text-center min-w-25 max-w-36 h-7 "
                >
                  {p.tam}
                </TableHead>
              ))}
              <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {cor && (
                <TableCell className="border border-border text-center min-w-12 max-w-25 h-2 p-0 font-semibold">
                  {cor}
                </TableCell>
              )}
              {dados.map((p) => (
                <TableCell
                  key={p.tam}
                  className="border border-border text-center min-w-25 max-w-36  h-2 p-0"
                >
                  {p.qtt}
                </TableCell>
              ))}
              <TableCell className="border border-border text-center min-w-12 max-w-25 h-2 p-0 font-semibold">
                {total}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DadosTabela;
