import { TamanhosQuantidadeDto } from "@repo/tipos/joana/corteporop";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TabelaTamanhosQttProps = {
  dados: TamanhosQuantidadeDto;
  dados2?: TamanhosQuantidadeDto;
};
const TabelaTamanhosQtt = ({ dados, dados2 }: TabelaTamanhosQttProps) => {
  if (dados2 && dados.length !== dados2.length) return <span>Erro...</span>;
  return (
    <Table className="border border-border rounded-md border-collapse max-w-[500px] mx-auto ">
      <TableHeader className="bg-muted">
        <TableRow>
          {dados2 && (
            <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
              <span className="text-xs font-semibold">Tipo</span>
            </TableHead>
          )}
          {dados.map((p) => (
            <TableHead
              key={p.tam}
              className="border border-border text-center min-w-12 max-w-25 h-7 "
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
          {dados2 && (
            <TableCell>
              {" "}
              <span className="text-xs font-semibold">Env.</span>
            </TableCell>
          )}
          {dados.map((p) => (
            <TableCell
              key={p.tam}
              className="border border-border text-center min-w-12 max-w-25 h-2 p-0"
            >
              {p.qtt}
            </TableCell>
          ))}

          <TableCell className="border border-border text-center min-w-12 max-w-25 h-2 p-0 font-semibold">
            {dados.reduce((sum, p) => sum + p.qtt, 0)}
          </TableCell>
        </TableRow>
        {dados2 && (
          <TableRow>
            <TableCell>
              <span className="text-xs font-semibold">Rec.</span>
            </TableCell>
            {dados2.map((p) => (
              <TableCell
                key={p.tam}
                className="border border-border text-center min-w-12 max-w-25 h-2 p-0"
              >
                {p.qtt}
              </TableCell>
            ))}

            <TableCell className="border border-border text-center min-w-12 max-w-25 h-2 p-0 font-semibold">
              {dados2.reduce((sum, p) => sum + p.qtt, 0)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TabelaTamanhosQtt;
